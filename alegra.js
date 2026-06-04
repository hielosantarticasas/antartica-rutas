export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ALEGRA_USER = 'hielosantarticasas@gmail.com';
  const ALEGRA_TOKEN = '1a7cd758f452099b84d8';
  const auth = Buffer.from(`${ALEGRA_USER}:${ALEGRA_TOKEN}`).toString('base64');

  const { endpoint, method = 'GET', body } = req.body || {};
  const endpointGet = req.query?.endpoint;

  const url = `https://app.alegra.com/api/v1${endpoint || endpointGet}`;

  try {
    const options = {
      method: req.method === 'OPTIONS' ? 'GET' : (method || req.method),
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    };

    if (body && (options.method === 'POST' || options.method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
