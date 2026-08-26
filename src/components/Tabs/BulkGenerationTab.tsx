import React, { useState } from 'react';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import { useAppStore } from '../../store';
import { StudentData } from '../../types';
import { SingleCertificatePDF, BulkCertificatePDF } from '../CertificatePDF';
import { Upload, FileText, Download, Trash2, Archive, Users, CheckCircle2 } from 'lucide-react';

export const BulkGenerationTab = () => {
  const { students, setStudents, clearStudents, removeStudent, directorName, directorSignature, leftBadge, rightBadge } = useAppStore();
  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleTextParse = () => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processParsedData(results.data);
      }
    });
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
    setCsvText('');
  };

  const sanitizeFileName = (name: string) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').toUpperCase();
  };

  const generateZip = async () => {
    setIsProcessing(true);
    try {
      const JSZipModule = (await import('jszip')).default;
      const zip = new JSZipModule();
      
      for (const student of students) {
        const doc = <SingleCertificatePDF student={student} directorName={directorName} directorSignature={directorSignature} leftBadge={leftBadge} rightBadge={rightBadge} />;
        const asPdf = pdf();
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();
        
        const fileName = `CERTIFICADO_${sanitizeFileName(student.name)}.pdf`;
        zip.file(fileName, blob);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'certificados_lote.zip');
    } catch (error) {
      console.error('Erro ao gerar ZIP:', error);
      alert('Ocorreu um erro ao gerar o arquivo ZIP.');
    } finally {
      setIsProcessing(false);
    }
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
            <p className="text-slate-500 text-sm mt-1">Gere dezenas de certificados instantaneamente a partir de uma planilha Excel.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Opção 1: Texto */}
          <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
              Opção 1: Colar Dados
            </h3>
            <p className="text-sm text-slate-600 mb-2 font-medium">
              Copie do Excel e cole aqui (mantenha os cabeçalhos).
            </p>
            <textarea
              className="w-full h-40 p-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-mono bg-white shadow-inner"
              placeholder="controlNumber,name,cpf,registry,category,course,periodStart,periodEnd,workload,issueDate&#10;001/2026,JOÃO SILVA,123.456.789-00,0123,AD,Direção,2026-05-01,2026-05-05,50h/a,10/05/2026"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <button
              onClick={handleTextParse}
              disabled={!csvText.trim()}
              className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <FileText size={18} /> Processar Texto
            </button>
          </div>

          {/* Opção 2: Arquivo */}
          <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              Opção 2: Arquivo CSV
            </h3>
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Faça o upload de um arquivo .csv salvo do seu Excel.
            </p>
            <div className="border-2 border-emerald-200 border-dashed rounded-xl p-10 text-center bg-white hover:bg-emerald-50 transition-colors cursor-pointer group h-[200px] flex items-center justify-center">
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
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" />
                Alunos Carregados ({students.length})
              </h3>
              <button 
                onClick={clearStudents}
                className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-transparent hover:border-red-200"
              >
                <Trash2 size={18} /> Limpar Lista
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4 border-b">Nome</th>
                    <th className="p-4 border-b">CPF</th>
                    <th className="p-4 border-b">Curso</th>
                    <th className="p-4 border-b text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{student.name}</td>
                      <td className="p-4 font-mono text-slate-600">{student.cpf}</td>
                      <td className="p-4">{student.course}</td>
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

            <div className="flex flex-col md:flex-row gap-5 pt-8">
              <PDFDownloadLink
                document={<BulkCertificatePDF students={students} directorName={directorName} directorSignature={directorSignature} leftBadge={leftBadge} rightBadge={rightBadge} />}
                fileName="CERTIFICADOS_LOTE.pdf"
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white text-lg font-bold py-5 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                {({ loading }) => (
                  <>
                    <FileText size={24} />
                    {loading ? 'Gerando Documento Único...' : 'Arquivo Único (PDF Impressão)'}
                  </>
                )}
              </PDFDownloadLink>
              
              <button
                onClick={generateZip}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white text-lg font-bold py-5 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Archive size={24} />
                {isProcessing ? 'Processando e Compactando...' : 'Arquivos Individuais (Baixar ZIP)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
