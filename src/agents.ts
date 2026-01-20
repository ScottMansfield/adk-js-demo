import { LlmAgent } from "@google/adk";
import {
  projectLeadPrompt,
  designConsultantPrompt,
  materialSourcerPrompt,
  contractorScoutPrompt,
} from "./prompts/index.js";

const designConsultantAgent = new LlmAgent({
  name: "designConsultantAgent",
  model: "gemini-3-flash-preview",
  description:
    "The creative engine. It uses pure LLM reasoning to bridge " +
    "the gap between 'vibes' and 'specs.'",
  instruction: designConsultantPrompt,
});

const materialSourcerAgent = new LlmAgent({
  name: "materialSourcerAgent",
  model: "gemini-3-flash-preview",
  description:
    "The procurement specialist. It takes the abstract list from " +
    "the designer and finds concrete reality.",
  instruction: materialSourcerPrompt,
});

const contractorScoutAgent = new LlmAgent({
  name: "contractorScoutAgent",
  model: "gemini-3-flash-preview",
  description:
    "The logistics handler. It finds people and manages initial " +
    "communication.",
  instruction: contractorScoutPrompt,
});

export const rootAgent = new LlmAgent({
  name: "projectLeadAgent",
  model: "gemini-3-flash-preview",
  description:
    "The interface between the user and the renovation team." +
    "It breaks down the user's request, decides which specialist " +
    "to call, transfers the necessary context, and synthesizes " +
    "the final report.",
  instruction: projectLeadPrompt,
  subAgents: [
    designConsultantAgent,
    materialSourcerAgent,
    contractorScoutAgent,
  ],
});
