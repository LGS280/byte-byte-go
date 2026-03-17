import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Utensils, ChefHat, Package, Database, Play, RotateCcw, Code2, Table, ShieldAlert, CheckCircle2, ArrowRight, Box } from 'lucide-react';

export const LayerDemo = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const messages = [
    "Sẵn sàng nhận order...",
    "1. Khách gọi món (Client ➔ Phục vụ)",
    "2. Phục vụ đưa order cho bếp (Phục vụ ➔ Đầu bếp)",
    "3. Bếp yêu cầu nguyên liệu (Đầu bếp ➔ Thủ kho)",
    "4. Thủ kho vào kho lạnh lấy đồ (Thủ kho ➔ Database)",
    "5. Lấy đồ thành công (Database ➔ Thủ kho)",
    "6. Giao nguyên liệu cho bếp (Thủ kho ➔ Đầu bếp)",
    "7. Bếp nấu xong, đưa món (Đầu bếp ➔ Phục vụ)",
    "8. Phục vụ mang món cho khách (Phục vụ ➔ Client) 🎉"
  ];

  useEffect(() => {
    if (isPlaying && step < 8) {
      const timer = setTimeout(() => setStep(s => s + 1), 1500);
      return () => clearTimeout(timer);
    } else if (step === 8) {
      setIsPlaying(false);
    }
  }, [isPlaying, step]);

  const handlePlay = () => {
    if (step === 8) setStep(0);
    setIsPlaying(true);
  };

  const nodes = [
    { id: 'client', icon: User, label: 'Khách hàng', desc: 'Client' },
    { id: 'pl', icon: Utensils, label: 'Phục vụ', desc: 'Presentation' },
    { id: 'bll', icon: ChefHat, label: 'Đầu bếp', desc: 'Business Logic' },
    { id: 'dal', icon: Package, label: 'Thủ kho', desc: 'Data Access' },
    { id: 'db', icon: Database, label: 'Kho lạnh', desc: 'Database' }
  ];

  const getActiveNode = () => {
    if (step === 0) return -1;
    if (step === 1 || step === 8) return 0;
    if (step === 2 || step === 7) return 1;
    if (step === 3 || step === 6) return 2;
    if (step === 4 || step === 5) return 3;
    if (step === 4) return 4;
    return -1;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold mb-4">
          <span className="relative flex h-3 w-3">
            {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          {messages[step]}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-4 md:gap-0 relative">
        {/* Progress Line Background */}
        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-100 -z-10 -translate-y-1/2" />
        
        {nodes.map((node, index) => {
          const isActive = getActiveNode() === index || (step === 4 && index === 4) || (step === 5 && index === 4);
          const Icon = node.icon;
          
          return (
            <div key={node.id} className="flex flex-col items-center relative z-10 bg-white p-2">
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  borderColor: isActive ? '#6366f1' : '#e2e8f0',
                  backgroundColor: isActive ? '#eef2ff' : '#ffffff',
                  color: isActive ? '#4f46e5' : '#64748b'
                }}
                className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-sm mb-3 transition-colors duration-300"
              >
                <Icon className="w-8 h-8" />
              </motion.div>
              <div className="text-sm font-bold text-slate-700">{node.label}</div>
              <div className="text-xs text-slate-400">{node.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex gap-4">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
        >
          <Play className="w-5 h-5" />
          {step === 8 ? 'Chạy lại' : 'Bắt đầu Order'}
        </button>
        <button
          onClick={() => { setStep(0); setIsPlaying(false); }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
};

export const EFCoreDemo = () => {
  const [mode, setMode] = useState<'code'|'db'>('code');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleRun = () => {
    setIsProcessing(true);
    setIsDone(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 2000);
  };

  const reset = (newMode: 'code'|'db') => {
    setMode(newMode);
    setIsProcessing(false);
    setIsDone(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => reset('code')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mode === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Code-First
        </button>
        <button
          onClick={() => reset('db')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mode === 'db' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Database-First
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side */}
        <div className={`flex-1 w-full p-6 rounded-2xl border-2 ${mode === 'code' ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'} transition-all`}>
          <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold">
            <Code2 className="w-5 h-5" />
            Bản thiết kế (Code C#)
          </div>
          <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-xl overflow-x-auto shadow-inner">
            <code>
{`public class User {
  public int Id { get; set; }
  public string Name { get; set; }
}`}
            </code>
          </pre>
          {mode === 'db' && isDone && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Code được tạo tự động!
            </motion.div>
          )}
        </div>

        {/* Middle Action */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isProcessing || isDone}
            className={`flex items-center justify-center w-16 h-16 rounded-full text-white font-bold shadow-lg transition-all ${isProcessing ? 'animate-pulse' : 'hover:scale-105'} ${mode === 'code' ? 'bg-indigo-600' : 'bg-emerald-600'} disabled:opacity-50`}
          >
            {isProcessing ? '...' : <Play className="w-6 h-6 ml-1" />}
          </button>
          <div className="text-xs font-bold text-slate-500 text-center">
            {mode === 'code' ? 'Chạy Migration' : 'Chạy Scaffold'}
          </div>
        </div>

        {/* Right Side */}
        <div className={`flex-1 w-full p-6 rounded-2xl border-2 ${mode === 'db' ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'} transition-all`}>
          <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold">
            <Table className="w-5 h-5" />
            Ngôi nhà (Database)
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600">
                <tr><th className="p-2 border-b">Column</th><th className="p-2 border-b">Type</th></tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border-b font-mono">Id</td><td className="p-2 border-b text-slate-500">INT (PK)</td></tr>
                <tr><td className="p-2 font-mono">Name</td><td className="p-2 text-slate-500">VARCHAR</td></tr>
              </tbody>
            </table>
          </div>
          {mode === 'code' && isDone && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-xs text-indigo-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Bảng được tạo tự động!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export const MapperDemo = () => {
  const [isMapped, setIsMapped] = useState(false);

  const handleMap = () => {
    setIsMapped(false);
    setTimeout(() => setIsMapped(true), 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Entity Box */}
        <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
            <Database className="w-6 h-6 text-slate-600" />
            <div>
              <h4 className="font-bold text-slate-800">Entity Model</h4>
              <p className="text-xs text-slate-500">Linh kiện thô trong kho</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
              <span className="font-mono text-sm font-bold text-slate-700">Id</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">1001</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
              <span className="font-mono text-sm font-bold text-slate-700">Name</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">John Doe</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg">
              <span className="font-mono text-sm font-bold text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> PasswordHash
              </span>
              <span className="text-xs bg-red-100 px-2 py-1 rounded text-red-600">***</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg">
              <span className="font-mono text-sm font-bold text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> CreditCard
              </span>
              <span className="text-xs bg-red-100 px-2 py-1 rounded text-red-600">4111...</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleMap}
            className="group flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Box className="w-8 h-8 mb-1 group-hover:animate-bounce" />
            <span className="text-xs">Đóng gói</span>
          </button>
          <div className="text-xs font-bold text-slate-400">AutoMapper</div>
        </div>

        {/* DTO Box */}
        <div className="flex-1 w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-indigo-200 pb-4">
            <Package className="w-6 h-6 text-indigo-600" />
            <div>
              <h4 className="font-bold text-indigo-900">User DTO</h4>
              <p className="text-xs text-indigo-600/70">Hộp hàng giao cho khách</p>
            </div>
          </div>
          <div className="space-y-3 min-h-[240px]">
            <AnimatePresence>
              {isMapped && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="flex justify-between items-center p-3 bg-white border border-indigo-100 rounded-lg shadow-sm"
                  >
                    <span className="font-mono text-sm font-bold text-indigo-700">Id</span>
                    <span className="text-xs bg-indigo-50 px-2 py-1 rounded text-indigo-600">1001</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="flex justify-between items-center p-3 bg-white border border-indigo-100 rounded-lg shadow-sm"
                  >
                    <span className="font-mono text-sm font-bold text-indigo-700">Name</span>
                    <span className="text-xs bg-indigo-50 px-2 py-1 rounded text-indigo-600">John Doe</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-emerald-700">Đã lọc bỏ dữ liệu nhạy cảm!</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            {!isMapped && (
              <div className="h-full flex flex-col items-center justify-center text-indigo-300 opacity-50 pt-10">
                <Box className="w-12 h-12 mb-2" />
                <p className="text-sm font-medium">Hộp đang trống</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
