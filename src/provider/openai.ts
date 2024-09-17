import { ChatGPTAPI } from 'chatgpt'

export let chatgpt: ChatGPTAPI

export const initOpenai = () => {
  chatgpt = new ChatGPTAPI({
    apiKey: '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',
    completionParams: {
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      top_p: 0.7,
      max_tokens: 100
    }
  })
}