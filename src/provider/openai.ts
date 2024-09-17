import { ChatGPTAPI } from 'chatgpt'
import { OPENAI_API_KEY } from '../config/envs'

export let chatgpt: ChatGPTAPI

export const initOpenai = () => {
  try {
    if (OPENAI_API_KEY === undefined) throw new Error('OPENAI_API_KEY is undefined')
    chatgpt = new ChatGPTAPI({
      apiKey: OPENAI_API_KEY,
      completionParams: {
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
        top_p: 0.7,
        max_tokens: 100
      }
    })
  } catch (error) {
    console.log(error)
  }
}