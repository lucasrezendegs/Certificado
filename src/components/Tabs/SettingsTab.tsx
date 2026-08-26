import React, { ChangeEvent } from 'react';
import { useAppStore } from '../../store';
import { Settings, Image as ImageIcon, Shield } from 'lucide-react';

export const SettingsTab = () => {
  const { directorName, directorSignature, leftBadge, rightBadge, setDirectorName, setDirectorSignature, setLeftBadge, setRightBadge } = useAppStore();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderUploader = (title: string, value: string | null, setter: (val: string | null) => void, id: string, description: string) => (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex-1">
      <label htmlFor={id} className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </label>
      <div className="mt-2 flex items-center justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-xl bg-white hover:bg-blue-50 transition-colors group cursor-pointer h-[240px]">
        <div className="space-y-3 text-center w-full">
          {value ? (
            <div className="flex flex-col items-center gap-4">
              <img src={value} alt={title} className="h-32 object-contain bg-transparent border-b-2 border-slate-200 pb-2" />
              <button
                type="button"
                onClick={() => setter(null)}
                className="text-red-600 font-bold hover:text-red-800 bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100"
              >
                Remover e Alterar
              </button>
            </div>
          ) : (
            <label htmlFor={id} className="cursor-pointer w-full flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full group-hover:scale-110 transition-transform mb-3">
                <Shield size={32} className="text-blue-600" />
              </div>
              <span className="text-lg font-bold text-blue-700 group-hover:text-blue-800 transition-colors">Selecionar Arquivo</span>
              <p className="text-sm text-slate-500 mt-2 font-medium">{description}</p>
              <input id={id} name={id} type="file" accept="image/*" className="sr-only" onChange={(e) => handleImageUpload(e, setter)} />
            </label>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/60">
        
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
          <div className="bg-slate-100 p-3 rounded-lg text-slate-700">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Configurações Administrativas
            </h2>
            <p className="text-slate-500 text-sm mt-1">Ajuste os dados globais que serão inseridos nos certificados.</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Nome do Diretor */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <label htmlFor="directorName" className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nome do Diretor Geral
            </label>
            <input
              type="text"
              id="directorName"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
              className="w-full px-4 py-3 text-lg bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm"
              placeholder="Ex: Carlos Henrique Ferreira De Mello"
            />
            <p className="mt-2 text-sm text-slate-500 font-medium">Este nome aparecerá abaixo da assinatura em todos os certificados gerados.</p>
          </div>

          {/* Assinatura */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <label htmlFor="signatureUpload" className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Imagem da Assinatura do Diretor
            </label>
            <div className="mt-2 flex items-center justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-xl bg-white hover:bg-blue-50 transition-colors group cursor-pointer h-[240px]">
              <div className="space-y-3 text-center w-full">
                {directorSignature ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={directorSignature} alt="Assinatura" className="h-32 object-contain bg-transparent border-b-2 border-slate-200 pb-2" />
                    <button
                      type="button"
                      onClick={() => setDirectorSignature(null)}
                      className="text-red-600 font-bold hover:text-red-800 bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100"
                    >
                      Remover e Alterar Assinatura
                    </button>
                  </div>
                ) : (
                  <label htmlFor="signatureUpload" className="cursor-pointer w-full flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-full group-hover:scale-110 transition-transform mb-3">
                      <ImageIcon size={32} className="text-blue-600" />
                    </div>
                    <span className="text-lg font-bold text-blue-700 group-hover:text-blue-800 transition-colors">Selecionar Arquivo da Assinatura</span>
                    <p className="text-sm text-slate-500 mt-2 font-medium">PNG ou JPG até 2MB. Prefira imagens com fundo transparente.</p>
                    <input id="signatureUpload" name="signatureUpload" type="file" accept="image/*" className="sr-only" onChange={(e) => handleImageUpload(e, setDirectorSignature)} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Brasões */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield className="text-dourado" /> Brasões e Distintivos do Certificado
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Faça o upload das imagens que você enviou (como "segexsf.png" e "badmqgex2.png") nestes campos. 
              Elas serão exibidas nos cantos superior esquerdo e direito do certificado gerado.
            </p>
            <div className="flex flex-col md:flex-row gap-6">
              {renderUploader(
                "Brasão Esquerdo",
                leftBadge,
                setLeftBadge,
                "leftBadgeUpload",
                "Ex: segexsf.png"
              )}
              {renderUploader(
                "Brasão Direito",
                rightBadge,
                setRightBadge,
                "rightBadgeUpload",
                "Ex: badmqgex2.png"
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
