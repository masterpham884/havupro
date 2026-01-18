
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static getAI() {
    // ALWAYS use { apiKey: process.env.API_KEY } directly from environment.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async callGemini(payload: any, isJson: boolean = false): Promise<string | null> {
    try {
      const ai = this.getAI();
      // Use gemini-3-pro-preview for complex reasoning (JSON) and gemini-3-flash-preview for general text.
      const modelName = isJson ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: typeof payload === 'string' ? [{ parts: [{ text: payload }] }] : payload,
        config: { 
          responseMimeType: isJson ? "application/json" : "text/plain", 
          temperature: 0.85 
        }
      });
      
      // response.text is a getter property, not a method.
      return response.text || null;
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  static async generateVisualPrompts(params: any) {
    const { idea, count, stylePrompt, outLang, voiceType, consistency, visualAnchor, backgroundAnchor, camera, lighting, focus, colorGrade } = params;
    
    const prompt = `
      Act as Master Video Prompt Engineer for Google Veo, Runway Gen-3, and Luma Dream Machine.
      IDEA: "${idea}"
      VISUAL ANCHOR: "${visualAnchor}" (MUST BE MAINTAINED IN EVERY SCENE)
      BACKGROUND LOCK: "${backgroundAnchor}" (CONSISTENT ENVIRONMENT)
      STYLE: "${stylePrompt}"
      OUTPUT LANGUAGE: ${outLang}

      STRICT RULES OF THE MASTER:
      1. Every scene MUST strictly begin with a detailed description of the Visual Anchor.
      2. Every scene MUST strictly end with the Background Lock description.
      3. Use technical camera terms: ${camera}, Focus: ${focus}, Lighting: ${lighting}, Color: ${colorGrade}.
      4. CHARACTER CONSISTENCY: ${consistency === 'fixed' ? "Strictly frozen pose, no movement of anchor." : "Fluid, natural cinematic movement."}
      5. DIALOGUE LOGIC: ${voiceType === 'off' ? "STRICT SILENCE. Prepend [Silent Scene]." : `Provide VIETNAMESE DIALOGUE inside quotes for ${voiceType}.`}
      
      OUTPUT FORMAT (Scene [N] | Visual | Style | Voices | Shot | Setting | Mood | Audio | Dialog):
      Scene [N] | [Detailed Visual Description in ${outLang}] | [Technical Style] | [Voice Type] | [Camera Shot] | [Setting] | [Mood] | [SFX/BGM] | [Dialog Content]
      
      GENERATE EXACTLY ${count} SCENES.
    `;
    return await this.callGemini(prompt);
  }

  static async generateScript(params: any) {
    const { topic, lang, tone, length, format } = params;
    const prompt = `
      Act as an Award-Winning Cinematic Screenwriter. 
      TOPIC: "${topic}"
      TONE: ${tone}
      LENGTH: ${length}
      FORMAT: ${format}
      LANGUAGE: ${lang}

      You MUST provide a structured response that allows for Visual Prompt generation.
      JSON STRUCTURE:
      {
        "character": "Extremely detailed visual description of the main character (Visual Anchor)",
        "background": "Extremely detailed description of the master environment (Background Lock)",
        "script": "Full cinematic script with scene headings, character actions, and dialogue."
      }
    `;
    return await this.callGemini(prompt, true);
  }

  static async generateThumbnailVariations(params: any) {
    const { context, anchor, style } = params;
    const prompt = `
      Act as a Viral Thumbnail Designer & Prompt Engineer. 
      Create 3 DISTINCT ULTIMATE PROMPTS for YouTube Thumbnails.
      Context: "${context}"
      Subject (Anchor): "${anchor}"
      Style: "${style}"

      Prompts must be optimized for Midjourney v6/DALL-E 3 with keywords for lighting, texture, and composition.
      OUTPUT JSON ARRAY: [ {"id": "1", "prompt": "..."}, {"id": "2", "prompt": "..."}, {"id": "3", "prompt": "..."} ]
    `;
    return await this.callGemini(prompt, true);
  }

  static async generateBananaProImage(prompt: string, quality: string, ratio: string) {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `High-end professional visualization: ${prompt}` }] },
        config: { 
          imageConfig: { 
            aspectRatio: ratio as any, 
            imageSize: quality as any 
          } 
        }
      });
      
      // Iterate through parts to find the image part as per guidelines.
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (error) {
      console.error("Banana Pro Image Error:", error);
      throw error;
    }
  }

  static async editBananaProImage(imageUrl: string, editPrompt: string) {
    try {
      const ai = this.getAI();
      const base64Data = imageUrl.includes(',') ? imageUrl.split(',')[1] : imageUrl;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: editPrompt }
          ]
        }
      });
      
      // Iterate through all parts to find the image part.
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (error) {
      console.error("Edit Image Error:", error);
      throw error;
    }
  }

  static async generateSEO(params: any) {
    const { topic, channel, tone, lang, style } = params;
    const prompt = `
      Act as YouTube SEO Growth Expert. 
      TOPIC: "${topic}"
      CHANNEL: "${channel}"
      STYLE: ${style}
      LANGUAGE: ${lang}

      Create a high-conversion Metadata package.
      JSON FORMAT: { "title": "...", "description": "...", "hashtags": "..." }
    `;
    return await this.callGemini(prompt, true);
  }

  static async generateTimelapse(params: any) {
    const { char, mode, data, imageParts, styleLabel } = params;
    let details = "";
    if (mode === 'manual') details = `Evolution from ${data.A} to ${data.B}.`;
    else if (mode === 'batch') details = `Phases: 0%=${data.p0}, 100%=${data.p100}.`;
    else details = "Analyze the provided image frames to generate a consistent evolution prompt.";

    const promptText = `Create a master timelapse prompt for: ${char}. Style: ${styleLabel}. Details: ${details}`;
    
    const payload = imageParts && imageParts.length > 0 
      ? { parts: [{ text: promptText }, ...imageParts] } 
      : promptText;
      
    return await this.callGemini(payload);
  }

  static async generateSpy(input: string) {
    const prompt = `Analyze this competitor content: "${input}". 
    Deconstruct the hooks, keywords, and AI prompts.
    JSON: { "title": "...", "description": "...", "prompts": "...", "script": "..." }`;
    return await this.callGemini(prompt, true);
  }
}
