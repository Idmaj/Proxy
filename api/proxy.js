const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Extract the target URL from the query parameters
    const { url } = req.query;

    if (!url) {
      res.status(400).json({ error: 'Missing "url" query parameter.' });
      return;
    }

    
    // Validate the URL
    let targetUrl;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      res.status(400).json({ error: 'Invalid URL provided.' });
      return;
    }
      
/*
    // **Security Enhancement:** Restrict to allowed domains
    const allowedDomains = ['example.com', 'api.example.com']; // Modify as needed
    if (!allowedDomains.includes(targetUrl.hostname)) {
      res.status(403).json({ error: 'Forbidden domain.' });
      return;
    }
*/
    // Prepare the request options
    const options = {
      method: req.method,
      headers: { ...req.headers },
    };

    // If there is a body, include it
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = req.body;
    }

    // Remove headers that might cause issues
    delete options.headers['host'];
    delete options.headers['origin'];
    delete options.headers['referer'];

    // Fetch the target URL
    const response = await fetch(targetUrl, options);

    // Set the response headers
    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });

    // Set the status code
    res.status(response.status);

    // Stream the response body
    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};
