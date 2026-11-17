const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = (process.env.API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({status:'ok', service:'student-web'}));
app.get('/api/*', async (req, res) => {
  try { const upstream = await fetch(`${API_URL}${req.originalUrl}`);
    res.status(upstream.status); if (upstream.status !== 204) res.send(await upstream.text()); else res.end();
  } catch (err) { res.status(502).json({error:'Cannot reach Flask API', detail:err.message}); }
});
app.listen(PORT, '0.0.0.0', () => console.log(`Student web listening on ${PORT}; API ${API_URL}`));
