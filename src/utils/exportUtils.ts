import JSZip from 'jszip';

export const exportEverything = async (
  svgElement: SVGSVGElement, 
  canvasWidth: number, 
  canvasHeight: number, 
  projectState: any, 
  fileName = 'proyecto_iconos'
) => {
  const zip = new JSZip();
  const folder = zip.folder(fileName) || zip;

  // 1. Prepare SVG Clone
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.style.cursor = '';
  clone.style.maxWidth = '';
  clone.style.maxHeight = '';
  const dimmer = clone.querySelector('#export-ignore-dimmer');
  if (dimmer) dimmer.remove();
  
  clone.setAttribute('width', canvasWidth.toString());
  clone.setAttribute('height', canvasHeight.toString());
  
  const svgString = new XMLSerializer().serializeToString(clone);
  
  // Add SVG to ZIP
  folder.file(`${fileName}.svg`, svgString);

  // 2. Add Project Source (.icgen)
  const projectJson = JSON.stringify(projectState, null, 2);
  folder.file(`${fileName}.icgen`, projectJson);

  // 3. Prepare PNG(s)
  const isSquare = canvasWidth === canvasHeight;
  const sizes = isSquare ? [32, 48, 64, 72, 128, 192, 512] : [{ w: canvasWidth, h: canvasHeight }];
  
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const pngPromises = sizes.map((size) => {
    return new Promise<void>((resolve) => {
      const width = typeof size === 'number' ? size : size.w;
      const height = typeof size === 'number' ? size : size.h;
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const name = isSquare ? `${width}x${width}.png` : `${fileName}.png`;
            folder.file(name, blob);
          }
          resolve();
        }, 'image/png');
      };
      img.src = url;
    });
  });

  await Promise.all(pngPromises);
  URL.revokeObjectURL(url);

  // 4. Generate and Download ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = zipUrl;
  a.download = `${fileName}.zip`;
  a.click();
  URL.revokeObjectURL(zipUrl);
};

// Deprecated functions kept for compatibility if needed, but we should remove them eventually
export const downloadProjectJson = (state: any) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "proyecto_iconos.icgen");
  dlAnchorElem.click();
};
