/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, FileEdit, Users } from 'lucide-react';
import { SettingsTab } from './components/Tabs/SettingsTab';
import { ManualEntryTab } from './components/Tabs/ManualEntryTab';
import { BulkGenerationTab } from './components/Tabs/BulkGenerationTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'settings' | 'manual' | 'bulk'>('manual');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Cabeçalho Premium */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-xl border-b-4 border-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-inner">
              <img src="/segexsf.png" alt="Logo SEGEX" className="h-16 w-14 object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 drop-shadow-sm">
                Gerador de Certificados
              </h1>
              <p className="text-amber-400 font-medium text-sm md:text-base mt-1 tracking-wide uppercase">
                Base Administrativa do Quartel-General do Exército (B ADM QGEX)
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Navegação por Abas Refinada */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-md border border-slate-200">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex justify-center items-center gap-2 px-6 py-4 text-sm md:text-base font-bold rounded-lg transition-all duration-200 ${
              activeTab === 'manual' 
                ? 'bg-blue-800 text-white shadow-md transform scale-[1.02]' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileEdit size={20} />
            Entrada Manual
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 flex justify-center items-center gap-2 px-6 py-4 text-sm md:text-base font-bold rounded-lg transition-all duration-200 ${
              activeTab === 'bulk' 
                ? 'bg-blue-800 text-white shadow-md transform scale-[1.02]' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users size={20} />
            Geração em Lote
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex justify-center items-center gap-2 px-6 py-4 text-sm md:text-base font-bold rounded-lg transition-all duration-200 ${
              activeTab === 'settings' 
                ? 'bg-blue-800 text-white shadow-md transform scale-[1.02]' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings size={20} />
            Configurações
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="transition-opacity duration-300">
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'manual' && <ManualEntryTab />}
          {activeTab === 'bulk' && <BulkGenerationTab />}
        </div>

      </main>
    </div>
  );
}
