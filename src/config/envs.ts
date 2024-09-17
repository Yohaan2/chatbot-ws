import dotenv from 'dotenv'

dotenv.config()

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
export const PORT = process.env.PORT