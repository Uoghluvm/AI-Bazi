
import { GoogleGenAI, Type } from "@google/genai";
import type { BaziData, BaziPillars } from '../types';

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


export const getBaziAnalysisFromAI = async (birthDate: string, birthHour: number, gender: 'male' | 'female', calculatedPillars: BaziPillars): Promise<BaziData> => {
  try {
    const [year, month, day] = birthDate.split('-');
    const genderText = gender === 'male' ? '男性' : '女性';
    
    const prompt = `
请为一名出生于公历 ${year}年${month}月${day}日 ${birthHour}时 的${genderText}，生成一份详细的八字命盘分析报告。
我们通过前端算法初步推算其八字为：
- 年柱: ${calculatedPillars.year.stem}${calculatedPillars.year.branch}
- 月柱: ${calculatedPillars.month.stem}${calculatedPillars.month.branch}
- 日柱: ${calculatedPillars.day.stem}${calculatedPillars.day.branch}
- 时柱: ${calculatedPillars.hour.stem}${calculatedPillars.hour.branch}

请以此八字为基础进行深入分析。如果上述八字因特殊节气或计算误差而与公历时间不符，请以您精确的算法为准，使用正确的八字进行分析并返回正确的八字数据。
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一位精通中国传统命理学和八字算命的大师。你的任务是根据用户提供的公历出生信息和预先计算的八字，生成一份专业、详细且易于理解的八字命盘分析报告。如果预计算的八字有误，请务必修正。请确保所有术语都使用简体中文，并严格按照指定的JSON格式输出，不要包含任何markdown标记。",
        responseMimeType: "application/json",
        responseSchema: baziSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    if (!parsedData.pillars || !parsedData.analysis) {
        throw new Error("AI返回的数据格式不正确。");
    }

    return parsedData as BaziData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("AI命理大师响应失败，请稍后重试。");
  }
};
