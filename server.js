// Anchor roadmap backend
// Proxies goal -> roadmap requests to the Anthropic API using YOUR api key.
// The Android app calls this server instead of Claude's in-browser "sample" capability.

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the app itself (www/index.html, manifest, icons, service worker)
// from this same server, so there's only ONE url and ONE deployment to manage.
app.use(express.static(path.join(__dirname)));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-6';

if (!ANTHROPIC_API_KEY) {
  console.warn('WARNING: ANTHROPIC_API_KEY is not set. Set it before deploying.');
}


app.post('/api/roadmap', async (req, res) => {
  try {
    const goal = (req.body && req.body.goal || '').toString().trim();
    const timeframe = (req.body && req.body.timeframe || '').toString().trim();

    if (!goal) {
      return res.status(400).json({ error: 'goal is required' });
    }

    const timeInstruction = timeframe
      ? `The person wants to reach this goal within: "${timeframe}". Pace the steps so all of them realistically fit inside that total window, and give each step a short "when" label describing its place in that window (e.g. "Week 1", "Days 1-3", "Weeks 3-4", "Month 2") using units that make sense for the total timeframe.`
      : `No deadline was given. Still give each step a short relative "when" label describing roughly when to do it (e.g. "Week 1", "Early on", "Once comfortable with basics").`;

    const prompt = `Break the following goal into a clear, motivating roadmap of 5 to 8 small, concrete, actionable steps, ordered logically from first to last so that completing them in order accomplishes the goal. Each step text should be short (under 14 words) and start with a verb. ${timeInstruction} Goal: "${goal}". Respond with ONLY valid JSON, no markdown, no commentary, in exactly this shape: {"steps": [{"text": "step one", "when": "Week 1"}, {"text": "step two", "when": "Week 2"}]}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find(function (c) { return c.type === 'text'; });
    if (!textBlock) {
      return res.status(502).json({ error: 'No text in model response' });
    }

    const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('Could not parse model JSON:', cleaned);
      return res.status(502).json({ error: 'Model did not return valid JSON' });
    }

    if (!parsed || !Array.isArray(parsed.steps)) {
      return res.status(502).json({ error: 'Unexpected response shape' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Anchor roadmap server listening on port ' + PORT);
});
