import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  modelName: "claude-3-5-sonnet-20241022",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

const agent = createReactAgent({
  llm: model,
  tools: []
});

const result = await agent.invoke({
  messages: [{
    role: 'user',
    content: "Hello, how can you help me?"
  }]
});

console.log("Result: ", result?.messages?.at(-1).content);
