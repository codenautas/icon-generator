import React, { useRef, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import type { RectElement, TextElement, CircleElement, TriangleElement, OvalElement } from '../types';

export const Canvas: React.FC = () => {
  const { canvasWidth, canvasHeight, colorBase, colorText, elements, updateElement, updateElementWithHistory, selectElement, selectedId } = useEditorStore();
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDragging(true);
    selectElement(id);
    
    if (svgRef.current) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const cur = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
      const el = elements[id];
      setOffset({ x: cur.x - el.x, y: cur.y - el.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !svgRef.current) return;
    
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cur = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    
    const newX = Math.round(cur.x - offset.x);
    const newY = Math.round(cur.y - offset.y);
    
    updateElement(selectedId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging && selectedId) {
      setIsDragging(false);
      const el = elements[selectedId];
      updateElementWithHistory(selectedId, { x: el.x, y: el.y });
    }
  };
  
  const handleWheel = (e: React.WheelEvent, id: string) => {
    e.stopPropagation();
    const el = elements[id];
    const delta = e.deltaY > 0 ? 5 : -5;
    const newRotate = (el.rotate + delta + 360) % 360;
    updateElementWithHistory(id, { rotate: newRotate });
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0b0c0d] relative overflow-hidden h-full" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onMouseMove={handleMouseMove}>
      <div className="transition-all duration-300 ease-out bg-[#1e2023] p-10 rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.7)] flex items-center justify-center">
        <svg
          id="mainSvg"
          ref={svgRef}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          style={{ width: canvasWidth, height: canvasHeight, maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', overflow: 'visible' }}
          className={`origin-center ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
        >
          <defs>
            <linearGradient id="gSH" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'black', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: 'black', stopOpacity: 0.2 }} />
            </linearGradient>
            <linearGradient id="gSV" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'black', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: 'black', stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>
          <rect width={canvasWidth} height={canvasHeight} fill={colorBase} rx="80" />
          
          {Object.values(elements).map(el => {
            if (!el.visible) return null;
            
            return (
              <g
                key={el.id}
                className="draggable"
                transform={`translate(${el.x}, ${el.y}) rotate(${el.rotate}) scale(${el.scaleX}, ${el.scaleY})`}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
                onWheel={(e) => handleWheel(e, el.id)}
              >
                {el.type === 'rect' ? (
                  <rect
                    x={-(el as RectElement).w / 2}
                    y={-(el as RectElement).h / 2}
                    width={(el as RectElement).w}
                    height={(el as RectElement).h}
                    fill={el.isGrad ? (el.gradType === 'v' ? 'url(#gSV)' : 'url(#gSH)') : 'rgba(0,0,0,0.3)'}
                    rx={(el as RectElement).rx || 0}
                  />
                ) : el.type === 'circle' ? (
                  <circle
                    r={(el as CircleElement).r}
                    fill={el.isGrad ? (el.gradType === 'v' ? 'url(#gSV)' : 'url(#gSH)') : 'rgba(0,0,0,0.3)'}
                  />
                ) : el.type === 'triangle' ? (
                   <polygon
                    points={`0,${-(el as TriangleElement).size/2} ${(el as TriangleElement).size/2},${(el as TriangleElement).size/2} ${-(el as TriangleElement).size/2},${(el as TriangleElement).size/2}`}
                    fill={el.isGrad ? (el.gradType === 'v' ? 'url(#gSV)' : 'url(#gSH)') : 'rgba(0,0,0,0.3)'}
                  />
                ) : el.type === 'oval' ? (
                  <ellipse
                    rx={(el as OvalElement).rx}
                    ry={(el as OvalElement).ry}
                    fill={el.isGrad ? (el.gradType === 'v' ? 'url(#gSV)' : 'url(#gSH)') : 'rgba(0,0,0,0.3)'}
                  />
                ) : (
                  <text
                    fontSize={(el as TextElement).size}
                    fontFamily={(el as TextElement).font}
                    fontWeight={(el as TextElement).weight}
                    fill={colorText}
                    textAnchor={(el as TextElement).align || 'middle'}
                    dominantBaseline={(el as TextElement).baseline || 'middle'}
                    fillOpacity={el.opacity ?? 1}
                    className="select-none"
                    {...((el as TextElement).tLen ? { textLength: (el as TextElement).tLen, lengthAdjust: 'spacingAndGlyphs' } : {})}
                  >
                    {(el as TextElement).text}
                  </text>
                )}
              </g>
            );
          })}

          <path 
            id="export-ignore-dimmer"
            fill="#0b0c0d" 
            fillOpacity="0.6" 
            fillRule="evenodd" 
            d={`M-2000,-2000 H2512 V2512 H-2000 Z M0,80 Q0,0 80,0 H${canvasWidth-80} Q${canvasWidth},0 ${canvasWidth},80 V${canvasHeight-80} Q${canvasWidth},${canvasHeight} ${canvasWidth-80},${canvasHeight} H80 Q0,${canvasHeight} 0,${canvasHeight-80} Z`}
            style={{ pointerEvents: 'none' }}
          />
        </svg>
      </div>
    </div>
  );
};
