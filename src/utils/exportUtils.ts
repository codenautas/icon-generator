import JSZip from 'jszip';

export const exportEverything = async (
  svgElement: SVGSVGElement, 
  canvasWidth: number, 
  canvasHeight: number, 
  projectState: any, 
  namingOptions?: {
    operativo: string;
    onda: string;
    entorno?: string;
  }
) => {
  const isSquare = canvasWidth === canvasHeight;
  let zipName = 'proyecto_iconos';
  let baseFileName = 'logo';

  if (namingOptions && isSquare) {
    const { operativo, onda, entorno } = namingOptions;
    const suffix = entorno ? `_${entorno}` : '';
    zipName = `${operativo}-${onda}`;
    baseFileName = `${operativo}_${onda}-logo-dm${suffix}`;
  } else if (namingOptions && !isSquare) {
    // If rectangular and namingOptions provided, zip name still follows operative-onda
    zipName = `${namingOptions.operativo}-${namingOptions.onda}`;
    baseFileName = 'logo';
  }

  const zip = new JSZip();
  // We use the root of the ZIP if we want, or a folder. 
  // The user said "el zip debe tener el mismo nombre que el operativo-onda", 
  // usually implying the filename of the .zip file.
  const folder = zip; // Save files directly in zip root as per common icon pack structures

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
  folder.file(`${baseFileName}.svg`, svgString);

  // 2. Add Project Source (.icgen)
  const projectJson = JSON.stringify(projectState, null, 2);
  folder.file(`${baseFileName}.icgen`, projectJson);

  // 3. Prepare PNG(s)
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
            let name = '';
            if (isSquare) {
              if (namingOptions) {
                const { operativo, onda, entorno } = namingOptions;
                const suffix = entorno ? `_${entorno}` : '';
                name = `${operativo}_${onda}-logo-dm-${width}${suffix}.png`;

                // Add extra specific files requested by the user
                if (width === 192) {
                  const extraName = `login-${entorno ? entorno + '-' : ''}logo-icon.png`;
                  folder.file(extraName, blob);
                }
                if (width === 128) {
                  const extraName = `logo-${entorno ? entorno + '-' : ''}128.png`;
                  folder.file(extraName, blob);
                }
              } else {
                name = `${width}x${width}.png`;
              }
            } else {
              name = `${baseFileName}.png`;
            }
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
  a.download = `${zipName}.zip`;
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
