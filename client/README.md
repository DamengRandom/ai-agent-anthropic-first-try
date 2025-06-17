# AI Agent chatbot Demo

This project is done by using Anthropic LLM + custom JS code for creating 2 Agents (weather + code runner), which is going to demo how to create AI agent and how to run this AI agents via API endpoint.

## How to start the app locally

```bash
# checkout to /server/executor folder
cd server/executor
node ts-node index.js --watch
# meanwhile, also checkout to /server/agent folder
cd server/agent
node ts-node --env-file=.env index.js --watch
# now, start client app first
npm run dev
```
