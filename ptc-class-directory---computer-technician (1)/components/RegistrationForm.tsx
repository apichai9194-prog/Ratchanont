
import React, { useState } from 'react';
import { Save, X, Sparkles, Loader2 } from 'lucide-react';
import { generateStudentBio } from '../services/geminiService';
import { Student } from '../types';

interface RegistrationFormProps {
  onClose: () => void;
  onSave: (data: Partial<Student>) => void;
  isLoading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    nickname: '',
    phone: '',
    facebook: '',
    instagram: '',
    imageUrl: '',
    quote: '',
    year: new Date().getFullYear().toString(),
    hobbies: '' 
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerateQuote = async () => {
    if (!formData.firstName || !formData.nickname) {
      alert("กรุณากรอกชื่อและชื่อเล่นก่อนใช้ AI ช่วยคิด");
      return;
    }
    setIsGenerating(true);
    try {
      const quote = await generateStudentBio(formData.firstName, formData.nickname, formData.hobbies);
      setFormData(prev => ({ ...prev, quote }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // แยกส่วน hobbies ออกก่อนส่งไปเซิร์ฟเวอร์
    const { hobbies, ...studentData } = formData;
    onSave(studentData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-6 py-5 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">ลงทะเบียนเพื่อนร่วมรุ่น</h2>
            <p className="text-xs text-gray-500">กรอกข้อมูลให้ครบถ้วนเพื่อสร้างโปรไฟล์</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">รหัสนักศึกษา</label>
              <input required name="studentId" value={formData.studentId} onChange={handleChange} placeholder="6XXXXXXX" className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">รุ่นปี (พ.ศ.)</label>
              <input required name="year" value={formData.year} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">ชื่อจริง</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">นามสกุล</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">ชื่อเล่น</label>
              <input required name="nickname" value={formData.nickname} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">เบอร์โทรศัพท์</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="08XXXXXXXX" className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Facebook (Username)</label>
              <input name="facebook" value={formData.facebook} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="เช่น somchai.tech" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Instagram (Username)</label>
              <input name="instagram" value={formData.instagram} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="เช่น somchai_it" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">ลิงก์รูปโปรไฟล์ (URL)</label>
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="https://image-hosting.com/your-photo.jpg" />
          </div>

          <div className="space-y-3 p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-blue-800">คำคมประจำใจ (Quote)</label>
              <button 
                type="button" 
                onClick={handleGenerateQuote} 
                disabled={isGenerating}
                className="flex items-center gap-2 text-xs font-black text-white bg-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                ให้ AI ช่วยคิด
              </button>
            </div>
            <textarea 
              name="quote" 
              value={formData.quote} 
              onChange={handleChange} 
              rows={3} 
              className="w-full border-2 border-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none resize-none shadow-inner"
              placeholder="ความชอบหรือสิ่งที่คุณเป็น..."
            />
            <div className="space-y-1">
              <span className="text-[10px] text-blue-400 font-bold uppercase">ระบุงานอดิเรกเพื่อความแม่นยำของ AI</span>
              <input 
                name="hobbies" 
                value={formData.hobbies} 
                onChange={handleChange} 
                className="w-full border-2 border-white rounded-xl px-4 py-2 text-sm bg-white/50 outline-none" 
                placeholder="เช่น ชอบประกอบคอม, เล่นเกม MOBA, ฟังเพลงแนว Lofi" 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-300 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />} บันทึกข้อมูล
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
