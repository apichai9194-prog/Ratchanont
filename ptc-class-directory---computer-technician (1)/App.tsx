
import React, { useState, useEffect, useMemo } from 'react';
import { fetchStudents, saveStudent, testConnection } from './services/gasService';
import { Student } from './types';
import StudentCard from './components/StudentCard';
import RegistrationForm from './components/RegistrationForm';
import { 
  Users, 
  Search, 
  Plus, 
  Settings, 
  Code, 
  Cpu,
  Loader2,
  RefreshCcw,
  Wifi,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Info,
  AlertCircle,
  ExternalLink,
  ShieldOff,
  UserCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';

const MOCK_DATA: Student[] = [
  {
    id: 'demo-1', studentId: '65209010001', firstName: 'สมชาย', lastName: 'สายคอม',
    nickname: 'ชาย', phone: '0812345678', facebook: 'somchai.tech', instagram: 'somchai_it',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    quote: 'Error คือเรื่องปกติ แต่ No Coffee คือเรื่องใหญ่ (ข้อมูลสาธิต)', year: '2567'
  }
];

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegForm, setShowRegForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  
  const [tempUrl, setTempUrl] = useState(localStorage.getItem('gas_url') || '');
  const [scriptUrl, setScriptUrl] = useState(localStorage.getItem('gas_url') || '');
  const [isConfigMode, setIsConfigMode] = useState(!localStorage.getItem('gas_url'));

  const isDemoMode = !scriptUrl;

  const loadData = async () => {
    setIsLoading(true);
    if (!scriptUrl) {
      setStudents(MOCK_DATA);
      setIsLoading(false);
      return;
    }
    try {
      const data = await fetchStudents(scriptUrl);
      setStudents(data);
      setConnectionStatus('success');
    } catch (error) {
      console.error("Load Data Error:", error);
      setConnectionStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [scriptUrl]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      `${s.firstName} ${s.lastName} ${s.nickname} ${s.studentId}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleTestConnection = async () => {
    const url = tempUrl.trim();
    if (!url) return;

    if (url.includes('/edit')) {
      alert("❌ คุณกำลังใช้ URL สำหรับแก้ไขโค้ด!\n\nโปรดกดปุ่ม 'Deploy' > 'New Deployment' แล้วใช้ URL ที่ได้จากหน้านั้นครับ");
      return;
    }

    setConnectionStatus('testing');
    const ok = await testConnection(url);
    setConnectionStatus(ok ? 'success' : 'failed');
  };

  const handleSaveConfig = () => {
    const cleanUrl = tempUrl.trim();
    localStorage.setItem('gas_url', cleanUrl);
    setScriptUrl(cleanUrl);
    setIsConfigMode(false);
    loadData();
  };

  const handleAddStudent = async (data: Partial<Student>) => {
    if (isDemoMode) return alert("⚠️ กรุณาตั้งค่า Web App URL ก่อน");
    setIsSubmitting(true);
    try {
      const success = await saveStudent(scriptUrl, data);
      if (success) {
        alert("🚀 ลงทะเบียนสำเร็จ! ข้อมูลจะแสดงผลใน 3 วินาที...");
        setShowRegForm(false);
        setTimeout(loadData, 3000);
      }
    } catch (err) {
      alert("❌ บันทึกล้มเหลว");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-[#F8FAFC] text-slate-900">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Cpu size={24} /></div>
            <div>
              <h1 className="text-lg font-bold leading-none mb-1">PTC Directory</h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Computer Technician</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold ${isDemoMode ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDemoMode ? 'bg-amber-500' : 'bg-green-500'}`}></div>
              {isDemoMode ? 'Demo Mode' : 'Online'}
            </div>
            <button onClick={() => setIsConfigMode(!isConfigMode)} className={`p-2 rounded-full transition-colors ${isConfigMode ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-blue-600'}`}><Settings size={20} /></button>
            <button onClick={() => setShowRegForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 text-sm"><Plus size={18} /> <span className="hidden sm:inline">ลงทะเบียน</span></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {isConfigMode && (
          <div className="bg-white border-2 border-blue-50 rounded-[2.5rem] p-8 mb-10 shadow-xl shadow-blue-900/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg"><FileSpreadsheet size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold">เชื่อมต่อ Google Sheets</h2>
                  <p className="text-sm text-slate-400">นำ Web App URL จาก Google Apps Script มาใส่เพื่อเริ่มใช้งานจริง</p>
                </div>
              </div>
              <button 
                onClick={() => setShowGuide(!showGuide)} 
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${showGuide ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {showGuide ? <ChevronUp size={18} /> : <ChevronDown size={18} />} 
                {showGuide ? 'ปิดวิธีใช้งาน' : 'ดูวิธีติดตั้ง (Deploy)'}
              </button>
            </div>
            
            {showGuide && (
              <div className="mb-8 grid md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
                  <h3 className="font-bold mb-2">ก๊อปปี้โค้ด</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">คัดลอกโค้ดจากไฟล์ <b>gas-template.js</b> ไปวางในหน้า Google Apps Script</p>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
                  <h3 className="font-bold mb-2">ตั้งค่า Deploy</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">กด <b>Deploy > New Deployment</b></p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">ต้องเลือก "Anyone" ในช่อง Who has access</p>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
                  <h3 className="font-bold mb-2">ยืนยันสิทธิ์</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">กด <b>Authorize Access</b> และกดยอมรับสิทธิ์ทั้งหมดจนเสร็จสิ้น (ถ้ามีแจ้งเตือน Unverified ให้กด Advanced > Go to...)</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Wifi size={20} className={connectionStatus === 'success' ? 'text-green-500' : 'text-slate-300'} />
                </div>
                <input 
                  type="text" 
                  placeholder="วาง Web App URL ที่นี่... (ต้องลงท้ายด้วย /exec)" 
                  value={tempUrl} 
                  onChange={(e) => { setTempUrl(e.target.value); setConnectionStatus('idle'); }} 
                  className={`w-full pl-14 pr-6 py-5 rounded-3xl bg-slate-50 border-2 outline-none transition-all text-sm font-medium ${connectionStatus === 'failed' ? 'border-red-100 focus:border-red-500' : 'border-slate-50 focus:border-blue-500'}`}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleTestConnection} 
                  disabled={connectionStatus === 'testing' || !tempUrl} 
                  className="flex-1 min-w-[140px] bg-white border-2 border-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {connectionStatus === 'testing' ? <Loader2 size={18} className="animate-spin" /> : <Wifi size={18} />} ทดสอบการเชื่อมต่อ
                </button>
                <button 
                  onClick={handleSaveConfig} 
                  disabled={connectionStatus !== 'success'}
                  className="flex-[2] min-w-[200px] bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-all"
                >
                  บันทึกและเปิดระบบ
                </button>
              </div>

              {connectionStatus === 'failed' && (
                <div className="p-6 bg-red-50 rounded-3xl border border-red-100 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 text-red-700 mb-4">
                    <AlertCircle size={20} />
                    <span className="font-bold">เชื่อมต่อไม่สำเร็จ? ลองเช็คสิ่งเหล่านี้:</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-50">
                      <div className="flex items-center gap-2 text-amber-600 mb-2 font-bold text-xs"><UserCheck size={14} /> Gmail ซ้อนกัน</div>
                      <p className="text-[11px] text-slate-500">หาก Login หลายเมลใน Browser เดียวกัน Google มักจะบล็อก <br/><b>วิธีแก้:</b> ลองเปิดใน <b>โหมดไม่ระบุตัวตน (Incognito)</b></p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-50">
                      <div className="flex items-center gap-2 text-blue-600 mb-2 font-bold text-xs"><CheckCircle2 size={14} /> ลืมเลือก "Anyone"</div>
                      <p className="text-[11px] text-slate-500">ตอน Deploy ในช่อง <b>Who has access</b> ต้องเลือก <b>Anyone</b> เท่านั้น (ไม่ใช่ Only myself)</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-50">
                      <div className="flex items-center gap-2 text-red-600 mb-2 font-bold text-xs"><ShieldOff size={14} /> Ad-blocker</div>
                      <p className="text-[11px] text-slate-500">โปรแกรมบล็อกโฆษณาอาจบล็อกสคริปต์ของ Google <br/><b>วิธีแก้:</b> ลอง <b>ปิด AdBlock</b> ชั่วคราว</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อเพื่อน หรือ รหัสนักศึกษา..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white shadow-sm border border-transparent focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 outline-none text-lg transition-all" 
            />
          </div>
          <button onClick={loadData} disabled={isLoading} className="bg-white p-5 rounded-3xl shadow-sm text-gray-400 hover:text-blue-600 border border-transparent hover:border-blue-100 transition-all active:scale-90 flex items-center justify-center">
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <RefreshCcw size={24} />}
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <Loader2 className="animate-spin text-blue-600" size={64} />
            <p className="text-slate-400 font-medium animate-pulse">กำลังโหลดรายชื่อเพื่อนๆ...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredStudents.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                scriptUrl={scriptUrl} 
                onRefresh={loadData} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <Users className="mx-auto text-slate-100 mb-6" size={80} />
            <h3 className="text-xl font-bold text-slate-800 mb-2">ไม่พบรายชื่อในระบบ</h3>
            <p className="text-slate-400 text-sm">ลองตรวจสอบการเชื่อมต่อ หรือเริ่มลงทะเบียนเป็นคนแรก!</p>
          </div>
        )}
      </main>

      {showRegForm && (
        <RegistrationForm 
          onClose={() => setShowRegForm(false)} 
          onSave={handleAddStudent} 
          isLoading={isSubmitting} 
        />
      )}
    </div>
  );
};

export default App;
