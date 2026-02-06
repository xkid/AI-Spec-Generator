import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

const getGenAI = () => {
  const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("請先設定 Gemini API Key");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Helper to get clean text from response
 */
const getResponseText = (response: any): string => {
  return response.text || '';
};

export const generateIdeaHelp = async (currentInput: string): Promise<string> => {
  try {
    const ai = getGenAI();
    const prompt = `Provide a concise, 1-sentence problem statement for a software idea. 
    The user is thinking about: "${currentInput || 'a useful app'}". 
    Return ONLY the problem statement in Traditional Chinese (Taiwan).`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return getResponseText(response).trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
      return ""; // Fail silently or let UI handle it
    }
    return "無法連接 AI 服務";
  }
};

export const generateUserFlow = async (state: AppState): Promise<{ happyPath: string; exceptions: string }> => {
  try {
    const ai = getGenAI();
    const prompt = `
      Act as a Senior Product Manager.
      Project: ${state.projectName}
      Problem: ${state.problem}
      Audience: ${state.targetAudience.join(', ')} ${state.targetAudienceCustom}
      
      Task:
      1. Create a "Happy Path" user flow (numbered list).
      2. Create "Exception Handling" scenarios (bullet points).
      
      Output format strictly JSON:
      {
        "happyPath": "string (multiline markdown)",
        "exceptions": "string (multiline markdown)"
      }
      Language: Traditional Chinese (Taiwan).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = getResponseText(response);
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { happyPath: "AI 生成失敗，請檢查 API Key", exceptions: "AI 生成失敗，請檢查 API Key" };
  }
};

export const generateFeatures = async (state: AppState): Promise<{ mustHave: string[]; niceToHave: string[] }> => {
  try {
    const ai = getGenAI();
    const prompt = `
      Act as a Senior System Architect.
      Project: ${state.projectName}
      Problem: ${state.problem}
      User Flow: ${state.happyPath}
      
      Task: List functionality features.
      
      Output format strictly JSON:
      {
        "mustHave": ["feature 1", "feature 2"...],
        "niceToHave": ["feature 1", "feature 2"...]
      }
      Language: Traditional Chinese (Taiwan).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = getResponseText(response);
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { mustHave: ["AI 生成失敗，請檢查 API Key"], niceToHave: [] };
  }
};

export const generateDataRequirements = async (state: AppState): Promise<string> => {
   try {
    const ai = getGenAI();
    const prompt = `
      Based on the following features, list the Data Models/Schema requirements (e.g., User, Transaction, Settings).
      Features: ${state.mustHaveFeatures.join(', ')}
      
      Output: Bullet points in Traditional Chinese (Taiwan).
    `;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return getResponseText(response).trim();
  } catch (error) {
    return "無法生成資料需求，請檢查 API Key";
  }
}

export const generateFinalSpec = async (state: AppState): Promise<string> => {
  try {
    const ai = getGenAI();
    const prompt = `
      Create a comprehensive Product Requirement Document (PRD) in Markdown format.
      
      Role: Senior Product Manager & Tech Lead.
      Language: Traditional Chinese (Taiwan).
      
      Content Source:
      1. Project Name: ${state.projectName}
      2. Problem: ${state.problem}
      3. Audience: ${state.targetAudience.join(', ')}
      4. Success Metrics: ${state.successMetrics}
      5. User Flow: ${state.happyPath}
      6. Exceptions: ${state.exceptionHandling}
      7. Must Have Features: ${state.mustHaveFeatures.join(', ')}
      8. Nice To Have Features: ${state.niceToHaveFeatures.join(', ')}
      9. Data Requirements: ${state.dataRequirements}
      10. Storage: ${state.storageType}
      11. Style/Tone: ${state.visualStyle}, ${state.tone}
      12. Devices: ${state.devices.join(', ')}
      
      Format:
      # Project Name
      ## 1. Project Definition
      ...
      ## 2. User Flow
      ...
      ## 3. Functional Requirements
      ...
      ## 4. Technical Specs (Data & Storage)
      ...
      ## 5. UI/UX Guidelines
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME, // Using Pro for better writing
      contents: prompt,
    });
    
    return getResponseText(response);
  } catch (error) {
    console.error("Gemini Error:", error);
    return "# Error generating specification.\nPlease check your API Key and try again.";
  }
};
