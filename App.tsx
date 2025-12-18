
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Mood, ListenerProfile, JournalEntry } from './types';
import { MOOD_CONFIG, SAMPLE_LISTENERS, TOPICS } from './constants';
import { 
  Heart, 
  Shield, 
  Phone, 
  Book, 
  Settings, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Star,
  Clock,
  Mic,
  MicOff,
  PhoneOff,
  MessageCircle,
  Search,
  Lock,
  ArrowRight,
  AlertCircle,
  Anchor
} from 'lucide-react';
import { analyzeSentiment, getAIPromptForCall } from './geminiService';

// --- Sub-components ---

const Header = ({ role, setRole }: { role: UserRole, setRole: (r: UserRole) => void }) => (
  <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
        <Heart className="text-white w-5 h-5" />
      </div>
      <h1 className="text-xl md:text-2xl serif font-bold text-slate-900 tracking-tight">HealSpace</h1>
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setRole(role === UserRole.SEEKER ? UserRole.LISTENER : UserRole.SEEKER)}
        className="hidden md:block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all hover:border-indigo-200"
      >
        Switch to {role === UserRole.SEEKER ? 'Listener' : 'Seeker'}
      </button>
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Avatar" />
      </div>
    </div>
  </header>
);

const SeekerDashboard = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [activeCall, setActiveCall] = useState<ListenerProfile | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournaling, setIsJournaling] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [matchingStep, setMatchingStep] = useState(0);

  const startMatching = () => {
    if (!selectedMood || !selectedTopic) return;
    setIsMatching(true);
    setMatchingStep(0);
    
    const steps = [
      "Anonymous line secure kar rahe hain...",
      "Empathetic listeners ko search kar rahe hain...",
      "Identity protection verify ho rahi hai...",
      "Virtual bridge connect ho raha hai..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setMatchingStep(currentStep);
      } else {
        clearInterval(interval);
        const filtered = SAMPLE_LISTENERS.filter(l => l.isOnline && l.tags.includes(selectedTopic!));
        const matched = filtered.length > 0 ? filtered[0] : SAMPLE_LISTENERS[0];
        setActiveCall(matched);
        setIsMatching(false);
      }
    }, 1200);
  };

  const handleAddNote = async () => {
    if (!currentNote.trim() || !selectedMood) return;
    
    const sentiment = await analyzeSentiment(currentNote);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentNote,
      timestamp: Date.now(),
      mood: selectedMood
    };
    setJournalEntries([newEntry, ...journalEntries]);
    setCurrentNote("");
    setIsJournaling(false);

    if (sentiment?.riskLevel === 'high') {
       alert("Humein lag raha hai aap kaafi pareshan hain. Please 'Immediate Help' button use karein agar aapko crisis feel ho raha hai.");
    }
  };

  if (activeCall) {
    return <CallSimulator profile={activeCall} onEnd={() => {
      setActiveCall(null);
      setSelectedMood(null);
      setSelectedTopic(null);
    }} />;
  }

  if (isMatching) {
    return (
      <div className="fixed inset-0 bg-indigo-900 z-[100] flex flex-col items-center justify-center text-white p-6">
        <div className="relative mb-8">
           <div className="w-32 h-32 border-4 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" />
           <Lock className="absolute inset-0 m-auto w-10 h-10 text-indigo-300" />
        </div>
        <h2 className="text-2xl serif font-bold mb-2">Connecting Safely</h2>
        <p className="text-indigo-200 animate-pulse text-lg font-medium">
          {["Anonymous line secure kar rahe hain...", "Empathetic listeners ko search kar rahe hain...", "Identity protection verify ho rahi hai...", "Virtual bridge connect ho raha hai..."][matchingStep]}
        </p>
        <p className="mt-8 text-xs text-indigo-400 max-w-xs text-center">
          HealSpace aapka number mask kar raha hai. Yeh call ek temporary virtual number ke through route ho rahi hai.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <h2 className="text-4xl serif font-bold text-slate-900 mb-3">HealSpace mein swagat hai</h2>
        <p className="text-slate-500 text-lg">Human connection, bina kisi identity ki chinta ke.</p>
      </div>

      <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> 1. Aaj ka mood?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(MOOD_CONFIG).map(([mood, config]) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood as Mood)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${
                    selectedMood === mood 
                    ? `${config.color} ring-4 ring-indigo-50 shadow-inner scale-105` 
                    : 'bg-slate-50 border border-transparent text-slate-400 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="mb-2">{config.icon}</div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2">
              <Search className="w-4 h-4" /> 2. Topic chunein
            </h3>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedTopic === topic 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                    : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          disabled={!selectedMood || !selectedTopic}
          onClick={startMatching}
          className="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-30 disabled:grayscale transform hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-indigo-100 group"
        >
          <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="text-lg">Listener se connect karein</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" /> Encrypted & Anonymous Baat-cheet
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Book className="w-5 h-5 text-indigo-500" />
                 Aapki Private Diary
               </h3>
               {isJournaling && (
                 <button onClick={() => setIsJournaling(false)} className="text-xs text-slate-400 font-bold hover:text-rose-500">Discard</button>
               )}
             </div>

             {isJournaling ? (
               <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                 <textarea 
                   className="w-full h-40 p-5 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all placeholder:italic"
                   placeholder="Yeh jagah sirf aapke liye hai. Dil ki baat yahan likhein..."
                   value={currentNote}
                   onChange={(e) => setCurrentNote(e.target.value)}
                 />
                 <button 
                   onClick={handleAddNote}
                   className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                 >
                   Save Karein
                 </button>
               </div>
             ) : (
               <button 
                 onClick={() => {
                   if (!selectedMood) alert("Pehle mood chunein");
                   else setIsJournaling(true);
                 }}
                 className="w-full py-12 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all flex flex-col items-center gap-3 bg-slate-50/50"
               >
                 <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
                    <Activity className="w-6 h-6" />
                 </div>
                 <span className="text-sm font-bold uppercase tracking-widest">Apne thoughts likhein</span>
               </button>
             )}

             <div className="mt-8 space-y-4">
               {journalEntries.map(entry => (
                 <div key={entry.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">
                       {new Date(entry.timestamp).toLocaleDateString('hi-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                     </span>
                     <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${MOOD_CONFIG[entry.mood].color}`}>
                       {entry.mood}
                     </div>
                   </div>
                   <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">{entry.content}</p>
                 </div>
               ))}
               {journalEntries.length === 0 && !isJournaling && (
                 <div className="text-center py-8">
                   <p className="text-xs text-slate-400 italic">Abhi koi entry nahi hai. Journaling karne se call se pehle clarity milti hai.</p>
                 </div>
               )}
             </div>
           </section>
        </div>

        <div className="space-y-6">
           <section className="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-lg shadow-rose-100">
             <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-rose-600" />
             </div>
             <h3 className="font-bold text-rose-900 text-lg mb-2">Pareshani zyada hai?</h3>
             <p className="text-xs text-rose-700 mb-6 leading-relaxed">Agar aap khatre mein hain ya suicidal feel kar rahe hain, toh please turant professional help lein.</p>
             <button className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 flex items-center justify-center gap-2">
               <Phone className="w-4 h-4" />
               Help Hotlines
             </button>
           </section>

           <section className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
             <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-widest mb-4">Aapki Privacy stats</h4>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-indigo-100">
                      <Shield className="w-5 h-5 text-indigo-500" />
                   </div>
                   <div>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase">Privacy Layer</p>
                      <p className="text-sm font-bold text-indigo-900">100% Anonymous</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-indigo-100">
                      <Lock className="w-5 h-5 text-indigo-500" />
                   </div>
                   <div>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase">Encryption</p>
                      <p className="text-sm font-bold text-indigo-900">Secure Bridge</p>
                   </div>
                </div>
             </div>
           </section>
        </div>
      </div>
    </div>
  );
};

const ListenerDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(15450.00);
  const [callsToday, setCallsToday] = useState(3);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h2 className="text-4xl serif font-bold text-slate-800 mb-2">Namaste, Listener Aarav</h2>
          <p className="text-slate-500 text-lg">Aapka waqt kisi ki life badal sakta hai. Aaj listen karne ke liye ready?</p>
        </div>
        <div className={`p-2 rounded-3xl w-full md:w-auto flex items-center gap-4 pr-8 ${isOnline ? 'bg-green-50 border border-green-100' : 'bg-slate-100 border border-slate-200'}`}>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-wider transition-all shadow-lg ${
              isOnline ? 'bg-green-600 text-white shadow-green-200' : 'bg-white text-slate-600 shadow-slate-200'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </button>
          <div className="flex flex-col">
            <span className={`text-xs font-black uppercase tracking-widest ${isOnline ? 'text-green-700' : 'text-slate-400'}`}>
              Bridge Status
            </span>
            <span className="text-[10px] text-slate-400">
              {isOnline ? 'Seekers ka intezaar...' : 'Abhi band hai'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Kamayi (₹)</p>
          <p className="text-4xl font-bold text-slate-900">₹{earnings.toLocaleString('en-IN')}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-bold">
            <div className="p-1 bg-green-100 rounded-lg"><ChevronRight className="w-3 h-3 -rotate-90" /></div> 15% growth
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Calls (Aaj)</p>
          <p className="text-4xl font-bold text-slate-900">{callsToday}</p>
          <p className="mt-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest">Target: 5 calls</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Empathy Score</p>
          <p className="text-4xl font-bold text-slate-900">4.95</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600 font-bold">
            <CheckCircle2 className="w-3 h-3" /> Top Rated
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-xl">Recent Baat-cheet Logs</h3>
          <button className="text-indigo-600 text-sm font-bold hover:underline">Download Report</button>
        </div>
        <div className="divide-y divide-slate-50">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-8 flex justify-between items-center group hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-inner">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-slate-900">Anonymous Seeker</p>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold">ID: HS-IN-{i}92</span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Topic: Family Rishtey • 14:30 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">₹450.00</p>
                <div className="flex items-center justify-end gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CallSimulator = ({ profile, onEnd }: { profile: ListenerProfile, onEnd: () => void }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const bridgeId = useRef(`HS-IN-${Math.floor(1000 + Math.random() * 9000)}`);
  const virtualNumber = useRef(`+91 9100-010-${Math.floor(10 + Math.random() * 89)}`);

  useEffect(() => {
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    loadIcebreakers();
    return () => clearInterval(timer);
  }, []);

  const loadIcebreakers = async () => {
    const prompts = await getAIPromptForCall("Stressed", ["Family", "Work"]);
    setIcebreakers(prompts);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showFeedback) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="bg-green-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto border border-green-100 shadow-inner">
             <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl serif font-bold text-slate-900 mb-2">Baat-cheet ho gayi.</h2>
            <p className="text-slate-500 text-lg">Aapko {profile.name} ki baatein kitni acchi lagi?</p>
          </div>
          
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                onClick={() => setRating(star)}
                className={`p-1 transition-all transform hover:scale-125 ${rating >= star ? 'text-amber-500' : 'text-slate-100'}`}
              >
                <Star className="w-12 h-12 fill-current" />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <textarea 
              placeholder="Kuch feedback dena chahenge? (Anonymous)"
              className="w-full h-32 p-5 border border-slate-200 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:italic"
            />
            <button 
              onClick={onEnd}
              className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              Session Khatam Karein
            </button>
            <button 
              onClick={() => setShowFeedback(false)}
              className="text-rose-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1 mx-auto py-2 hover:bg-rose-50 px-4 rounded-full transition-all"
            >
              <AlertTriangle className="w-3 h-3" /> Report Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[100] flex flex-col text-white animate-in zoom-in duration-700">
      <div className="p-8 flex justify-between items-center bg-white/5 border-b border-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Bridge Chalu Hai</span>
            <span className="text-xs font-mono text-white/40">{bridgeId.current}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Masked Number</p>
            <p className="text-xs font-mono text-indigo-300">{virtualNumber.current}</p>
          </div>
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 overflow-y-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 rounded-[3rem] animate-ping opacity-10 scale-150" />
          <div className="absolute inset-0 bg-indigo-500 rounded-[3rem] animate-pulse opacity-20 scale-125" />
          <img src={profile.avatar} className="w-48 h-48 rounded-[3rem] object-cover border-8 border-white/5 relative z-10 shadow-2xl" alt={profile.name} />
        </div>

        <div>
          <h2 className="text-4xl serif font-bold mb-3">{profile.name}</h2>
          <div className="flex items-center justify-center gap-2 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6">
            <Anchor className="w-3 h-3" />
            <span>{profile.vibe}</span>
          </div>
          <div className="text-6xl font-mono text-white tracking-tighter tabular-nums mb-8 drop-shadow-lg">
            {formatTime(duration)}
          </div>
        </div>
        
        <div className="w-full max-w-md space-y-4">
           <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Suggested Icebreakers</p>
           <div className="space-y-2">
             {icebreakers.map((text, i) => (
               <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl text-sm text-indigo-200 text-left hover:bg-white/10 transition-colors cursor-default">
                 "{text}"
               </div>
             ))}
             {icebreakers.length === 0 && <div className="animate-pulse text-xs text-indigo-400">Tips generate ho rahe hain...</div>}
           </div>
        </div>
      </div>

      <div className="p-10 pb-16 bg-gradient-to-t from-black/80 to-transparent border-t border-white/5 flex flex-col items-center gap-10">
        <div className="flex items-center gap-12 md:gap-16">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-xl ${
              isMuted ? 'bg-white/5 text-white/40' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-8 h-8 md:w-10 md:h-10" /> : <Mic className="w-8 h-8 md:w-10 md:h-10" />}
          </button>
          
          <button 
            onClick={() => setShowFeedback(true)}
            className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-rose-500 flex items-center justify-center hover:bg-rose-600 transition-all shadow-2xl shadow-rose-900/40 transform hover:scale-110 active:scale-95 group"
          >
            <PhoneOff className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:-rotate-12 transition-transform" />
          </button>

          <button 
            className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-xl"
          >
            <MessageCircle className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-3 h-3" /> Anonymous Masking On
          </p>
          <p className="text-white/20 text-[9px] max-w-xs text-center leading-relaxed">
            Aapka real number {profile.name} se chupa hua hai. Yeh connection HealSpace Secure Proxy manage kar raha hai.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe]">
      <Header role={role} setRole={setRole} />
      <main className="flex-1">
        {role === UserRole.SEEKER ? <SeekerDashboard /> : <ListenerDashboard />}
      </main>
      
      <footer className="py-12 px-6 text-center border-t border-slate-100 bg-white">
        <div className="flex items-center justify-center gap-2 mb-4">
           <Heart className="w-4 h-4 text-indigo-300" />
           <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Compassion First</span>
        </div>
        <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
          HealSpace ek bridge hai, hospital nahi. Agar aap crisis mein hain, toh turant professional help lein.
        </p>
      </footer>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xs bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-[2rem] flex justify-around shadow-2xl md:hidden z-50">
        <button className="text-indigo-400 flex flex-col items-center gap-1 group">
          <Heart className="w-6 h-6 group-active:scale-125 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Home</span>
        </button>
        <button className="text-white/40 flex flex-col items-center gap-1 group">
          <Book className="w-6 h-6 group-active:scale-125 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest">Diary</span>
        </button>
        <button className="text-white/40 flex flex-col items-center gap-1 group">
          <Settings className="w-6 h-6 group-active:scale-125 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest">Me</span>
        </button>
      </nav>
    </div>
  );
}
