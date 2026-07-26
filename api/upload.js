import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { filename, fileContent } = req.body;
  if (!filename || !fileContent) {
    return res.status(400).json({ detail: 'Missing filename or fileContent in request body' });
  }

  // Validate file extension type (images only)
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ detail: 'Unsupported file format. Image uploads only.' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo) {
    return res.status(500).json({ detail: 'Server configuration error: GITHUB_TOKEN or GITHUB_REPO are missing.' });
  }

  // Generate a unique filename using a random hex string to avoid collisions
  const randomHex = crypto.randomBytes(8).toString('hex');
  const uniqueFilename = `upload_${randomHex}${ext}`;
  const githubUrl = `https://api.github.com/repos/${repo}/contents/public/images/${uniqueFilename}`;

  try {
    const putRes = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify({
        message: `media: upload image ${uniqueFilename}`,
        content: fileContent // Already base64 encoded from frontend
      })
    });

    if (putRes.ok) {
      const fileUrl = `/images/${uniqueFilename}`;
      return res.status(200).json({
        url: fileUrl,
        filename: uniqueFilename,
        source: 'github_public'
      });
    } else {
      const errText = await putRes.text();
      return res.status(putRes.status).json({ detail: `Failed to upload image to GitHub: ${errText}` });
    }
  } catch (error) {
    return res.status(500).json({ detail: `Server error: ${error.message}` });
  }
}
