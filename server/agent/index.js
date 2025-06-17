import express from 'express';
import cors from 'cors';
import { agent } from './agent.js';

const app = express();
const port = 8723;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get('/', (req, res) => {
  res.send("Hello, world!");
});

app.post('/generate', async (req, res) => {
  try {
    const { prompt, threadId } = req.body;
    const result = await agent.invoke({
      messages: [{
        role: 'user',
        content: prompt,
      }]
    }, { configurable: { thread_id: threadId } });

    res.json(result?.messages?.at(-1)?.content);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
