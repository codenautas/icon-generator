import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { operativo: string, onda: string, entorno: string }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [operativo, setOperativo] = useState('REPSIC');
  const [onda, setOnda] = useState('252');
  const [entorno, setEntorno] = useState('capa');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!operativo.trim() || !onda.trim()) {
      alert("Operativo y Onda son obligatorios.");
      return;
    }
    onConfirm({ operativo, onda, entorno });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e2023] border border-[#44474e] rounded-[24px] w-full max-w-[400px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col gap-1">
          <h3 className="text-[#03a9f4] text-[18px] font-bold">Datos de Exportación</h3>
          <p className="text-[#9ea3ae] text-[12px]">Complete la información del operativo para generar los nombres de archivo.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#03a9f4] font-bold uppercase tracking-wider ml-1">Operativo *</label>
            <input 
              type="text" 
              value={operativo} 
              onChange={(e) => setOperativo(e.target.value.toUpperCase())}
              placeholder="Ej: REPSIC"
              className="bg-[#121416] border border-[#44474e] rounded-[12px] px-4 py-2.5 text-white text-[14px] outline-none focus:border-[#03a9f4] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#03a9f4] font-bold uppercase tracking-wider ml-1">Número de Onda *</label>
            <input 
              type="text" 
              value={onda} 
              onChange={(e) => setOnda(e.target.value)}
              placeholder="Ej: 252"
              className="bg-[#121416] border border-[#44474e] rounded-[12px] px-4 py-2.5 text-white text-[14px] outline-none focus:border-[#03a9f4] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#03a9f4] font-bold uppercase tracking-wider ml-1">Entorno (Opcional)</label>
            <input 
              type="text" 
              value={entorno} 
              onChange={(e) => setEntorno(e.target.value)}
              placeholder="Ej: capa, desu, etc."
              className="bg-[#121416] border border-[#44474e] rounded-[12px] px-4 py-2.5 text-white text-[14px] outline-none focus:border-[#03a9f4] transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button 
            onClick={onClose}
            className="flex-1 bg-[#2a2d31] hover:bg-[#31353a] text-white font-bold py-3 rounded-[16px] transition-colors text-[13px]"
          >
            CANCELAR
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 bg-[#03a9f4] hover:bg-[#29b6f6] text-[#003544] font-bold py-3 rounded-[16px] transition-colors text-[13px]"
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
};
