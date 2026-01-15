
import { Student } from '../types';

/**
 * ฟังก์ชันกลางสำหรับ Fetch ข้อมูลจาก GAS
 */
const gasFetch = async (url: string, params: string = '') => {
  const fullUrl = params ? `${url}${url.includes('?') ? '&' : '?'}${params}` : url;
  
  return fetch(fullUrl, {
    method: 'GET',
    mode: 'cors',
    redirect: 'follow', // สำคัญมาก: Google Apps Script มักจะ Redirect ไปยัง Server อื่น
    cache: 'no-store'
  });
};

/**
 * ทดสอบการเชื่อมต่อ
 */
export const testConnection = async (scriptUrl: string): Promise<boolean> => {
  if (!scriptUrl) return false;
  try {
    const response = await gasFetch(scriptUrl, 'action=test');
    if (!response.ok) return false;
    const data = await response.json();
    return data && data.status === "ok";
  } catch (error) {
    console.error("Connection test error:", error);
    return false;
  }
};

/**
 * ดึงรายชื่อนักเรียน
 */
export const fetchStudents = async (scriptUrl: string): Promise<Student[]> => {
  if (!scriptUrl) return [];
  try {
    const response = await gasFetch(scriptUrl, 'action=getStudents');
    if (!response.ok) return [];
    
    // ตรวจสอบว่าผลลัพธ์เป็น JSON หรือไม่ (ถ้าเป็น HTML แสดงว่าติดหน้า Login ของ Google)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response type: " + contentType);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error; // ส่งต่อ Error ให้ UI จัดการ
  }
};

/**
 * บันทึกข้อมูล (POST)
 */
export const saveStudent = async (scriptUrl: string, student: Partial<Student>): Promise<boolean> => {
  if (!scriptUrl) return false;
  try {
    // การส่งข้อมูล POST ไปยัง GAS ต้องใช้ text/plain เพื่อเลี่ยง CORS preflight
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(student),
    });
    return true; 
  } catch (error) {
    console.error("Error saving student:", error);
    return false;
  }
};

/**
 * อัปเดตรูปโปรไฟล์
 */
export const updateStudentImage = async (scriptUrl: string, studentId: string, imageUrl: string): Promise<boolean> => {
  if (!scriptUrl) return false;
  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'updateImage', studentId, imageUrl }),
    });
    return true;
  } catch (error) {
    console.error("Error updating image:", error);
    return false;
  }
};
