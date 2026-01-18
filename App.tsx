
import React, { useState, useEffect } from 'react';
import { 
  Copy, Download, Zap, RefreshCw, Check, 
  ScrollText, Rocket, Image as ImageIcon, UserSearch, 
  Timer, Activity, LayoutTemplate, Palette, Sliders, Flame, Clock
} from 'lucide-react';
import { 
  TabType, HistoryItem, ScriptResult, SEOResult, SpyResult, 
  ConsistencyMode, VoiceType, TimelapseMode, ThumbnailVariation, 
  ImageQuality, ScriptFormat, ScriptLength, SEOStyle 
} from './types';
import { NAV_ITEMS, STYLE_LIBRARY, TIMELAPSE_STYLES, THUMBNAIL_STYLES, FOCUS_MODES, COLOR_GRADES, SCRIPT_FORMATS } from './constants';
// Fixing casing error: Standardizing on GeminiService.ts
import { GeminiService } from './GeminiService';

const LOADING_TEXTS = ["Đang triệu hồi AI...", "Đang kết nối Banana Pro...", "Đang vẽ kịch bản triệu view...", "Sắp hoàn tất, đừng rời mắt..."];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // States
  const [promptInput, setPromptInput] = useState('');
  const [promptCount, setPromptCount] = useState(10);
  const [promptStyle, setPromptStyle] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [camera, setCamera] = useState('static');
  const [lighting, setLighting] = useState('natural');
  const [focus, setFocus] = useState('deep');
  const [colorGrade, setColorGrade] = useState('standard');
  const [outLang, setOutLang] = useState('English');
  const [voiceType, setVoiceType] = useState<VoiceType>('off');
  const [consistency, setConsistency] = useState<ConsistencyMode>('dynamic');
  const [visualAnchor, setVisualAnchor] = useState('');
  const [bgAnchor, setBgAnchor] = useState('');
  const [visualResult, setVisualResult] = useState('');

  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptLang, setScriptLang] = useState('Vietnamese');
  const [scriptTone, setScriptTone] = useState('Logical');
  const [scriptLength, setScriptLength] = useState<ScriptLength>('standard');
  const [scriptFormat, setScriptFormat] = useState<ScriptFormat>('movie');
  const [scriptResult, setScriptResult] = useState<ScriptResult | null>(null);

  const [seoTopic, setSeoTopic] = useState('');
  const [channelName, setChannelName] = useState(() => localStorage.getItem('channel_name') || '');
  const [seoLang, setSeoLang] = useState('Vietnamese');
  const [seoStyle, setSeoStyle] = useState<SEOStyle>('clickbait');
  const [seoResult, setSeoResult] = useState<SEOResult | null>(null);

  const [thumbContext, setThumbContext] = useState('');
  const [thumbStyle, setThumbStyle] = useState('Hyper-realistic');
  const [thumbQuality, setThumbQuality] = useState<ImageQuality>('1K');
  const [thumbRatio, setThumbRatio] = useState('16:9');
  const [thumbVariations, setThumbVariations] = useState<ThumbnailVariation[]>([]);

  const [timeChar, setTimeChar] = useState('');
  const [timeStyle, setTimeStyle] = useState('urban_pulse');
  const [timeMode, setTimeMode] = useState<TimelapseMode>('manual');
  const [timeA, setTimeA] = useState('');
  const [timeB, setTimeB] = useState('');
  const [batchData, setBatchData] = useState({ p0: '', p30: '', p50: '', p70: '', p100: '' });
  const [timeImages, setTimeImages] = useState<{ [key: string]: File | null }>({ img0: null, img30: null, img50: null, img70: null, img100: null });
  const [timeResult, setTimeResult] = useState('');

  const [spyInput, setSpyInput] = useState('');
  const [spyResult, setSpyResult] = useState<SpyResult | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => JSON.parse(localStorage.getItem('pro_prompt_history') || '[]'));

  useEffect(() => { 
    localStorage.setItem('pro_prompt_history', JSON.stringify(history));
    localStorage.setItem('channel_name', channelName);
  }, [history, channelName]);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        setHasApiKey(await (window as any).aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
  }, []);

  const openKeyDialog = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success as per guidelines
      setHasApiKey(true);
    }
  };

  const showToastMsg = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const addToHistory = (text: string, type: string) => setHistory([{ id: Date.now(), text, type, time: new Date().toLocaleString() }, ...history].slice(0, 50));
  const handleCopy = (t: string) => { navigator.clipboard.writeText(t); showToastMsg('Đã copy!'); };

  const runTask = async (taskFn: () => Promise<any>) => {
    setLoading(true); setLoadingPercent(0); setLoadingText(LOADING_TEXTS[0]);
    const itv = setInterval(() => setLoadingPercent(p => (p >= 98 ? 98 : p + 2)), 300);
    try { 
      await taskFn(); 
    } catch (error: any) {
      // Handling Requested entity was not found as per guidelines
      if (error?.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        await openKeyDialog();
      } else {
        showToastMsg("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally { 
      clearInterval(itv); setLoadingPercent(100); setTimeout(() => setLoading(false), 500); 
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || "");
      reader.readAsDataURL(file);
    });
  };

  const genVisual = () => runTask(async () => {
    const res = await GeminiService.generateVisualPrompts({ 
      idea: promptInput, count: promptCount, stylePrompt: STYLE_LIBRARY.find(s=>s.value===promptStyle)?.prompt, 
      outLang, voiceType, consistency, visualAnchor, backgroundAnchor: bgAnchor, camera, lighting, focus, colorGrade 
    });
    if (res) { setVisualResult(res); addToHistory(res, 'Visual Prompt'); }
  });

  const genScript = () => runTask(async () => {
    const res = await GeminiService.generateScript({ 
      topic: scriptTopic, lang: scriptLang, tone: scriptTone, length: scriptLength, format: scriptFormat 
    });
    if (res) { 
      const data = JSON.parse(res.replace(/```json|```/g, '')); 
      setScriptResult(data); 
      addToHistory(data.script, 'Kịch bản'); 
    }
  });

  const scriptToPrompt = () => {
    if (!scriptResult) return;
    setVisualAnchor(scriptResult.character);
    setBgAnchor(scriptResult.background);
    setPromptInput(`Ý tưởng từ kịch bản: ${scriptTopic}`);
    setActiveTab('home');
    showToastMsg("Đã đồng bộ Anchor & Background!");
  };

  const genSEO = () => runTask(async () => {
    const res = await GeminiService.generateSEO({ 
      topic: seoTopic || promptInput, channel: channelName, tone: 'clickbait', lang: seoLang, style: seoStyle 
    });
    if (res) {
      const data = JSON.parse(res.replace(/```json|```/g, ''));
      setSeoResult(data);
      addToHistory(res, 'SEO Video');
    }
  });

  const genThumbnailPrompts = () => runTask(async () => {
    const res = await GeminiService.generateThumbnailVariations({ context: thumbContext, anchor: visualAnchor, style: thumbStyle });
    if (res) setThumbVariations(JSON.parse(res.replace(/```json|```/g, '')).map((v:any) => ({...v, editInput: ''})));
  });

  const genBananaImage = async (idx: number) => {
    if (!hasApiKey) { await openKeyDialog(); return; }
    setThumbVariations(prev => prev.map((v, i) => i === idx ? {...v, isGenerating: true} : v));
    try {
      const url = await GeminiService.generateBananaProImage(thumbVariations[idx].prompt, thumbQuality, thumbRatio);
      setThumbVariations(prev => prev.map((v, i) => i === idx ? {...v, imageUrl: url || undefined, isGenerating: false} : v));
      if (!url) showToastMsg("Lưu ý: Bạn đang dùng API Free, vui lòng copy Prompt để tạo ảnh bên ngoài.");
    } catch (e: any) {
      setThumbVariations(prev => prev.map((v, i) => i === idx ? {...v, isGenerating: false} : v));
      if (e?.message?.includes("Requested entity was not found")) { setHasApiKey(false); await openKeyDialog(); }
    }
  };

  const editBananaImage = async (idx: number) => {
    if (!hasApiKey) { await openKeyDialog(); return; }
    const vari = thumbVariations[idx];
    if (!vari.imageUrl || !vari.editInput) return;
    setThumbVariations(prev => prev.map((v, i) => i === idx ? {...v, isGenerating: true} : v));
    try {
      const url = await GeminiService.editBananaProImage(vari.imageUrl, vari.editInput);
      setThumbVariations(prev => prev.map((v, i) => i === idx ? {...v, imageUrl: url || undefined, isGenerating: false, editInput: ''} : v));
    } catch (e: any) {
      setThumbVariations(prev => prev.map((v, i) => i === idx ? {...v, isGenerating: false} : v));
      if (e?.message?.includes("Requested entity was not found")) { setHasApiKey(false); await openKeyDialog(); }
    }
  };

  const genTimelapse = () => runTask(async () => {
    let imageParts = [];
    if (timeMode === 'batch_img') {
      for (const k in timeImages) {
        const f = timeImages[k];
        if (f) imageParts.push({ inlineData: { data: await fileToBase64(f), mimeType: f.type } });
      }
    }
    const res = await GeminiService.generateTimelapse({ 
      char: timeChar || visualAnchor, mode: timeMode, data: timeMode==='manual'?{A:timeA,B:timeB}:batchData, 
      imageParts, styleLabel: TIMELAPSE_STYLES.find(s=>s.value===timeStyle)?.label 
    });
    if (res) { setTimeResult(res); addToHistory(res, 'Timelapse'); }
  });

  const genSpy = () => runTask(async () => {
    const res = await GeminiService.generateSpy(spyInput);
    if (res) {
      const data = JSON.parse(res.replace(/```json|```/g, ''));
      setSpyResult(data);
      addToHistory(res, 'Spy Video');
    }
  });

  return (
    <div className="flex h-screen w-full relative overflow-hidden text-slate-900 bg-[#fdfaf1]">
      <aside className={`${sidebarOpen ? 'w-80' : 'w-24'} glass-panel h-full transition-all duration-500 flex flex-col z-30 shadow-2xl`}>
        <div className="p-8 flex items-center gap-4 border-b border-amber-100">
          <div className="w-12 h-12 bg-amber-800 rounded-2xl flex items-center justify-center rotate-3 shadow-xl"><Flame className="text-white" size={28}/></div>
          {sidebarOpen && <h1 className="text-xl font-black text-amber-950 uppercase">PROPROMPT</h1>}
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.2rem] transition-all ${activeTab === item.id ? 'tab-active-link' : 'text-slate-600 hover:bg-amber-50'}`}>
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <p className="text-[10px] font-black uppercase tracking-widest">{item.label}</p>}
            </button>
          ))}
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-6 text-amber-800 flex justify-center hover:bg-amber-50"><Sliders size={20}/></button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 px-10 flex items-center justify-between glass-panel border-b border-amber-100 z-20">
          <div className="flex items-center gap-4">
             <div className="bg-white/90 px-6 py-2 rounded-full border border-amber-200 text-[10px] font-black uppercase text-amber-900 flex items-center gap-2"><Activity size={14}/> Banana Pro v3.5 Online</div>
             {!hasApiKey && <button onClick={openKeyDialog} className="px-6 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-black animate-pulse uppercase">Cần API Key</button>}
          </div>
          <button onClick={() => setShowBrainstorm(true)} className="px-8 py-3 bg-amber-800 text-white rounded-full text-[10px] font-black uppercase shadow-xl hover:bg-black transition-all">Gợi ý Viral AI</button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 lg:p-16 custom-scrollbar pb-32 z-10">
          <div className="full-screen-content space-y-12">
            {activeTab === 'home' && (
              <div className="grid grid-cols-12 gap-10 animate-in fade-in">
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="glass-panel rounded-[2.5rem] p-10 space-y-8 border-2 border-white shadow-xl">
                    <h3 className="text-xs font-black text-amber-900 uppercase flex items-center gap-3"><LayoutTemplate size={18}/> Video Config</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Số cảnh</label><input type="number" value={promptCount} onChange={e=>setPromptCount(Number(e.target.value))} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold" /></div>
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Tỷ lệ</label><select value={aspectRatio} onChange={e=>setAspectRatio(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold"><option value="16:9">16:9</option><option value="9:16">9:16</option></select></div>
                    </div>
                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Phong cách</label><select value={promptStyle} onChange={e=>setPromptStyle(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold">{STYLE_LIBRARY.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Tiêu điểm</label><select value={focus} onChange={e=>setFocus(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold">{FOCUS_MODES.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Chỉnh màu</label><select value={colorGrade} onChange={e=>setColorGrade(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold">{COLOR_GRADES.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Nhất quán</label><select value={consistency} onChange={e=>setConsistency(e.target.value as any)} className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-black"><option value="dynamic">🌊 Dynamic Story</option><option value="fixed">🔒 Fixed Pose</option></select></div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Output</label><select value={outLang} onChange={e=>setOutLang(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold"><option value="English">English 🇬🇧</option><option value="Vietnamese">Tiếng Việt 🇻🇳</option></select></div>
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Thoại</label><select value={voiceType} onChange={e=>setVoiceType(e.target.value as any)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold"><option value="off">Tắt thoại</option><option value="Male">Giọng Nam</option><option value="Female">Giọng Nữ</option></select></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-8 space-y-8">
                  <div className="glass-panel rounded-[3rem] p-12 space-y-8 border-2 border-white shadow-2xl">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2"><label className="text-[10px] font-black text-amber-800 uppercase ml-2 flex items-center gap-2"><UserSearch size={14}/> Visual Anchor</label><textarea value={visualAnchor} onChange={e=>setVisualAnchor(e.target.value)} placeholder="Nhân vật..." className="w-full h-24 bg-indigo-50/20 border border-indigo-100 rounded-2xl p-4 text-xs font-bold" /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-amber-800 uppercase ml-2 flex items-center gap-2"><LayoutTemplate size={14}/> Master Background</label><textarea value={bgAnchor} onChange={e=>setBgAnchor(e.target.value)} placeholder="Bối cảnh..." className="w-full h-24 bg-rose-50/20 border border-rose-100 rounded-2xl p-4 text-xs font-bold" /></div>
                    </div>
                    <textarea value={promptInput} onChange={e=>setPromptInput(e.target.value)} placeholder="Nhập ý tưởng video..." className="w-full h-44 bg-slate-50 border border-amber-200 rounded-[2rem] p-8 text-xl font-bold focus:border-amber-500 outline-none" />
                    <button onClick={genVisual} className="w-full bg-amber-800 text-white py-8 rounded-full font-black uppercase text-lg tracking-widest shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4"><Zap size={24} fill="currentColor"/> Generate Visual Prompts</button>
                  </div>
                  {visualResult && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-5">
                       {visualResult.split('Scene').filter(s=>s.trim()).map((s,i)=>(
                         <div key={i} className="glass-panel p-8 rounded-[2rem] flex gap-6 hover-lift border-2 border-amber-50">
                            <div className="w-16 h-16 bg-amber-800 text-white rounded-2xl flex flex-col items-center justify-center shrink-0"><span className="text-[9px] font-black">S</span><span className="text-xl font-black">{i+1}</span></div>
                            <div className="flex-1 text-sm font-bold text-amber-950 italic">"Scene {s.split('|')[0].trim()}" {s.split('|')[1]}</div>
                            <button onClick={()=>handleCopy(`Scene ${i+1}: ${s}`)} className="p-4 bg-slate-50 hover:bg-amber-100 rounded-2xl text-amber-800 h-fit self-center"><Copy size={18}/></button>
                         </div>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'script' && (
               <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in">
                  <div className="glass-panel rounded-[4rem] p-20 bg-white shadow-2xl border-2 border-white text-center space-y-10">
                    <div className="w-24 h-24 bg-amber-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-3"><ScrollText className="text-white" size={48}/></div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Script Lab</h3>
                    <textarea value={scriptTopic} onChange={e=>setScriptTopic(e.target.value)} placeholder="Nhập ý tưởng hoặc yêu cầu kịch bản..." className="w-full h-56 bg-amber-50/50 border border-amber-200 rounded-[3rem] p-12 text-3xl font-bold text-center shadow-inner outline-none" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <div className="space-y-1 text-left">
                          <label className="text-[9px] font-black uppercase text-slate-400">Ngôn ngữ</label>
                          <select value={scriptLang} onChange={e=>setScriptLang(e.target.value)} className="w-full bg-white border p-4 rounded-2xl text-xs font-black uppercase"><option value="Vietnamese">Tiếng Việt 🇻🇳</option><option value="English">English 🇬🇧</option><option value="Japanese">Japanese 🇯🇵</option></select>
                       </div>
                       <div className="space-y-1 text-left">
                          <label className="text-[9px] font-black uppercase text-slate-400">Tông giọng</label>
                          <select value={scriptTone} onChange={e=>setScriptTone(e.target.value)} className="w-full bg-white border p-4 rounded-2xl text-xs font-black uppercase"><option value="Logical">🧠 Siêu Logic</option><option value="Emotional">❤️ Cảm xúc</option><option value="Humorous">😂 Hài hước</option></select>
                       </div>
                       <div className="space-y-1 text-left">
                          <label className="text-[9px] font-black uppercase text-slate-400">Độ dài</label>
                          <select value={scriptLength} onChange={e=>setScriptLength(e.target.value as any)} className="w-full bg-white border p-4 rounded-2xl text-xs font-black uppercase"><option value="short">60s (Short)</option><option value="standard">3-5p (Std)</option><option value="long">10p+ (Long)</option></select></div>
                       <div className="space-y-1 text-left">
                          <label className="text-[9px] font-black uppercase text-slate-400">Định dạng</label>
                          <select value={scriptFormat} onChange={e=>setScriptFormat(e.target.value as any)} className="w-full bg-white border p-4 rounded-2xl text-xs font-black uppercase">{SCRIPT_FORMATS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select>
                       </div>
                    </div>
                    <button onClick={genScript} className="w-full bg-amber-800 text-white py-8 rounded-full font-black uppercase text-xl shadow-2xl hover:scale-[1.01] transition-all">Phân tích & Viết kịch bản</button>
                  </div>
                  {scriptResult && (
                    <div className="glass-panel p-20 rounded-[4rem] bg-white space-y-12 shadow-2xl animate-in zoom-in-95">
                       <div className="flex justify-between items-center border-b border-amber-100 pb-8">
                          <div className="flex items-center gap-4 bg-green-50 text-green-700 px-6 py-2 rounded-full font-black text-[10px] uppercase border border-green-100">
                             <span>✅ Hoàn tất</span> 
                             <button onClick={scriptToPrompt} className="ml-4 bg-green-700 text-white px-4 py-1 rounded-full hover:bg-black transition-all">➡️ Chuyển sang Tab Visual</button>
                          </div>
                       </div>
                       <div className="font-serif text-3xl leading-[2.2] text-amber-950 whitespace-pre-wrap select-all underline decoration-amber-100 decoration-4 underline-offset-8">{scriptResult.script}</div>
                       <div className="grid grid-cols-2 gap-8 border-t pt-10">
                          <div className="p-6 bg-slate-50 rounded-2xl"><label className="text-[9px] font-black uppercase text-slate-400">Character Anchor</label><p className="text-sm font-bold">{scriptResult.character}</p></div>
                          <div className="p-6 bg-slate-50 rounded-2xl"><label className="text-[9px] font-black uppercase text-slate-400">Background Lock</label><p className="text-sm font-bold">{scriptResult.background}</p></div>
                       </div>
                    </div>
                  )}
               </div>
            )}

            {activeTab === 'video' && (
              <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
                 <div className="glass-panel rounded-[3rem] p-16 bg-white shadow-2xl border-2 border-white text-center space-y-10">
                    <div className="w-20 h-20 bg-amber-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"><Rocket className="text-white" size={40}/></div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Video SEO Engine</h2>
                    <textarea value={seoTopic || promptInput} onChange={e=>setSeoTopic(e.target.value)} placeholder="Nhập chủ đề video cần SEO..." className="w-full h-40 bg-slate-50 border border-amber-200 rounded-[2.5rem] p-10 text-xl font-bold shadow-inner" />
                    <button onClick={genSEO} className="w-full bg-amber-800 text-white py-6 rounded-full font-black uppercase tracking-widest shadow-xl">Tối ưu Metadata Triệu View</button>
                 </div>
                 {seoResult && (
                    <div className="glass-panel rounded-[3rem] p-12 space-y-8 bg-white shadow-2xl border-4 border-amber-50">
                       <div className="space-y-2"><label className="text-[10px] font-black text-amber-800 uppercase">Tiêu đề (CTR optimized)</label><div className="bg-amber-50 p-6 rounded-2xl font-black text-2xl border">{seoResult.title}</div></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-amber-800 uppercase">Mô tả chuẩn SEO</label><div className="bg-slate-50 p-8 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap select-all h-64 overflow-y-auto">{seoResult.description}</div></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-amber-800 uppercase">Hashtags</label><div className="bg-amber-950 p-6 rounded-2xl font-mono text-amber-400 text-xs">{seoResult.hashtags}</div></div>
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'thumbnail' && (
              <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in">
                 <div className="glass-panel rounded-[4rem] p-16 bg-white shadow-2xl border-4 border-amber-100/50">
                    <div className="flex items-center gap-6 mb-12"><ImageIcon size={48} className="text-amber-800"/><h2 className="text-4xl font-black uppercase tracking-tighter">Banana Pro Designer</h2></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Style</label><select value={thumbStyle} onChange={e=>setThumbStyle(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-4 text-xs font-bold">{THUMBNAIL_STYLES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Quality</label><select value={thumbQuality} onChange={e=>setThumbQuality(e.target.value as any)} className="w-full bg-slate-50 border rounded-xl p-4 text-xs font-bold"><option value="1K">1K</option><option value="2K">2K</option><option value="4K">4K Ultra</option></select></div>
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Aspect Ratio</label><select value={thumbRatio} onChange={e=>setThumbRatio(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-4 text-xs font-bold"><option value="16:9">Youtube (16:9)</option><option value="9:16">Shorts (9:16)</option></select></div>
                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Character</label><input value={visualAnchor} onChange={e=>setVisualAnchor(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-4 text-xs font-bold" /></div>
                    </div>
                    <textarea value={thumbContext} onChange={e=>setThumbContext(e.target.value)} placeholder="Mô tả bối cảnh hoặc chủ đề Thumbnail..." className="w-full h-32 bg-amber-50/20 border border-amber-100 rounded-[2rem] p-8 text-lg font-bold mb-10" />
                    <button onClick={genThumbnailPrompts} className="w-full bg-amber-800 text-white py-6 rounded-full font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:scale-[1.01] transition-all"><Palette size={24}/> Thiết kế Prompt Triple-Alpha</button>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {thumbVariations.map((v, i)=>(
                      <div key={v.id} className="glass-panel rounded-[3rem] p-8 space-y-6 flex flex-col bg-white border-2 border-amber-50 shadow-lg group">
                         <div className="flex justify-between items-center"><span className="bg-amber-100 text-amber-900 px-4 py-1 rounded-full text-[9px] font-black uppercase">Variation {i+1}</span><button onClick={()=>handleCopy(v.prompt)} className="text-amber-800 hover:scale-110 transition-transform"><Copy size={18}/></button></div>
                         <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-slate-400">Ultimate Prompt</label>
                             <p className="text-[12px] font-bold italic text-slate-700 bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 select-all h-40 overflow-y-auto leading-relaxed shadow-inner group-hover:border-amber-200 transition-colors">"{v.prompt}"</p>
                         </div>
                         {v.imageUrl ? (
                           <div className="space-y-6 animate-in zoom-in-95">
                              <img src={v.imageUrl} className="w-full h-56 object-cover rounded-[1.5rem] shadow-xl border-4 border-amber-50 cursor-pointer" onClick={()=>setPreviewImage(v.imageUrl || null)} />
                              <button onClick={()=>{const a=document.createElement('a'); a.href=v.imageUrl!; a.download=`thumb-${i}.png`; a.click();}} className="w-full py-3 bg-slate-100 rounded-full text-[9px] font-black uppercase flex items-center justify-center gap-2"><Download size={16}/> Tải ảnh</button>
                           </div>
                         ) : (
                           <button onClick={()=>genBananaImage(i)} disabled={v.isGenerating} className="w-full h-24 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center gap-3 text-amber-300 hover:text-amber-800 transition-all bg-slate-50 mt-auto">
                              {v.isGenerating ? <RefreshCw className="animate-spin text-amber-800" size={32}/> : <><ImageIcon size={32}/><span className="text-[9px] font-black uppercase">Thử vẽ bằng AI</span></>}
                           </button>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
            )}
            
            {activeTab === 'timelapse' && (
              <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
                 <div className="glass-panel rounded-[4rem] p-16 bg-white shadow-2xl border-2 border-white text-center space-y-10">
                    <div className="w-20 h-20 bg-amber-800 rounded-[2rem] flex items-center justify-center mx-auto rotate-6 shadow-xl"><Timer className="text-white" size={40}/></div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-amber-950">Timelapse Master</h2>
                    <div className="grid grid-cols-2 gap-6 text-left">
                       <div className="space-y-1"><label className="text-[9px] font-black uppercase ml-4">Nhân vật</label><input value={timeChar || visualAnchor} onChange={e=>setTimeChar(e.target.value)} className="w-full bg-slate-50 border rounded-2xl p-4 font-bold" /></div>
                       <div className="space-y-1"><label className="text-[9px] font-black uppercase ml-4">Phong cách</label><select value={timeStyle} onChange={e=>setTimeStyle(e.target.value)} className="w-full bg-slate-50 border rounded-2xl p-4 font-bold">{TIMELAPSE_STYLES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
                    </div>
                    <div className="flex justify-center gap-4">
                       {['manual', 'batch', 'batch_img'].map(m => (
                         <button key={m} onClick={()=>setTimeMode(m as any)} className={`px-8 py-3 rounded-full text-[9px] font-black uppercase ${timeMode===m ? 'bg-amber-800 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400'}`}>
                           {m==='manual'?'������️ Thủ công':m==='batch'?'📝 Text Phases':'📸 Vision AI'}
                         </button>
                       ))}
                    </div>
                    <button onClick={genTimelapse} className="w-full bg-amber-900 text-white py-6 rounded-full font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:bg-black transition-all"><Clock size={24}/> Xuất Prompt Timelapse</button>
                 </div>
                 {timeResult && <div className="glass-panel p-16 rounded-[4rem] bg-amber-950 text-amber-200 font-mono text-lg leading-relaxed whitespace-pre-wrap select-all shadow-2xl">{timeResult}</div>}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="bottom-loader animate-in slide-in-from-bottom-20">
             <div className="flex flex-col items-center gap-1 w-56 shrink-0 border-r pr-10">
                <span className="text-2xl font-black text-amber-800 italic">{loadingPercent.toFixed(0)}%</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Processing...</span>
             </div>
             <div className="progress-track"><div className="progress-fill" style={{ width: `${loadingPercent}%` }}></div></div>
             <div className="flex items-center gap-6 w-[400px] bg-amber-900 px-10 py-3 rounded-full shadow-xl">
                <RefreshCw size={18} className="text-amber-400 animate-spin" /><span className="text-[10px] font-black text-white uppercase tracking-widest line-clamp-1">{loadingText}</span>
             </div>
          </div>
        )}

        {previewImage && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-12 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={()=>setPreviewImage(null)}>
             <div className="relative max-w-7xl w-full flex flex-col items-center">
                <img src={previewImage} className="max-h-[85vh] object-contain rounded-3xl shadow-2xl border-2 border-white/20" />
                <button className="mt-8 px-10 py-4 bg-amber-800 text-white rounded-full font-black uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3" onClick={(e) => { e.stopPropagation(); const a=document.createElement('a'); a.href=previewImage; a.download='preview.png'; a.click(); }}><Download size={20}/> Lưu hình ảnh</button>
             </div>
          </div>
        )}

        {toast && (
          <div className="fixed top-24 right-12 z-[150] animate-in slide-in-from-right-10">
            <div className="glass-panel bg-amber-950 text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-5 border-4 border-amber-700">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"><Check size={20} className="text-white" /></div>
              <span className="text-[10px] font-black tracking-widest uppercase">{toast}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
