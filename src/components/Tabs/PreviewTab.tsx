import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { pdf } from '@react-pdf/renderer';
import { BulkCertificatePDF, SingleCertificatePDF } from '../CertificatePDF';
import { Trash2, FileText, Archive, Eye, Users, AlertTriangle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Props {
  setActiveTab: (tab: 'settings' | 'manual' | 'bulk' | 'preview') => void;
}

export const PreviewTab = ({ setActiveTab }: Props) => {
  const { students, removeStudent, clearStudents, directorName, directorRegistry, directorSignature, clearQueueBehavior, setClearQueueBehavior } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const sanitizeFileName = (name: string) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').toUpperCase();
  };

  const handlePostDownload = () => {
    if (clearQueueBehavior === 'always') {
      clearStudents();
    } else if (clearQueueBehavior === 'never') {
      // do nothing
    } else {
      setShowClearPrompt(true);
    }
  };

  const generateZip = async () => {
    try {
      setIsProcessing(true);
      const zip = new JSZip();
      
      for (const student of students) {
        const doc = <SingleCertificatePDF student={student} directorName={directorName} directorRegistry={directorRegistry} directorSignature={directorSignature} />;
        const asPdf = pdf();
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();
        
        const fileName = `CERTIFICADO_${sanitizeFileName(student.name)}.pdf`;
        zip.file(fileName, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'CERTIFICADOS_INDIVIDUAIS.zip');
      handlePostDownload();
    } catch (error) {
      console.error('Erro ao gerar ZIP:', error);
      alert('Houve um erro ao gerar o arquivo ZIP.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateBulkPDF = async () => {
    try {
      setIsProcessing(true);
      const doc = <BulkCertificatePDF students={students} directorName={directorName} directorRegistry={directorRegistry} directorSignature={directorSignature} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      saveAs(blob, 'CERTIFICADOS_LOTE.pdf');
      handlePostDownload();
    } catch (error) {
      console.error('Erro ao gerar PDF Único:', error);
      alert('Houve um erro ao gerar o PDF Único.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromptChoice = (clear: boolean) => {
    if (dontAskAgain) {
      setClearQueueBehavior(clear ? 'always' : 'never');
    }
    if (clear) {
      clearStudents();
    }
    setShowClearPrompt(false);
  };

  if (students.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-200/60 text-center flex flex-col items-center">
          <div className="bg-slate-100 p-6 rounded-full mb-6">
            <Eye size={48} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">A Fila de Geração está vazia</h2>
          <p className="text-slate-500 mb-8 max-w-md">
            Você ainda não adicionou nenhum aluno. Adicione alunos individualmente na aba Entrada Manual ou importe uma planilha na aba Geração em Lote.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('manual')}
              className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-xl transition-colors"
            >
              Entrada Manual
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className="px-6 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl transition-colors"
            >
              Importar Lote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/60">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Eye className="text-blue-600" />
            Pré-visualização e Fila ({students.length})
          </h2>
          <button 
            onClick={clearStudents}
            className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-transparent hover:border-red-200"
          >
            <Trash2 size={18} /> Limpar Fila
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm mb-10">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 border-b">Nome</th>
                <th className="p-4 border-b">CPF</th>
                <th className="p-4 border-b">Nº Registro</th>
                <th className="p-4 border-b">Controle/Ano</th>
                <th className="p-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">{student.name}</td>
                  <td className="p-4 font-mono text-slate-600">{student.cpf}</td>
                  <td className="p-4 font-mono text-slate-600">{student.registry}</td>
                  <td className="p-4 font-mono font-semibold text-slate-800">{student.controlNumber}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => removeStudent(student.id)} className="text-slate-400 hover:text-red-600 transition-colors bg-white hover:bg-red-50 p-2 rounded-md shadow-sm border border-slate-200 hover:border-red-200" title="Remover aluno">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <button
            onClick={generateBulkPDF}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white text-lg font-bold py-5 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
          >
            <FileText size={24} />
            {isProcessing ? 'Gerando Documento...' : 'Baixar PDF Único (Impressão)'}
          </button>
          
          <button
            onClick={generateZip}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white text-lg font-bold py-5 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Archive size={24} />
            {isProcessing ? 'Compactando Arquivos...' : 'Baixar ZIP (Separados)'}
          </button>
        </div>
      </div>

      {showClearPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-amber-600 mb-4 border-b border-slate-100 pb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Limpar a fila?</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Você acabou de realizar o download. Deseja limpar a fila de geração ou manter os dados para realizar mais alguma operação?
            </p>
            
            <label className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                checked={dontAskAgain}
                onChange={(e) => setDontAskAgain(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-600"
              />
              <span className="text-slate-700 font-medium text-sm">Não perguntar novamente (pode ser alterado depois nas Configurações)</span>
            </label>

            <div className="flex gap-3">
              <button 
                onClick={() => handlePromptChoice(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
              >
                Manter Fila
              </button>
              <button 
                onClick={() => handlePromptChoice(true)}
                className="flex-1 py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                <Trash2 size={18} /> Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
