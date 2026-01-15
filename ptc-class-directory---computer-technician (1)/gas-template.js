
/**
 * ============================================================
 * 🏫 PTC CLASS DIRECTORY - GOOGLE APPS SCRIPT (GAS)
 * เวอร์ชัน: 4.2 (CONFIGURABLE VERSION)
 * ============================================================
 */

const CONFIG = {
  // 1. ระบุชื่อแท็บ (Sheet Name) ที่ต้องการให้ข้อมูลไปลงที่นี่
  // เช่น ถ้าใน Google Sheets คุณตั้งชื่อแท็บว่า "ปี67" ก็เปลี่ยนจาก "Students" เป็น "ปี67"
  SHEET_NAME: "Students", 

  // 2. (ตัวเลือกเสริม) หากคุณไม่ได้เขียนสคริปต์ลงในไฟล์ Sheets โดยตรง (Standalone Script)
  // ให้เอา ID ของ Google Sheets มาใส่ในนี้ (ID คือตัวเลขตัวอักษรยาวๆ ใน URL ของ Sheets)
  // ถ้าเขียนสคริปต์ใน Extensions > Apps Script ของไฟล์นั้นอยู่แล้ว ไม่ต้องแก้ตัวแปรนี้ครับ
  SPREADSHEET_ID: "", 

  // หัวตาราง (ห้ามลบอันเดิม แต่เพิ่มได้)
  HEADERS: ["Timestamp", "Student ID", "First Name", "Last Name", "Nickname", "Phone", "Facebook", "Instagram", "Profile Image", "Quote", "Graduation Year"]
};

/**
 * ------------------------------------------------------------
 * 🛠️ ส่วนนี้คือฟังก์ชันช่วยจัดการฐานข้อมูล (ไม่ต้องแก้ไข)
 * ------------------------------------------------------------
 */
function getOrCreateSheet() {
  let ss;
  // ตรวจสอบว่าใช้ Spreadsheet ID หรือ ใช้ไฟล์ปัจจุบัน
  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID !== "") {
    ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  // หากยังไม่มีชื่อ Sheet นี้ ให้สร้างใหม่พร้อมหัวตาราง
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(CONFIG.HEADERS);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length)
         .setFontWeight("bold")
         .setBackground("#2563EB")
         .setFontColor("#FFFFFF")
         .setVerticalAlignment("middle")
         .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * ------------------------------------------------------------
 * 📥 ฟังก์ชันรับข้อมูล (GET) - สำหรับดึงรายชื่อและทดสอบ
 * ------------------------------------------------------------
 */
function doGet(e) {
  const createResponse = (data) => {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  };

  if (!e || !e.parameter) return createResponse({ status: "error", message: "No parameters" });

  const action = e.parameter.action;
  if (action === "test") return createResponse({ status: "ok", message: "⚡️ เชื่อมต่อสำเร็จกับแท็บ: " + CONFIG.SHEET_NAME });

  try {
    const sheet = getOrCreateSheet();
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return createResponse([]);
    
    const rows = values.slice(1);
    const data = rows.map((row, index) => ({
      id: "row_" + (index + 2),
      studentId: row[1],
      firstName: row[2],
      lastName: row[3],
      nickname: row[4],
      phone: row[5],
      facebook: row[6],
      instagram: row[7],
      imageUrl: row[8],
      quote: row[9],
      year: row[10]
    }));
    return createResponse(data);
  } catch (error) {
    return createResponse({ status: "error", message: error.toString() });
  }
}

/**
 * ------------------------------------------------------------
 * 📤 ฟังก์ชันบันทึกข้อมูล (POST) - สำหรับลงทะเบียน
 * ------------------------------------------------------------
 */
function doPost(e) {
  const createResponse = (data) => {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  };

  const lock = LockService.getScriptLock();
  lock.tryLock(15000); 
  
  try {
    if (!e || !e.postData || !e.postData.contents) return createResponse({ status: 'error', message: 'No payload' });

    const sheet = getOrCreateSheet();
    const payload = JSON.parse(e.postData.contents);

    // กรณีอัปเดตรูปภาพ
    if (payload.action === "updateImage") {
      const values = sheet.getDataRange().getValues();
      let found = false;
      for (let i = 1; i < values.length; i++) {
        if (values[i][1].toString() === payload.studentId.toString()) {
          sheet.getRange(i + 1, 9).setValue(payload.imageUrl);
          found = true;
          break;
        }
      }
      return createResponse(found ? { status: 'success' } : { status: 'error', message: 'Not found ID' });
    }

    // กรณีลงทะเบียน (ข้อมูลจะถูกจัดเรียงตามหัวข้อที่ CONFIG.HEADERS กำหนดไว้)
    const rowData = [
      new Date(),                      // Timestamp
      payload.studentId || "-",        // Student ID
      payload.firstName || "-",        // First Name
      payload.lastName || "-",         // Last Name
      payload.nickname || "-",         // Nickname
      payload.phone || "-",            // Phone
      payload.facebook || "",          // Facebook
      payload.instagram || "",         // Instagram
      payload.imageUrl || "",          // Profile Image
      payload.quote || "",             // Quote
      payload.year || new Date().getFullYear().toString() // Graduation Year
    ];

    sheet.appendRow(rowData);
    return createResponse({ status: 'success' });

  } catch (error) {
    return createResponse({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}
