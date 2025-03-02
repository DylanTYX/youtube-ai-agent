import { ChatAnthropic } from "@langchain/anthropic";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import wxflows from "@wxflows/sdk/langchain";

// Connect to wxflows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_APIKEY,
});

// Retrieve the tools
const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

export const initializeModel = () => {
  const model = new ChatAnthropic({
    modelName: "claude-3-7-sonnet-20250219",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    temperature: 0.7, // Higher temperature for more creative responses
    maxTokens: 4096, // Maximum number of tokens to generate in the response
    streaming: true, // Enable streaming mode for SSE
    clientOptions: {
      defaultHeaders: { "anthropic-beta": "prompt-caching-2025-03-02" },
    },
    callbacks: [
      {
        handleLLMStart: async () => {
          console.log("Starting LLM call");
        },
        handleLLMEnd: async (output) => {
          console.log("End of LLM call", output);
          const usage = output.llmOutput?.usage;
          if (usage) {
          }
        },
      },
    ],
  }).bindTools(tools);

  return model;
};
