
import { GoogleGenAI } from "@google/genai";

export const generateStudentBio = async (name: string, nickname: string, hobbies: string) => {
  try {
    // สร้าง instance ภายในฟังก์ชันเพื่อให้ได้ API_KEY ล่าสุดเสมอ
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `เขียนคำคมสั้นๆ หรือคำแนะนำตัวกวนๆ เท่ๆ สำหรับทำเนียบรุ่นให้นักเรียนชื่อ ${name} (ชื่อเล่น: ${nickname}) ที่ชอบ ${hobbies}. ขอเป็นภาษาไทย แบบวัยรุ่นช่างเทคนิคคอมพิวเตอร์.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
      }
    });
    return response.text || "ไม่มีคำคม";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "สายโค้ดไม่โหดเท่าสายควัน (ล้อเล่นครับ)";
  }
};
