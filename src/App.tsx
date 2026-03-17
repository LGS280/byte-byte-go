/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Database, BookOpen, LayoutTemplate, Menu, X, Code2, PlayCircle } from 'lucide-react';
import { Mermaid } from './components/Mermaid';
import { topics } from './data/topics';
import { LayerDemo, EFCoreDemo, MapperDemo } from './components/Demos';

export default function App() {
  const [activeTopic, setActiveTopic] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const nextTopic = () => {
    setActiveTopic((prev) => Math.min(prev + 1, topics.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevTopic = () => {
    setActiveTopic((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topic = topics[activeTopic];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextTopic();
      if (e.key === 'ArrowLeft') prevTopic();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTopic]);

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">WebAPI Masterclass</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="hidden lg:flex p-6 border-b border-slate-200 items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              WebAPI Masterclass
            </h1>
            <p className="text-xs text-slate-500 font-medium">Interactive Learning</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Nội dung khóa học
          </div>
          {topics.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTopic(i);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-start gap-3 ${
                activeTopic === i 
                  ? 'bg-indigo-50 border border-indigo-100/50 shadow-sm' 
                  : 'hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                activeTopic === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
              }`}>
                {i + 1}
              </div>
              <div>
                <div className={`text-sm font-semibold leading-tight mb-1 ${
                  activeTopic === i ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'
                }`}>
                  {t.title}
                </div>
                <div className={`text-xs ${
                  activeTopic === i ? 'text-indigo-600/80' : 'text-slate-500'
                }`}>
                  {t.subtitle}
                </div>
              </div>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${((activeTopic + 1) / topics.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 text-center font-medium">
            Tiến độ: {activeTopic + 1} / {topics.length}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white pt-16 lg:pt-0 scroll-smooth" id="main-scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTopic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto p-6 sm:p-8 md:p-12 pb-24"
          >
            {/* Topic Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4">
                Chương {activeTopic + 1}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                {topic.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-indigo-200 pl-4">
                {topic.description}
              </p>
            </div>

            {/* Architecture Diagram */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Sơ đồ Kiến trúc
                </h3>
              </div>
              <div className="bg-[#0f172a] rounded-2xl p-4 sm:p-8 shadow-xl border border-slate-800 overflow-x-auto custom-scrollbar relative group">
                {/* Mac-like window controls for aesthetics */}
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                </div>
                <div className="mt-4">
                  <Mermaid chart={topic.diagram} />
                </div>
              </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Mô phỏng Ứng dụng
                </h3>
              </div>
              <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 overflow-hidden">
                {activeTopic === 0 && <LayerDemo />}
                {activeTopic === 1 && <EFCoreDemo />}
                {activeTopic === 2 && <MapperDemo />}
              </div>
            </div>

            {/* Code Snippet Section */}
            {topic.codeSnippet && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Code Mẫu (C#)
                  </h3>
                </div>
                <div className="bg-[#1e1e1e] rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 overflow-x-auto custom-scrollbar relative group">
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  </div>
                  <pre className="text-sm font-mono text-slate-300 mt-6">
                    <code>{topic.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Key Concepts */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Khái niệm Trọng tâm
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {topic.points.map((point, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center font-bold mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{point.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{point.content}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer Navigation */}
            <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={prevTopic}
                disabled={activeTopic === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all w-full sm:w-auto justify-center ${
                  activeTopic === 0 
                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Bài trước
              </button>
              
              <div className="text-sm font-medium text-slate-500 hidden sm:block">
                {activeTopic + 1} / {topics.length}
              </div>

              <button
                onClick={nextTopic}
                disabled={activeTopic === topics.length - 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all w-full sm:w-auto justify-center ${
                  activeTopic === topics.length - 1
                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                }`}
              >
                Bài tiếp theo
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
