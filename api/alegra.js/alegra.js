const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const ALEGRA_USER = 'hielosantarticasas@gmail.com';
  const ALEGRA_TOKEN = '1a7cd758f452099b84d8';
  const auth = Buffer.from(`${ALEGRA_USER}:${ALEGRA_TOKEN}`).toString('base64');

  const endpoint = req.query.endpoint || (req.body && req.body.endpoint) || '/contacts';
  const method = (req.body && req.body.method) || req.method;
  const body = req.body && req.body.body;
  const url = `https://app.alegra.com/api/v1${endpoint}`;

  try {
    const fetchRes = await fetch(url, {
      method: method === 'OPTIONS' ? 'GET' : method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await fetchRes.json();
    return res.status(fetchRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
