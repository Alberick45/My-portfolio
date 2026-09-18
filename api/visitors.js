export default async function handler(req, res) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { name, email, timestamp, userAgent } = req.body || {};
  if (!name) {
    return res.status(400).json({ detail: 'Missing visitor name' });
  }

  const newEntry = {
    id: `vis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name,
    email: email || '',
    timestamp: timestamp || new Date().toISOString(),
    userAgent: userAgent || ''
  };

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "Alberick45/My-portfolio"

  if (!token || !repo) {
    console.warn("Server configuration warning: GITHUB_TOKEN or GITHUB_REPO env variables are missing. Logged entry in memory.");
    return res.status(200).json({ detail: 'Visitor logged (ephemeral mode)', entry: newEntry });
  }

  const githubUrl = `https://api.github.com/repos/${repo}/contents/public/visitors.json`;

  try {
    // 1. Fetch current visitors.json from GitHub repository to append
    let currentVisitors = [];
    let sha = null;

    const getRes = await fetch(githubUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      }
    });

    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
      const existingContent = Buffer.from(getData.content, 'base64').toString('utf-8');
      try {
        currentVisitors = JSON.parse(existingContent);
      } catch (e) {
        currentVisitors = [];
      }
    }

    // 2. Append new visitor log
    currentVisitors.unshift(newEntry);

    // Keep max 500 records
    if (currentVisitors.length > 500) {
      currentVisitors = currentVisitors.slice(0, 500);
    }

    const fileContentBase64 = Buffer.from(JSON.stringify(currentVisitors, null, 2)).toString('base64');
    
    const putBody = {
      message: `telemetry: log visitor doorbell entry for ${name}`,
      content: fileContentBase64
    };
    if (sha) {
      putBody.sha = sha;
    }

    const putRes = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify(putBody)
    });

    if (putRes.ok) {
      return res.status(200).json({ detail: 'Visitor logged successfully', entry: newEntry });
    } else {
      const errText = await putRes.text();
      return res.status(putRes.status).json({ detail: `Failed to record visitor log to GitHub: ${errText}` });
    }
  } catch (error) {
    return res.status(500).json({ detail: `Server error: ${error.message}` });
  }
}
