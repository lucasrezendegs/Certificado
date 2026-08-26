import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAppStore } from '../../store';
import { StudentData } from '../../types';
import { SingleCertificatePDF } from '../CertificatePDF';
import { Download, PlusCircle, User, BookOpen, FileCheck, Calendar } from 'lucide-react';

export const ManualEntryTab = () => {
  const { directorName, directorSignature, leftBadge, rightBadge, controlNumbers, courses, categories, workloads, addControlNumber, addCourse, addCategory, addWorkload } = useAppStore();
  
  const todayISO = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<StudentData>({
    id: crypto.randomUUID(),
    controlNumber: controlNumbers[0] || '',
    name: '',
    cpf: '',
    registry: '',
    category: categories[0] || '',
    course: courses[0] || '',
    periodStart: '',
    periodEnd: '',
    workload: workloads[0] || '',
    issueDate: todayISO,
  });

  const [newControlNumber, setNewControlNumber] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newWorkload, setNewWorkload] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3) + '.' + value.slice(3);
    if (value.length > 7) value = value.slice(0, 7) + '.' + value.slice(7);
    if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11);
    value = value.slice(0, 14);
    setFormData(prev => ({ ...prev, cpf: value }));
  };

  const isFormValid = !!(
    formData.controlNumber && formData.name && formData.cpf && 
    formData.registry && formData.category && formData.course && 
    formData.periodStart && formData.periodEnd && formData.workload && formData.issueDate
  );

  const sanitizeFileName = (name: string) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').toUpperCase();
  };

  const Label = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
      {Icon && <Icon size={14} />}
      {children}
    </label>
  );

  const inputClasses = "w-full px-4 py-3 text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm";
  const selectClasses = "w-full px-4 py-3 text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm appearance-none cursor-pointer";
  const addBtnClasses = "px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm flex items-center gap-1 transition-colors border border-blue-200";

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/60">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
        <div className="bg-blue-100 p-3 rounded-lg text-blue-700">
          <FileCheck size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Gerar Certificado Individual
          </h2>
          <p className="text-slate-500 text-sm mt-1">Preencha os dados abaixo para gerar um PDF com formatação impecável.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Identificação do Aluno */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
            <User className="text-amber-500" size={20} />
            Dados do Aluno
          </h3>
          <div className="space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <Label>Nome Completo</Label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Ex: CARLOS HENRIQUE CAETANO DA SILVA" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CPF</Label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleCpfChange} className={inputClasses} placeholder="123.456.789-00" />
              </div>
              <div>
                <Label>Nº de Registro</Label>
                <input type="text" name="registry" value={formData.registry} onChange={handleChange} className={inputClasses} placeholder="07575025319" />
              </div>
            </div>
          </div>
        </div>

        {/* Dados do Curso */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-blue-600 pl-3">
            <BookOpen className="text-blue-600" size={20} />
            Detalhes da Certificação
          </h3>
          <div className="space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-100">
            
            <div>
              <Label>Nº Controle / Ano</Label>
              <div className="flex gap-2">
                <select name="controlNumber" value={formData.controlNumber} onChange={handleChange} className={selectClasses}>
                  {controlNumbers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <input type="text" value={newControlNumber} onChange={e => setNewControlNumber(e.target.value)} placeholder="Novo número..." className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
                <button type="button" onClick={() => { if(newControlNumber) { addControlNumber(newControlNumber); setFormData({...formData, controlNumber: newControlNumber}); setNewControlNumber(''); } }} className={addBtnClasses}>
                  <PlusCircle size={16} /> Add
                </button>
              </div>
            </div>

            <div>
              <Label>Nome do Curso</Label>
              <div className="flex gap-2">
                <select name="course" value={formData.course} onChange={handleChange} className={selectClasses}>
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <input type="text" value={newCourse} onChange={e => setNewCourse(e.target.value)} placeholder="Novo curso..." className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
                <button type="button" onClick={() => { if(newCourse) { addCourse(newCourse); setFormData({...formData, course: newCourse}); setNewCourse(''); } }} className={addBtnClasses}>
                  <PlusCircle size={16} /> Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoria</Label>
                <div className="space-y-2">
                  <select name="category" value={formData.category} onChange={handleChange} className={selectClasses}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nova..." className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none w-full" />
                    <button type="button" onClick={() => { if(newCategory) { addCategory(newCategory); setFormData({...formData, category: newCategory}); setNewCategory(''); } }} className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md">
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Carga Horária</Label>
                <div className="space-y-2">
                  <select name="workload" value={formData.workload} onChange={handleChange} className={selectClasses}>
                    {workloads.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <input type="text" value={newWorkload} onChange={e => setNewWorkload(e.target.value)} placeholder="Nova..." className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none w-full" />
                    <button type="button" onClick={() => { if(newWorkload) { addWorkload(newWorkload); setFormData({...formData, workload: newWorkload}); setNewWorkload(''); } }} className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md">
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label icon={Calendar}>Período de Realização</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Início</div>
                  <input type="date" name="periodStart" value={formData.periodStart} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Término</div>
                  <input type="date" name="periodEnd" value={formData.periodEnd} onChange={handleChange} className={inputClasses} />
                </div>
              </div>
            </div>

            <div>
              <Label icon={Calendar}>Data de Emissão</Label>
              <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className={inputClasses} />
            </div>

          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-200 flex justify-end">
        {!isFormValid ? (
          <div className="text-amber-700 font-semibold p-4 bg-amber-50 rounded-lg border border-amber-200 w-full text-center shadow-sm">
            Preencha todos os campos corretamente para habilitar a geração do certificado.
          </div>
        ) : (
          <PDFDownloadLink
            document={<SingleCertificatePDF student={formData} directorName={directorName} directorSignature={directorSignature} leftBadge={leftBadge} rightBadge={rightBadge} />}
            fileName={`CERTIFICADO_${sanitizeFileName(formData.name)}.pdf`}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white text-xl font-bold py-5 px-10 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95"
          >
            {({ loading }) => (
              <>
                <Download size={28} />
                {loading ? 'Preparando Documento...' : 'Gerar e Baixar PDF'}
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};
