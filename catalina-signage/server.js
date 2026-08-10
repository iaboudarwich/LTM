const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const EVENTS_FILE = path.join(__dirname, 'events.json');
const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (_) {
    // .env is optional
  }
}
loadEnv();

const NEWS_PROMPTS = {
  cnn:
    'You generate plausible breaking news for a digital signage display. ' +
    'Produce 5 current US/world news headlines (mix of Politics, World, Business, Tech, Health, Sports) ' +
    'plus 8 short ticker bullets. The first story is the lead. ' +
    'Reply with ONLY a JSON object, no prose, matching this schema:\n' +
    '{"stories":[{"category":"...","headline":"...","time":"e.g. 35 minutes ago"}],"ticker":["..."]}\n' +
    'Exactly 5 stories and 8 ticker items. Headlines should be concise (max 14 words). ' +
    'Categories should be one or two words in title case.',
  bloomberg:
    'You generate plausible market and financial news for a digital signage display. ' +
    'Produce 5 current finance headlines (mix of Markets, Commodities, FX, Crypto, Deals, Earnings) ' +
    'plus 8 short market ticker items in the form "SYMBOL PRICE +/-PCT%" (e.g., "AAPL 192.45 +1.12%"). ' +
    'Include indices (S&P 500, NASDAQ, DOW), at least one crypto (BTC), and at least one commodity (WTI or GOLD). ' +
    'The first story is the lead. ' +
    'Reply with ONLY a JSON object, no prose, matching this schema:\n' +
    '{"stories":[{"category":"...","headline":"...","time":"e.g. 22 minutes ago"}],"ticker":["..."]}\n' +
    'Exactly 5 stories and 8 ticker items. Headlines max 14 words.',
};

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=33.7701&longitude=-118.1937' +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl' +
  '&hourly=visibility,uv_index' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
  '&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch' +
  '&timezone=America%2FLos_Angeles&forecast_days=5';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function fetchWeather() {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: {
        'User-Agent': 'catalina-signage/1.0',
        Accept: 'application/json',
      },
    };
    https
      .get(WEATHER_URL, opts, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`Open-Meteo responded with status ${res.statusCode}`));
          return;
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

function extractJson(text) {
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (_) {
    return null;
  }
}

function fetchNews(outlet) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const err = new Error('missing_api_key');
      err.statusCode = 401;
      return reject(err);
    }
    const prompt = NEWS_PROMPTS[outlet];
    if (!prompt) {
      const err = new Error('invalid_outlet');
      err.statusCode = 400;
      return reject(err);
    }
    const body = JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    const opts = {
      method: 'POST',
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-length': Buffer.byteLength(body),
        'User-Agent': 'catalina-signage/1.0',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode === 401 || res.statusCode === 403) {
          const e = new Error('invalid_api_key');
          e.statusCode = res.statusCode;
          return reject(e);
        }
        if (res.statusCode !== 200) {
          const e = new Error('upstream_status_' + res.statusCode);
          e.statusCode = 502;
          return reject(e);
        }
        try {
          const json = JSON.parse(data);
          const text =
            json && json.content && json.content[0] && json.content[0].text;
          const parsed = extractJson(text);
          if (
            !parsed ||
            !Array.isArray(parsed.stories) ||
            !Array.isArray(parsed.ticker)
          ) {
            const e = new Error('malformed_response');
            e.statusCode = 502;
            return reject(e);
          }
          resolve(parsed);
        } catch (err) {
          err.statusCode = 502;
          reject(err);
        }
      });
    });
    req.on('error', (err) => {
      err.statusCode = 502;
      reject(err);
    });
    req.write(body);
    req.end();
  });
}

function readJsonBody(req, limit) {
  return new Promise((resolve, reject) => {
    let body = '';
    let aborted = false;
    req.on('data', (chunk) => {
      if (aborted) return;
      body += chunk;
      if (body.length > limit) {
        aborted = true;
        const e = new Error('payload_too_large');
        e.statusCode = 413;
        reject(e);
      }
    });
    req.on('end', () => {
      if (aborted) return;
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (_) {
        const e = new Error('invalid_json');
        e.statusCode = 400;
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

async function handleNewsProxy(req, res) {
  try {
    const parsed = await readJsonBody(req, 16 * 1024);
    const outlet = String(parsed.outlet || '').toLowerCase();
    if (outlet !== 'cnn' && outlet !== 'bloomberg') {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'invalid_outlet' }));
      return;
    }
    const data = await fetchNews(outlet);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  } catch (err) {
    const status = err.statusCode || 500;
    if (status === 401 || status === 403) {
      console.error('news proxy: invalid Anthropic API key');
    } else {
      console.error('news proxy error:', err.message);
    }
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: err.message || 'server_error' }));
  }
}

