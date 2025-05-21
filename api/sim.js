const fs = require('fs-extra');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'memory.json');

module.exports = async (req, res) => {
  const { ask, teach } = req.query;

  let memory = {};
  if (fs.existsSync(DB_PATH)) {
    memory = fs.readJsonSync(DB_PATH);
  }

  if (teach) {
    const [question, answer] = teach.split('|');
    if (!question || !answer) {
      return res.status(400).json({ error: 'Use /api/sim?teach=question|answer' });
    }
    memory[question.trim().toLowerCase()] = answer.trim();
    fs.writeJsonSync(DB_PATH, memory, { spaces: 2 });
    return res.json({ success: `Taught: "${question}" → "${answer}"` });
  }

  if (ask) {
    const reply = memory[ask.trim().toLowerCase()];
    return res.json({ reply: reply || 'I don’t know that yet! Teach me using /api/sim?teach=question|answer' });
  }

  return res.status(400).json({ error: 'Use /api/sim?ask=question or /api/sim?teach=question|answer' });
};
