const core = require("@actions/core");

async function createChatGPTAPI(openAiApiKey) {
  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTAPI } = await import("chatgpt");

  const api = new ChatGPTAPI({ apiKey: openAiApiKey });

  return api;
}

function is503or504Error(err) {
  return err.message.includes("503") || err.message.includes("504");
}

async function callChatGPT(api, content, retryOn503) {
  let cnt = 0;
  while (cnt++ <= retryOn503) {
    try {
      const response = await api.sendMessage(content);
      return response;
    } catch (err) {
      if (!is503or504Error(err)) throw err;
    }
  }
}

module.exports = { createChatGPTAPI, callChatGPT };
