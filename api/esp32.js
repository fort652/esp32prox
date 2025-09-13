// Vercel serverless function to proxy requests to ESP32
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query, body } = req;
  const { endpoint } = query;

  // ESP32 configuration
  const ESP32_IP = '192.168.0.165';
  const ESP32_PORT = '80';
  const ESP32_BASE_URL = `http://${ESP32_IP}:${ESP32_PORT}`;

  try {
    // Build the target URL
    const targetUrl = `${ESP32_BASE_URL}${endpoint || ''}`;
    
    console.log(`Proxying ${method} request to: ${targetUrl}`);

    // Prepare request options
    const requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
      },
      timeout: 10000, // 10 second timeout
    };

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    // Make request to ESP32
    const response = await fetch(targetUrl, requestOptions);
    
    // Get response data
    const responseText = await response.text();
    
    console.log(`ESP32 response status: ${response.status}`);
    console.log(`ESP32 response: ${responseText}`);

    // Forward the response
    res.status(response.status);
    
    // Try to parse as JSON, fallback to text
    try {
      const jsonData = JSON.parse(responseText);
      res.json(jsonData);
    } catch {
      res.send(responseText);
    }

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Return error response
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message,
      details: 'Unable to connect to ESP32'
    });
  }
}
