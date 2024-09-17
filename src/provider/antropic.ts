import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "../config/envs";

export let anthropic: Anthropic

export const initAnthropic = () => {
  anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  })
}