import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import type { SvgElement, RectElement, CircleElement, TriangleElement, OvalElement, TextElement } from '../types';

const FONTS = [
  { name: 'Roboto', val: "'Roboto', sans-serif" },
  { name: 'Syncopate', val: "'Syncopate', sans-serif" },
  { name: 'Bebas Neue', val: "'Bebas Neue', sans-serif" },
  { name: 'Space Grotesk', val: "'Space Grotesk', sans-serif" },
  { name: 'Montserrat', val: "'Montserrat', sans-serif" },
  { name: 'Anton', val: "'Anton', sans-serif" },
  { name: 'Kanit', val: "'Kanit', sans-serif" },
  { name: 'Playfair Display', val: "'Playfair Display', serif" },
  { name: 'Abril Fatface', val: "'Abril Fatface', serif" },
  { name: 'Pacifico', val: "'Pacifico', cursive" },
  { name: 'Lobster', val: "'Lobster', cursive" },
  { name: 'Fira Code', val: "'Fira Code', monospace" }
];

export const ElementProps: React.FC<{ element: SvgElement }> = ({ element }) => {
  const {
    updateElement, updateElementWithHistory, saveHistory,
    toggleVisibility, selectElement, selectedId, removeElement
  } = useEditorStore();
  const isActive = selectedId === element.id;

  const [localText, setLocalText] = useState(element.type === 'text' ? element.text : '');

  useEffect(() => {
    if (element.type === 'text') setLocalText(element.text);
  }, [element]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalText(val);
    if (element.type === 'text') {
      updateElement(element.id, { text: val });
    }
  };

  const handleTextFocus = () => {
    saveHistory();
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <div
      onClick={() => selectElement(element.id)}
      className={`bg-[#2a2d31] p-3 rounded-[16px] border transition-all duration-200 cursor-pointer ${isActive ? 'border-[#03a9f4] bg-[#31353a] shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 'border-transparent'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[12px] font-bold text-white flex-1">{element.name.toUpperCase()}</span>
        <div className="flex items-center gap-2">
          <label className="relative inline-block w-[34px] h-[18px] flex-none cursor-pointer">
            <input
              type="checkbox"
              checked={element.visible}
              onChange={() => toggleVisibility(element.id)}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="absolute inset-0 bg-[#5d6066] duration-300 rounded-[20px] peer-checked:bg-[#03a9f4] before:absolute before:content-[''] before:h-[12px] before:w-[12px] before:left-[3px] before:bottom-[3px] before:bg-white before:duration-300 before:rounded-full peer-checked:before:translate-x-[16px]" />
          </label>
          <button
            onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
            className="text-[#f43f5e] hover:text-[#fb7185] bg-transparent border-none text-[14px] cursor-pointer font-bold leading-none"
            title="Eliminar elemento"
          >
            ×
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
          <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">X</label>
          <input
            type="number"
            value={element.x}
            onChange={(e) => updateElementWithHistory(element.id, { x: Number(e.target.value) })}
            className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
          />
        </div>
        <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
          <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">Y</label>
          <input
            type="number"
            value={element.y}
            onChange={(e) => updateElementWithHistory(element.id, { y: Number(e.target.value) })}
            className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
          />
        </div>
      </div>

      {element.type === 'text' && (
        <>
          <input
            type="text"
            value={localText}
            onChange={handleTextChange}
            onFocus={handleTextFocus}
            onKeyDown={handleTextKeyDown}
            className="bg-[#121416] border border-[#44474e] text-white rounded-[8px] p-2 w-full box-border text-[13.5px] mb-2 outline-none focus:border-[#03a9f4] transition-colors"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">W</label>
              <input
                type="number"
                value={(element as TextElement).tLen ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateElementWithHistory(element.id, { tLen: val === '' ? undefined : Number(val) });
                }}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
                placeholder="Auto"
              />
            </div>
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">H</label>
              <input
                type="number"
                value={(element as TextElement).size}
                onChange={(e) => updateElementWithHistory(element.id, { size: Number(e.target.value) })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
          </div>
          <select
            value={element.font}
            onChange={(e) => updateElementWithHistory(element.id, { font: e.target.value })}
            className="bg-[#121416] border border-[#44474e] text-white rounded-[8px] p-2 w-full box-border text-[13.5px] mb-2 outline-none focus:border-[#03a9f4] transition-colors"
          >
            {FONTS.map(f => <option key={f.val} value={f.val}>{f.name}</option>)}
          </select>
        </>
      )}

      {element.type === 'rect' && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">W</label>
              <input
                type="number"
                value={(element as RectElement).w}
                onChange={(e) => updateElementWithHistory(element.id, { w: Number(e.target.value) })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">H</label>
              <input
                type="number"
                value={(element as RectElement).h}
                onChange={(e) => updateElementWithHistory(element.id, { h: Number(e.target.value) })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10.5px] text-[#abb0b9] mb-1">
            <span>RADIO ESQUINA</span>
            <span className="bg-[#1a1d21] px-1 rounded">{(element as RectElement).rx || 0}px</span>
          </div>
          <input
            type="range" min="0" max="100" step="1"
            value={(element as RectElement).rx || 0}
            onChange={(e) => updateElementWithHistory(element.id, { rx: Number(e.target.value) })}
            className="w-full accent-[#03a9f4] h-1 mb-3 cursor-pointer"
          />

          <div className="flex justify-between items-center bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] mb-2">
            <span className="text-[10px] text-white font-bold">USAR GRADIENTE SOMBRA</span>
            <label className="relative inline-block w-[30px] h-[16px] flex-none cursor-pointer">
              <input
                type="checkbox"
                checked={element.isGrad || false}
                onChange={(e) => updateElementWithHistory(element.id, { isGrad: e.target.checked })}
                className="opacity-0 w-0 h-0 peer"
              />
              <span className="absolute inset-0 bg-[#5d6066] duration-300 rounded-[20px] peer-checked:bg-[#03a9f4] before:absolute before:content-[''] before:h-[10px] before:w-[10px] before:left-[3px] before:bottom-[3px] before:bg-white before:duration-300 before:rounded-full peer-checked:before:translate-x-[14px]" />
            </label>
          </div>
        </>
      )}

      {element.type === 'circle' && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">W</label>
              <input
                type="number"
                value={(element as CircleElement).r * 2}
                onChange={(e) => updateElementWithHistory(element.id, { r: Number(e.target.value) / 2 })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">H</label>
              <input
                type="number"
                value={(element as CircleElement).r * 2}
                onChange={(e) => updateElementWithHistory(element.id, { r: Number(e.target.value) / 2 })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
          </div>
        </>
      )}

      {element.type === 'triangle' && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">W</label>
              <input
                type="number"
                value={(element as TriangleElement).size}
                onChange={(e) => updateElementWithHistory(element.id, { size: Number(e.target.value) })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">H</label>
              <input
                type="number"
                value={(element as TriangleElement).size}
                onChange={(e) => updateElementWithHistory(element.id, { size: Number(e.target.value) })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
          </div>
        </>
      )}

      {element.type === 'oval' && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">W</label>
              <input
                type="number"
                value={(element as OvalElement).rx * 2}
                onChange={(e) => updateElementWithHistory(element.id, { rx: Number(e.target.value) / 2 })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
            <div className="bg-[#121416] rounded-[8px] px-2 py-1.5 border border-[#44474e] relative focus-within:border-[#03a9f4]">
              <label className="text-[9px] text-[#03a9f4] absolute -top-[6px] left-[10px] bg-[#2a2d31] px-1 font-bold">H</label>
              <input
                type="number"
                value={(element as OvalElement).ry * 2}
                onChange={(e) => updateElementWithHistory(element.id, { ry: Number(e.target.value) / 2 })}
                className="bg-transparent border-none text-white w-full text-[13.5px] outline-none"
              />
            </div>
          </div>
        </>
      )}

      {(['rect', 'circle', 'triangle', 'oval'].includes(element.type)) && (
        <div className="flex flex-col gap-2 mb-2 p-2 bg-[#121416] rounded-[8px] border border-[#44474e]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white font-bold uppercase">Usar Gradiente</span>
            <label className="relative inline-block w-[30px] h-[16px] flex-none cursor-pointer">
              <input
                type="checkbox"
                checked={element.isGrad || false}
                onChange={(e) => updateElementWithHistory(element.id, { isGrad: e.target.checked })}
                className="opacity-0 w-0 h-0 peer"
              />
              <span className="absolute inset-0 bg-[#5d6066] duration-300 rounded-[20px] peer-checked:bg-[#03a9f4] before:absolute before:content-[''] before:h-[10px] before:w-[10px] before:left-[3px] before:bottom-[3px] before:bg-white before:duration-300 before:rounded-full peer-checked:before:translate-x-[14px]" />
            </label>
          </div>

          {element.isGrad && (
            <div className="flex justify-between items-center mt-1 border-t border-[#44474e] pt-2">
              <span className="text-[9px] text-[#abb0b9] font-bold">DIRECCIÓN</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updateElementWithHistory(element.id, { gradType: 'h' })}
                  className={`text-[8px] px-2 py-0.5 rounded ${element.gradType === 'h' ? 'bg-[#03a9f4] text-white' : 'bg-[#2a2d31] text-gray-400'}`}
                >HORIZ.</button>
                <button
                  onClick={() => updateElementWithHistory(element.id, { gradType: 'v' })}
                  className={`text-[8px] px-2 py-0.5 rounded ${element.gradType === 'v' ? 'bg-[#03a9f4] text-white' : 'bg-[#2a2d31] text-gray-400'}`}
                >VERT.</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center text-[10.5px] text-[#abb0b9] mb-1 mt-1">
        <span>ESCALA</span>
        <span className="bg-[#1a1d21] px-1 rounded">{element.scaleX.toFixed(2)}x</span>
      </div>
      <input
        type="range" min="0.1" max="4" step="0.01"
        value={element.scaleX}
        onChange={(e) => updateElement(element.id, { scaleX: Number(e.target.value), scaleY: Number(e.target.value) })}
        onMouseDown={() => saveHistory()}
        className="w-full accent-[#03a9f4] h-1 mb-3 cursor-pointer"
      />

      <div className="flex justify-between items-center text-[10.5px] text-[#abb0b9] mb-1">
        <span>ROTACIÓN</span>
        <span className="bg-[#1a1d21] px-1 rounded">{element.rotate}°</span>
      </div>
      <input
        type="range" min="0" max="360" step="1"
        value={element.rotate}
        onChange={(e) => updateElement(element.id, { rotate: Number(e.target.value) })}
        onMouseDown={() => saveHistory()}
        className="w-full accent-[#03a9f4] h-1 mb-1 cursor-pointer"
      />
    </div>
  );
};
