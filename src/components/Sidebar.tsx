import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { ElementProps } from './ElementProps';
import { Palette } from './Palette';
import { exportSvgToPng, exportIconsZip, downloadProjectJson } from '../utils/exportUtils';

const SWATCHES_BASE = [
  "#138EE5", "#673AB7", "#D81B60", "#FFC107", "#2AAC01", "#14532D", 
  "#FFFFFF", "#EF6C00", "#131517", "#24282E", "#4A4E69", "#B5838D"
];
const SWATCHES_TEXT = [
  "#FFFFFF", "#D1D5DB", "#6B7280", "#374151", "#000000", "#138EE5", 
  "#2AAC01", "#FFC107", "#EF6C00", "#D81B60", "#673AB7", "#0ea5e9"
];

export const Sidebar: React.FC = () => {
  const { 
    canvasWidth, canvasHeight, setCanvasDimensions, 
    colorBase, colorText, setColorBase, setColorText, 
    elements, undo, past, resetProject, loadProject, addElement
  } = useEditorStore();

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('mainSvg');
    if (!svgElement) return;
    const clone = svgElement.cloneNode(true) as unknown as SVGSVGElement;
    clone.style.cursor = '';
    clone.style.maxWidth = '';
    clone.style.maxHeight = '';
    
    const svgString = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logo_generado.svg';
    a.click();
  };

  const handleExportPNG = () => {
    const svgElement = document.getElementById('mainSvg');
    if (!svgElement) return;
    // Exportar solo el tamaño definido actualmente
    exportSvgToPng(svgElement as unknown as SVGSVGElement, [canvasWidth], [canvasHeight], 'logo_generado');
  };

  const handleExportZip = () => {
    const svgElement = document.getElementById('mainSvg');
    if (!svgElement) return;
    exportIconsZip(svgElement as unknown as SVGSVGElement, [32, 48, 64, 72, 192, 512], 'iconos_repsic');
  };

  const handleSaveJson = () => {
    const state = useEditorStore.getState();
    downloadProjectJson({
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      colorBase: state.colorBase,
      colorText: state.colorText,
      elements: state.elements
    });
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target?.result as string);
        loadProject(state);
      } catch (err) {
        alert("Error cargando el proyecto JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="w-[380px] h-screen max-h-screen bg-[#1e2023] p-3 border-r border-[#333] overflow-y-auto flex flex-col">
     <h2 className="text-[#03a9f4] text-[10.5px] uppercase tracking-[1.5px] font-bold mt-4 mb-2">Paletas</h2>
      
      <Palette title="Fondo (Canvas)" swatches={SWATCHES_BASE} value={colorBase} onChange={setColorBase} />
      <Palette title="Texto & Elementos" swatches={SWATCHES_TEXT} value={colorText} onChange={setColorText} />

      <h2 className="text-[#03a9f4] text-[10.5px] uppercase tracking-[1.5px] font-bold mt-4 mb-2">Lienzo</h2>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
          <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">ANCHO</label>
          <input 
            type="number" 
            value={canvasWidth} 
            onChange={(e) => setCanvasDimensions(Number(e.target.value), canvasHeight)}
            className="bg-transparent border-none text-white w-full text-[13.5px] outline-none" 
          />
        </div>
        <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
          <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">ALTO</label>
          <input 
            type="number" 
            value={canvasHeight} 
            onChange={(e) => setCanvasDimensions(canvasWidth, Number(e.target.value))}
            className="bg-transparent border-none text-white w-full text-[13.5px] outline-none" 
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 mb-2">
        <h2 className="text-[#0ea5e9] text-[10.5px] uppercase tracking-[1.5px] font-bold">Capas & Diseño</h2>
        <div className="flex gap-1 border border-[#44474e] rounded-[15px] overflow-hidden p-[2px] bg-[#2a2d31]">
            <button 
                onClick={() => addElement('text')}
                className="bg-[#2a2d31] hover:bg-[#3f474e] text-white text-[9px] px-2 py-1 rounded-[12px] transition"
            >
                + TEXTO
            </button>
            <button 
                onClick={() => addElement('rect')}
                className="bg-[#2a2d31] hover:bg-[#3f474e] text-white text-[9px] px-2 py-1 rounded-[12px] transition"
            >
                + RECTÁNGULO
            </button>
            <button 
                onClick={() => addElement('triangle')}
                className="bg-[#2a2d31] hover:bg-[#3f474e] text-white text-[9px] px-2 py-1 rounded-[12px] transition"
            >
                + TRIÁNGULO
            </button>
            <button 
                onClick={() => addElement('oval')}
                className="bg-[#2a2d31] hover:bg-[#3f474e] text-white text-[9px] px-2 py-1 rounded-[12px] transition"
            >
                + ÓVALO
            </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        {Object.values(elements).map(el => (
          <ElementProps key={el.id} element={el} />
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-6 pb-2">
        <label className="border-none p-3 rounded-[24px] font-bold text-[11px] cursor-pointer text-center transition-colors bg-[#2a2d31] text-white hover:bg-[#31353a] border border-[#44474e]">
          CARGAR PROY.
          <input type="file" accept=".json" className="hidden" onChange={handleLoadProject} />
        </label>
        <button 
          onClick={handleSaveJson}
          className="border-none p-3 rounded-[24px] font-bold text-[11px] cursor-pointer transition-colors bg-[#2a2d31] text-white hover:bg-[#31353a] border border-[#44474e]"
        >
          GUARDAR PROY.
        </button>
        
        {canvasWidth === canvasHeight && (
          <button 
            onClick={handleExportZip}
            className="border-none p-3 rounded-[24px] font-bold text-[11px] cursor-pointer transition-colors bg-[#03a9f4] text-[#003544] hover:bg-[#29b6f6] col-span-2"
          >
            EXPORTAR ZIP PARA PWA
          </button>
        )}
        
        <button 
          onClick={handleDownloadSVG}
          className="border-none p-3 rounded-[24px] font-bold text-[11px] cursor-pointer transition-colors bg-white text-black hover:bg-[#e0e0e0] col-span-1"
        >
          EXPORTAR SVG
        </button>
        <button 
          onClick={handleExportPNG}
          className="border-none p-3 rounded-[24px] font-bold text-[11px] cursor-pointer transition-colors bg-[#3f474e] text-white hover:bg-[#4a555e] col-span-1"
        >
          EXPORTAR PNG
        </button>
        
        <div className="col-span-2 grid grid-cols-2 gap-2 mt-1">
          <button 
            onClick={() => {
              (document.activeElement as HTMLElement)?.blur();
              undo();
            }} 
            disabled={past.length === 0}
            className="border-none p-3 rounded-[24px] font-bold text-[11px] cursor-pointer transition-colors bg-[#3f474e] text-[#d1e5f4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            DESHACER
          </button>
          <button 
            onClick={resetProject}
            className="border border-[#601410] bg-transparent p-3 rounded-[24px] font-bold text-[11px] cursor-pointer transition-colors text-[#ffb4ab] hover:bg-[#601410] hover:text-white"
          >
            RESET APP
          </button>
        </div>
      </div>
    </div>
  );
};
