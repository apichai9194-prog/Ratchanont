
import React, { useState } from 'react';
import { Student } from '../types';
import { Phone, Facebook, Instagram, Hash, Camera, Loader2 } from 'lucide-react';
import { updateStudentImage } from '../services/gasService';

interface StudentCardProps {
  student: Student;
  scriptUrl: string;
  onRefresh: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, scriptUrl, onRefresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateImage = async () => {
    if (!scriptUrl) {
      alert("⚠️ กรุณาตั้งค่า Web App URL ก่อนทำการแก้ไข");
      return;
    }

    const newUrl = prompt("กรุณาใส่ลิงก์รูปภาพใหม่ (URL):", student.imageUrl);
    if (newUrl && newUrl !== student.imageUrl) {
      setIsUpdating(true);
      const success = await updateStudentImage(scriptUrl, student.studentId, newUrl);
      if (success) {
        alert("✅ อัปเดตรูปภาพเรียบร้อยแล้ว");
        onRefresh();
      } else {
        alert("❌ ไม่สามารถอัปเดตรูปภาพได้");
      }
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-blue-50 group">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img 
          src={student.imageUrl || `https://picsum.photos/seed/${student.id}/400/400`} 
          alt={`${student.firstName} ${student.lastName}`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isUpdating ? 'opacity-50 grayscale' : ''}`}
        />
        
        {/* Update Image Button Overlay */}
        <button 
          onClick={handleUpdateImage}
          disabled={isUpdating}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-blue-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
          title="เปลี่ยนรูปโปรไฟล์"
        >
          {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
        </button>

        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          รุ่นปี {student.year}
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-600 font-bold text-lg">{student.nickname}</span>
            <span className="text-gray-400 text-sm">|</span>
            <span className="text-gray-800 font-medium">{student.firstName} {student.lastName}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Hash size={12} />
            <span>ID: {student.studentId}</span>
          </div>
        </div>

        {student.quote && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400 italic text-gray-600 text-sm">
            "{student.quote}"
          </div>
        )}

        <div className="space-y-2">
          <a href={`tel:${student.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
            <div className="bg-blue-50 p-2 rounded-full"><Phone size={14} /></div>
            <span className="text-sm">{student.phone}</span>
          </a>
          
          <div className="flex gap-2 pt-2">
            {student.facebook && (
              <a 
                href={`https://facebook.com/${student.facebook}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-medium"
              >
                <Facebook size={14} /> Facebook
              </a>
            )}
            {student.instagram && (
              <a 
                href={`https://instagram.com/${student.instagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-pink-50 text-pink-700 py-2 rounded-lg hover:bg-pink-600 hover:text-white transition-all text-xs font-medium"
              >
                <Instagram size={14} /> IG
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
