import React from 'react';

interface PaletteProps {
  title: string;
  swatches: string[];
  value: string;
  onChange: (color: string) => void;
}

export const Palette: React.FC<PaletteProps> = ({ title, swatches, value, onChange }) => {
  return (
    <div className="bg-[#2a2d31] p-3 rounded-[16px] mb-2 border border-[#333]">
      <span className="text-[9.5px] text-[#abb0b9] mb-2 block font-bold uppercase">{title}</span>
      <div className="grid grid-cols-6 gap-1.5 items-center">
        {swatches.map((color, i) => (
          <div 
            key={i}
            onClick={() => onChange(color)}
            className="aspect-square rounded-[8px] cursor-pointer border border-white/10 transition-transform duration-200 hover:scale-110 hover:z-10 hover:border-white"
            style={{ backgroundColor: color }}
          />
        ))}
        <div className="col-span-6 mt-2 flex items-center gap-2.5 bg-[#121416] py-1.5 px-3 rounded-[12px]">
          <label className="text-[10.5px] text-[#888] flex-1 font-bold">COLOR PERSONALIZADO</label>
          <input 
            type="color" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-6 border-none bg-transparent cursor-pointer p-0"
          />
        </div>
      </div>
    </div>
  );
};
