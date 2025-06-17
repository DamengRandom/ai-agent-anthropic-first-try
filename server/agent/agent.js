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
}); // can be treated as task 1 agent

const jsExecutor = tool(async ({ code }) => {
  console.log("-------------Before code executed---------------");
  const response = await fetch(process.env.EXECUTOR_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  console.log("-------------After code executed----------------");

  const result = await response.json();

  return result;
}, {
  name: "run_javascript_code_tool",
  description: `
    Run general purpose javascript code.
    This can be used to access Internet or do any computation that you need.
    The output will be composed of the stdout and stderr.
    The code should be written in a way that it can be executed with javascript eval in node environment.
  `,
  schema: z.object({
    code: z.string().describe('The code to run'),
  })
}); // can be treated as task 2 agent

const model = new ChatAnthropic({
  modelName: "claude-3-5-sonnet-20241022",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

const checkpointSaver = new MemorySaver(); // adding some memory functionality for the agent to memorize the contexts ~

export const agent = createReactAgent({
  llm: model,
  tools: [weatherTool, jsExecutor], // could access database, run js code
  checkpointSaver
});

// below code is mocking the user to ask agent questions 

// const result = await agent.invoke({
//   messages: [{
//     role: 'user',
//     content: "Whats the weather in Jinan?",
//   }]
// }, {
//   configurable: { thread_id: 42 }
// });

// const followUp = await agent.invoke({
//   messages: [{
//     role: 'user',
//     content: "What city is that for?",
//   }]
// }, {
//   configurable: { thread_id: 42 }
// });

// console.log("Result: ", result?.messages?.at(-1).content);
// console.log("Follow up: ", followUp?.messages?.at(-1).content);