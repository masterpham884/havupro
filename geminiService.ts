
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Service to handle all interactions with the Gemini API.
 * Follows the latest @google/genai SDK guidelines.
 */
export class GeminiService {
  /**
   * Creates a new instance of the GoogleGenAI client.
   * Always uses the latest API key from process.env.API_KEY.
   */
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Generic method to call Gemini generateContent.
   */
  static async callGemini(payload: any, isJson: boolean = false, schema?: any): Promise<string | null> {
    try {
      const ai = this.getAI();
      // Complex text tasks or JSON output use Pro, others use Flash.
      const modelName = isJson ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const config: any = {
        temperature: 0.8,
      };

      if (isJson) {
        config.responseMimeType = "application/json";
        if (schema) {
          config.responseSchema = schema;
        }
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: typeof payload === 'string' ? payload : payload,
        config
      });
      
      // Property access .text instead of method call .text()
      return response.text || null;
    } catch (error) {
      console.error("Gemini Engine Error:", error);
      throw error;
    }
  }

  static async generateVisualPrompts(params: any) {
    const { idea, count, stylePrompt, outLang, voiceType, consistency, visualAnchor, backgroundAnchor, camera, lighting, focus, colorGrade } = params;
    const prompt = `Act as Master Video Prompt Engineer. IDEA: "${idea}". ANCHOR: "${visualAnchor}". BG: "${backgroundAnchor}". STYLE: "${stylePrompt}". LANG: ${outLang}. CAMERA: ${camera}. LIGHT: ${lighting}. FOCUS: ${focus}. COLOR: ${colorGrade}. CONSISTENCY: ${consistency}. VOICE: ${voiceType}. GENERATE EXACTLY ${count} SCENES in format: Scene [N] | Visual | Style | Voices | Shot | Setting | Mood | Audio | Dialog.`;
    return await this.callGemini(prompt);
  }

  static async generateScript(params: any) {
    const { topic, lang, tone, length, format } = params;
    const prompt = `Write a cinematic script. TOPIC: "${topic}". TONE: ${tone}. FORMAT: ${format}. LANG: ${lang}. LENGTH: ${length}.`;
    const schema = {
      type: Type.OBJECT,
      properties: {
        character: { type: Type.STRING },
        background: { type: Type.STRING },
        script: { type: Type.STRING }
      },
      required: ["character", "background", "script"]
    };
    return await this.callGemini(prompt, true, schema);
  }

  static async generateSEO(params: any) {
    const { topic, channel, lang, style } = params;
    const prompt = `SEO Optimization for: ${topic}. Channel: ${channel}. Style: ${style}. Lang: ${lang}. Provide title, viral description, and 30 hashtags.`;
    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        hashtags: { type: Type.STRING }
      },
      required: ["title", "description", "hashtags"]
    };
    return await this.callGemini(prompt, true, schema);
  }

  static async generateThumbnailVariations(params: any) {
    const { context, anchor, style } = params;
    const prompt = `Create 3 viral thumbnail prompts for: ${context}. Subject: ${anchor}. Style: ${style}. Each prompt must be unique and highly clickable.`;
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { id: { type: Type.STRING }, prompt: { type: Type.STRING } },
        required: ["id", "prompt"]
      }
    };
    return await this.callGemini(prompt, true, schema);
  }

  static async generateSpyAnalysis(input: string) {
    const prompt = `Act as a Viral Content Analyst. Analyze this competitor content/script: "${input}". Provide a breakdown of their hook, keywords, and how to replicate it with AI prompts.`;
    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        prompts: { type: Type.STRING },
        script: { type: Type.STRING }
      },
      required: ["title", "description", "prompts", "script"]
    };
    return await this.callGemini(prompt, true, schema);
  }

  static async generateTimelapsePrompt(params: any) {
    const { subject, style, duration } = params;
    const prompt = `Generate a master timelapse prompt for: "${subject}". Style: ${style}. Sequence duration: ${duration}. Describe the light transition from morning to night and seasonal changes.`;
    return await this.callGemini(prompt);
  }

  /**
   * Generates a high-quality image using Gemini 3 Pro Image Preview.
   * Requires a user-selected API key from a paid project.
   */
  static async generateBananaProImage(prompt: string, quality: string, ratio: string) {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `High-end professional thumbnail art: ${prompt}` }] },
        config: { 
          imageConfig: { 
            aspectRatio: ratio as any, 
            imageSize: quality as any 
          } 
        }
      });
      
      // Iterate through parts to find the image data.
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (error) {
      console.error("Image Generation Error:", error);
      throw error;
    }
  }
}