function readEvents() {
  try {
    const raw = fs.readFileSync(EVENTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeEvents(events) {
  const tmp = EVENTS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(events, null, 2));
  fs.renameSync(tmp, EVENTS_FILE);
}

function ensureEventsFile() {
  if (!fs.existsSync(EVENTS_FILE)) writeEvents([]);
}

function sanitizeStr(s, max) {
  if (typeof s !== 'string') return '';
  return s.replace(/[\r\n]+/g, ' ').slice(0, max).trim();
}

function buildEventFromBody(body) {
  const name = sanitizeStr(body.name, 200);
  if (!name) return null;
  return {
    name: name,
    date: sanitizeStr(body.date, 120),
    time: sanitizeStr(body.time, 60),
    description: sanitizeStr(body.description, 800),
    location: sanitizeStr(body.location, 200),
  };
}

function jsonResponse(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function handleEventsApi(req, res, reqPath) {
  // GET /api/events
  if (req.method === 'GET' && reqPath === '/api/events') {
    return jsonResponse(res, 200, readEvents());
  }

  // POST /api/events  (create)
  if (req.method === 'POST' && reqPath === '/api/events') {
    try {
      const body = await readJsonBody(req, 16 * 1024);
      const fields = buildEventFromBody(body);
      if (!fields) return jsonResponse(res, 400, { error: 'name_required' });
      const events = readEvents();
      const event = Object.assign({ id: crypto.randomUUID() }, fields);
      events.push(event);
      writeEvents(events);
      return jsonResponse(res, 201, event);
    } catch (err) {
      return jsonResponse(res, err.statusCode || 500, { error: err.message || 'server_error' });
    }
  }

  // /api/events/:id (PUT, DELETE)
  const idMatch = reqPath.match(/^\/api\/events\/([A-Za-z0-9_-]+)$/);
  if (idMatch) {
    const id = idMatch[1];

    if (req.method === 'PUT') {
      try {
        const body = await readJsonBody(req, 16 * 1024);
        const fields = buildEventFromBody(body);
        if (!fields) return jsonResponse(res, 400, { error: 'name_required' });
        const events = readEvents();
        const i = events.findIndex((e) => e.id === id);
        if (i < 0) return jsonResponse(res, 404, { error: 'not_found' });
        events[i] = Object.assign({ id: id }, fields);
        writeEvents(events);
        return jsonResponse(res, 200, events[i]);
      } catch (err) {
        return jsonResponse(res, err.statusCode || 500, { error: err.message || 'server_error' });
      }
    }

    if (req.method === 'DELETE') {
      const events = readEvents();
      const next = events.filter((e) => e.id !== id);
      if (next.length === events.length) return jsonResponse(res, 404, { error: 'not_found' });
      writeEvents(next);
      res.writeHead(204);
      res.end();
      return;
    }
  }

  return jsonResponse(res, 405, { error: 'method_not_allowed' });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const safePath = path
    .normalize(urlPath)
    .replace(/^([\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const type = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const reqPath = req.url.split('?')[0];

  if (req.method === 'GET' && reqPath === '/api/weather') {
    try {
      const data = await fetchWeather();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Failed to fetch weather', detail: err.message }));
    }
    return;
  }

  if (req.method === 'POST' && reqPath === '/api/news') {
    handleNewsProxy(req, res);
    return;
  }

  if (reqPath === '/api/events' || reqPath.startsWith('/api/events/')) {
    handleEventsApi(req, res, reqPath);
    return;
  }

  if ((req.method === 'GET' || req.method === 'HEAD') &&
      (reqPath === '/admin' || reqPath === '/admin/')) {
    req.url = '/admin.html';
    serveStatic(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      'Content-Type': 'text/plain',
      Allow: 'GET, HEAD, POST, PUT, DELETE',
    });
    res.end('Method Not Allowed');
    return;
  }

  serveStatic(req, res);
});

function getNetworkAddresses() {
  const out = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        out.push(iface.address);
      }
    }
  }
  return out;
}

ensureEventsFile();

server.listen(PORT, () => {
  console.log('catalina-signage server listening');
  console.log(`  Local:    http://localhost:${PORT}`);
  const addrs = getNetworkAddresses();
  if (addrs.length === 0) {
    console.log('  Network:  (no LAN interface detected)');
  } else {
    addrs.forEach((addr) => {
      console.log(`  Network:  http://${addr}:${PORT}`);
    });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(
      '\n  Note: ANTHROPIC_API_KEY not set. Create a .env file with' +
        ' ANTHROPIC_API_KEY=sk-ant-... to enable CNN and Bloomberg panels.'
    );
  }
});
