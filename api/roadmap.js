export default async function handler(req, res) {
  // Setup simple CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { roadmap } = req.body;
  if (!roadmap) {
    return res.status(400).json({ detail: 'Missing roadmap data' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g., "Alberick45/My-portfolio"

  if (!token || !repo) {
    return res.status(500).json({ detail: 'Server configuration error: GITHUB_TOKEN or GITHUB_REPO env variables are missing.' });
  }

  const githubUrl = `https://api.github.com/repos/${repo}/contents/public/roadmap.json`;

  try {
    // 1. Get the current file metadata to retrieve the 'sha'
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
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      return res.status(getRes.status).json({ detail: `Failed to fetch roadmap metadata from GitHub: ${errText}` });
    }

    // 2. Commit the new roadmap.json file content
    const fileContentBase64 = Buffer.from(JSON.stringify(roadmap, null, 2)).toString('base64');
    
    const putBody = {
      message: 'content: update roadmap.json via Vercel Admin Panel',
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
      const putData = await putRes.ok ? await putRes.json() : null;
      return res.status(200).json({ detail: 'Roadmap updated successfully', commit: putData?.commit });
    } else {
      const errText = await putRes.text();
      return res.status(putRes.status).json({ detail: `Failed to commit roadmap.json to GitHub: ${errText}` });
    }
  } catch (error) {
    return res.status(500).json({ detail: `Server error: ${error.message}` });
  }
}
