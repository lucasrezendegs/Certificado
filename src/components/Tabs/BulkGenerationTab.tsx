import React, { useState } from 'react';
import Papa from 'papaparse';
import { useAppStore } from '../../store';
import { StudentData } from '../../types';
import { Upload, FileText, CheckCircle2, Users, Info } from 'lucide-react';

interface Props {
  setActiveTab: (tab: 'settings' | 'manual' | 'bulk' | 'preview') => void;
}

export const BulkGenerationTab = ({ setActiveTab }: Props) => {
  const { students, setStudents } = useAppStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processParsedData(results.data);
        }
      });
    }
  };

  const processParsedData = (data: any[]) => {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    // Helper for date conversion if they input DD/MM/YYYY
    const parseCSVDate = (d: string) => {
      if (!d) return '';
      if (d.includes('/')) {
         const [day, month, year] = d.split('/');
         if (year && month && day) return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return d; // Return as is (might be YYYY-MM-DD or empty)
    };

    const newStudents: StudentData[] = data.map(row => ({
      id: crypto.randomUUID(),
      controlNumber: row.controlNumber || row['Nº Controle'] || '',
      name: row.name || row['Nome'] || '',
      cpf: row.cpf || row['CPF'] || '',
      registry: row.registry || row['Nº Registro'] || '',
      category: row.category || row['Categoria'] || '',
      course: row.course || row['Curso'] || '',
      periodStart: parseCSVDate(row.periodStart || row['Data Início'] || ''),
      periodEnd: parseCSVDate(row.periodEnd || row['Data Término'] || ''),
      period: row.period || row['Período'] || '', // Legacy fallback
      workload: row.workload || row['Carga Horária'] || '',
      issueDate: parseCSVDate(row.issueDate || row['Data Emissão'] || '') || todayISO,
    })).filter(s => s.name && s.cpf); 

    setStudents([...students, ...newStudents]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/60">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-700">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Geração em Lote (Massa)
            </h2>
            <p className="text-slate-500 text-sm mt-1">Gere dezenas de certificados instantaneamente a partir de uma planilha CSV.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Instruções da Planilha */}
          <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
              <Info size={20} className="text-blue-600" /> Instruções da Planilha
            </h3>
            <p className="text-sm text-slate-600">
              Para garantir que os certificados sejam gerados corretamente, sua planilha Excel deve ser salva no formato <strong>CSV (Separado por vírgulas)</strong> ou <strong>CSV (UTF-8)</strong>.
            </p>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm">
              <p className="font-bold text-slate-700 mb-2">Cabeçalhos Obrigatórios (primeira linha):</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 font-mono text-xs">
                <li>Nome</li>
                <li>CPF</li>
                <li>Nº Registro</li>
                <li>Categoria</li>
                <li>Curso</li>
                <li>Data Início <span className="font-sans text-slate-400">(DD/MM/AAAA)</span></li>
                <li>Data Término <span className="font-sans text-slate-400">(DD/MM/AAAA)</span></li>
                <li>Carga Horária</li>
                <li>Data Emissão <span className="font-sans text-slate-400">(Opcional)</span></li>
                <li>Nº Controle <span className="font-sans text-slate-400">(Opcional)</span></li>
              </ul>
            </div>
          </div>

          {/* Upload Arquivo */}
          <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              Importar Planilha CSV
            </h3>
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Faça o upload do seu arquivo .csv preparado.
            </p>
            <div className="border-2 border-emerald-200 border-dashed rounded-xl p-10 text-center bg-white hover:bg-emerald-50 transition-colors cursor-pointer group h-[200px] flex flex-col items-center justify-center">
              <label htmlFor="csvUpload" className="cursor-pointer flex flex-col items-center w-full">
                <div className="bg-emerald-100 p-4 rounded-full group-hover:scale-110 transition-transform mb-3">
                  <Upload size={32} className="text-emerald-700" />
                </div>
                <span className="text-lg font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors">Selecionar arquivo CSV</span>
                <input id="csvUpload" type="file" accept=".csv" className="sr-only" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* Prévia e Ações */}
        {students.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-500 bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="text-emerald-500" />
                  {students.length} Alunos Carregados
                </h3>
                <p className="text-emerald-700 text-sm">Os alunos foram adicionados à fila com sucesso.</p>
              </div>
              <button
                onClick={() => setActiveTab('preview')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Users size={20} />
                Revisar na Fila e Baixar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
