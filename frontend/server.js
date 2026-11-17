const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = (process.env.API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.get('/health', (_req, res) => res.json({status:'ok', service:'student-web'}));
app.all('/api/*', async (req, res) => {
  try {
    const method = req.method.toUpperCase();
    const options = { method };
    if (!['GET', 'HEAD'].includes(method) && req.body !== undefined) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(req.body);
    }
    const upstream = await fetch(`${API_URL}${req.originalUrl}`, options);
    res.status(upstream.status);
    if (upstream.status !== 204) res.send(await upstream.text()); else res.end();
  } catch (err) { res.status(502).json({error:'Cannot reach Flask API', detail:err.message}); }
});
app.listen(PORT, '0.0.0.0', () => console.log(`Student web listening on ${PORT}; API ${API_URL}`));
