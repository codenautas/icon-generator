import JSZip from 'jszip';

export const exportSvgToPng = (svgElement: SVGSVGElement, widths: number[], heights: number[], fileName = 'icon') => {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.style.cursor = '';
  clone.style.maxWidth = '';
  clone.style.maxHeight = '';
  
  // Remove dimmer if present
  const dimmer = clone.querySelector('#export-ignore-dimmer');
  if (dimmer) dimmer.remove();
  
  const originalWidth = Number(svgElement.getAttribute('viewBox')?.split(' ')[2] || 512);
  const originalHeight = Number(svgElement.getAttribute('viewBox')?.split(' ')[3] || 512);
  
  clone.setAttribute('width', originalWidth.toString());
  clone.setAttribute('height', originalHeight.toString());
  
  const svgString = new XMLSerializer().serializeToString(clone);
  
  widths.forEach((width, index) => {
    const height = heights[index];
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${fileName}_${width}x${height}.png`;
      a.click();
    };
    img.src = url;
  });
};

export const exportIconsZip = async (svgElement: SVGSVGElement, sizes: number[], fileName = 'iconos_repsic') => {
  const zip = new JSZip();
  const folder = zip.folder(fileName);
  
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  const dimmer = clone.querySelector('#export-ignore-dimmer');
  if (dimmer) dimmer.remove();
  
  const originalWidth = Number(svgElement.getAttribute('viewBox')?.split(' ')[2] || 512);
  const originalHeight = Number(svgElement.getAttribute('viewBox')?.split(' ')[3] || 512);
  clone.setAttribute('width', originalWidth.toString());
  clone.setAttribute('height', originalHeight.toString());
  
  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const promises = sizes.map((size) => {
    return new Promise<void>((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => {
          if (blob && folder) {
            folder.file(`${size}x${size}.png`, blob);
          }
          resolve();
        }, 'image/png');
      };
      img.src = url;
    });
  });

  await Promise.all(promises);
  URL.revokeObjectURL(url);

  const content = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = zipUrl;
  a.download = `${fileName}.zip`;
  a.click();
  URL.revokeObjectURL(zipUrl);
};

export const downloadProjectJson = (state: any) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "proyecto_iconos.json");
  dlAnchorElem.click();
};
