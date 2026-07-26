import { v2 as cloudinary } from 'cloudinary';

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

  const { params } = req.body;
  if (!params) {
    return res.status(400).json({ detail: 'Missing parameters to sign' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ detail: 'Server configuration error: Cloudinary environment variables are missing.' });
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);
    return res.status(200).json({
      signature,
      api_key: apiKey,
      cloud_name: cloudName
    });
  } catch (error) {
    return res.status(500).json({ detail: `Failed to sign request: ${error.message}` });
  }
}
