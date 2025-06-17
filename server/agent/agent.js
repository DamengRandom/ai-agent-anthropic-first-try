import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';

const weatherTool = tool(async ({ query }) => {
  console.log("query: ", query);

  // @TODO: Implement the weather tool by fetching an API

  return "The weather in Jinan is sunny";
}, {
  name: "weather",
  description: "Get the weather in a given location",
  schema: z.object({
    query: z.string().describe('The query to use in search'),
  }),
});

const model = new ChatAnthropic({
  modelName: "claude-3-5-sonnet-20241022",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

const checkpointSaver = new MemorySaver(); // adding some memory functionality for the agent to memorize the contexts ~

const agent = createReactAgent({
  llm: model,
  tools: [weatherTool], // could access database,
  checkpointSaver
});

const result = await agent.invoke({
  messages: [{
    role: 'user',
    content: "Whats the weather in Jinan?",
  }]
}, {
  configurable: { thread_id: 42 }
});

const followUp = await agent.invoke({
  messages: [{
    role: 'user',
    content: "What city is that for?",
  }]
}, {
  configurable: { thread_id: 42 }
});

console.log("Result: ", result?.messages?.at(-1).content);
console.log("Follow up: ", followUp?.messages?.at(-1).content);