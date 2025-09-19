
import { GoogleGenAI, Type } from "@google/genai";
import type { BaziData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const baziSchema = {
  type: Type.OBJECT,
  properties: {
    pillars: {
      type: Type.OBJECT,
      description: "四柱八字",
      properties: {
        year: {
          type: Type.OBJECT,
          description: "年柱",
          properties: {
            stem: { type: Type.STRING, description: "年柱天干" },
            branch: { type: Type.STRING, description: "年柱地支" }
          },
          required: ["stem", "branch"]
        },
        month: {
          type: Type.OBJECT,
          description: "月柱",
          properties: {
            stem: { type: Type.STRING, description: "月柱天干" },
            branch: { type: Type.STRING, description: "月柱地支" }
          },
          required: ["stem", "branch"]
        },
        day: {
          type: Type.OBJECT,
          description: "日柱",
          properties: {
            stem: { type: Type.STRING, description: "日柱天干，也称为日主或命主" },
            branch: { type: Type.STRING, description: "日柱地支" }
          },
          required: ["stem", "branch"]
        },
        hour: {
          type: Type.OBJECT,
          description: "时柱",
          properties: {
            stem: { type: Type.STRING, description: "时柱天干" },
            branch: { type: Type.STRING, description: "时柱地支" }
          },
          required: ["stem", "branch"]
        }
      },
      required: ["year", "month", "day", "hour"]
    },
    analysis: {
      type: Type.OBJECT,
      description: "命盘分析",
      properties: {
        mingZhu: { type: Type.STRING, description: "关于命主（日主）的简要描述" },
        personality: { type: Type.STRING, description: "性格分析" },
        career: { type: Type.STRING, description: "事业和财运分析" },
        relationship: { type: Type.STRING, description: "感情和婚姻分析" },
        health: { type: Type.STRING, description: "健康建议" },
        summary: { type: Type.STRING, description: "综合运势总结和建议" }
      },
      required: ["mingZhu", "personality", "career", "relationship", "health", "summary"]
    }
  },
  required: ["pillars", "analysis"]
};


export const calculateBazi = async (birthDate: string, birthHour: number): Promise<BaziData> => {
  try {
    const [year, month, day] = birthDate.split('-');
    
    const prompt = `请为出生于公历 ${year}年${month}月${day}日 ${birthHour}时 的人生成八字命盘和一份详细的分析报告。`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一位精通中国传统命理学和八字算命的大师。你的任务是根据用户提供的公历出生年月日和时辰，生成一份专业、详细且易于理解的八字命盘分析报告。请确保所有术语都使用简体中文。请严格按照指定的JSON格式输出，不要包含任何markdown标记。",
        responseMimeType: "application/json",
        responseSchema: baziSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Basic validation to ensure the parsed data matches the expected structure
    if (!parsedData.pillars || !parsedData.analysis) {
        throw new Error("AI返回的数据格式不正确。");
    }

    return parsedData as BaziData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("AI命理大师响应失败，请稍后重试。");
  }
};
