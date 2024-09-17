import Anthropic from "@anthropic-ai/sdk";

export let anthropic: Anthropic

export const initAnthropic = () => {
  anthropic = new Anthropic({
    apiKey: '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',
  })
}