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
        <div className="col-span-6 mt-2 flex items-center gap-2 bg-[#121416] py-1 px-2 rounded-[12px] border border-[#44474e] focus-within:border-[#03a9f4]">
          <div className="text-[#03a9f4] text-[12px] font-mono font-bold pl-1">#</div>
          <input 
            type="text" 
            value={value.replace('#', '').toUpperCase()}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
              onChange(`#${val}`);
            }}
            className="bg-transparent border-none text-white text-[12px] w-full outline-none font-mono tracking-wider"
            placeholder="000000"
          />
          <div className="w-[1px] h-4 bg-[#333] mx-1" />
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
            <input 
              type="color" 
              value={value.length === 7 ? value : '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="absolute -inset-2 w-[150%] h-[150%] cursor-pointer border-none bg-transparent appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
