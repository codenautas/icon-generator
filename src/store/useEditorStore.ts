import { create } from 'zustand';
import type { ProjectState, SvgElement } from '../types';

interface EditorState extends ProjectState {
  past: ProjectState[];
  future: ProjectState[];
  lastSaveTime: number;
  selectedId: string | null;
  
  // Actions
  setColorBase: (color: string) => void;
  setColorText: (color: string) => void;
  setCanvasDimensions: (width: number, height: number) => void;
  updateElement: (id: string, updates: Partial<SvgElement>) => void;
  updateElementWithHistory: (id: string, updates: Partial<SvgElement>) => void;
  toggleVisibility: (id: string) => void;
  selectElement: (id: string | null) => void;
  addElement: (type: 'text' | 'rect' | 'circle' | 'triangle' | 'oval') => void;
  removeElement: (id: string) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  // Import/Export
  loadProject: (state: ProjectState) => void;
  resetProject: () => void;
}

const initialState: ProjectState = {
  canvasWidth: 512,
  canvasHeight: 512,
  colorBase: '#138EE5',
  colorText: '#FFFFFF',
  elements: {
    guardaEntorno: { 
      id: 'guardaEntorno', name: 'Guarda Modo', type: 'rect', 
      x: 256, y: 10, w: 200, h: 100, scaleX: 1, scaleY: 1, rotate: 0, 
      opacity: 0.3, visible: true, rx: 15, isGrad: false, gradType: 'h' 
    },
    entorno: { 
      id: 'entorno', name: 'Texto Modo', type: 'text', 
      text: 'TEST', x: 256, y: 33, size: 36, weight: 900, tLen: 120,
      font: "'Roboto', sans-serif", scaleX: 1, scaleY: 1, rotate: 0, visible: true 
    },
    operativo: { 
      id: 'operativo', name: 'Operativo', type: 'text', 
      text: 'REPSIC', x: 256, y: 230, size: 180, weight: 800, tLen: 450, 
      font: "'Roboto', sans-serif", scaleX: 1, scaleY: 1, rotate: 0, visible: true 
    },
    guardaSubtitulo: { 
      id: 'guardaSubtitulo', name: 'Guarda Subtítulo', type: 'rect', 
      x: 200, y: 347.5, w: 420, h: 115, scaleX: 1, scaleY: 1, rotate: 0, 
      visible: true, rx: 15, isGrad: true, gradType: 'h' 
    },
    subtitulo: { 
      id: 'subtitulo', name: 'Subtítulo', type: 'text', 
      text: 'PARADORES', x: 210, y: 355, size: 96, weight: 800, tLen: 350, 
      font: "'Roboto', sans-serif", scaleX: 1, scaleY: 1, rotate: 0, visible: true 
    },
    onda: { 
      id: 'onda', name: 'Onda', type: 'text', 
      text: '261', x: 488, y: 290, size: 72, weight: 800, opacity: 0.7, tLen: 150,
      font: "'Roboto', sans-serif", scaleX: 1, scaleY: 1, rotate: 90, 
      visible: true, align: 'start', baseline: 'hanging' 
    }
  },
};

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,
  past: [],
  future: [],
  lastSaveTime: 0,
  selectedId: 'operativo',

  saveHistory: () => set((state) => {
    // Evitar guardados ultra frecuentes (menos de 300ms) si el estado es una interacción continua
    const now = Date.now();
    if (now - state.lastSaveTime < 300) {
      return state;
    }

    const currentState: ProjectState = {
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      colorBase: state.colorBase,
      colorText: state.colorText,
      elements: JSON.parse(JSON.stringify(state.elements)),
    };
    
    // Solo guardar si hay un cambio real respecto al último estado en 'past'
    if (state.past.length > 0) {
      const last = state.past[state.past.length - 1];
      if (JSON.stringify(last) === JSON.stringify(currentState)) {
        return state;
      }
    }

    const newPast = [...state.past, currentState];
    if (newPast.length > 100) newPast.shift();
    return { past: newPast, future: [], lastSaveTime: now };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    
    const currentState: ProjectState = {
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      colorBase: state.colorBase,
      colorText: state.colorText,
      elements: JSON.parse(JSON.stringify(state.elements)),
    };

    return {
      ...previous,
      past: newPast,
      future: [currentState, ...state.future],
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    
    const currentState: ProjectState = {
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      colorBase: state.colorBase,
      colorText: state.colorText,
      elements: JSON.parse(JSON.stringify(state.elements)),
    };

    return {
      ...next,
      past: [...state.past, currentState],
      future: newFuture,
    };
  }),

  setColorBase: (color) => {
    get().saveHistory();
    set({ colorBase: color });
  },
  
  setColorText: (color) => {
    get().saveHistory();
    set({ colorText: color });
  },

  setCanvasDimensions: (width, height) => {
    get().saveHistory();
    set({ canvasWidth: width, canvasHeight: height });
  },

  // Direct update without stack push, useful during drag
  updateElement: (id, updates) => set((state) => ({
    elements: {
      ...state.elements,
      [id]: { ...state.elements[id], ...updates } as SvgElement
    }
  })),

  // Called ONCE when finishing drag, or on text input change
  updateElementWithHistory: (id, updates) => {
    get().saveHistory();
    get().updateElement(id, updates);
  },

  toggleVisibility: (id) => {
    get().saveHistory();
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: { ...state.elements[id], visible: !state.elements[id].visible } as SvgElement
      }
    }));
  },

  selectElement: (id) => set({ selectedId: id }),

  addElement: (type) => {
    get().saveHistory();
    const id = `el_${Date.now()}`;
    let newElement: SvgElement;
    if (type === 'text') {
      newElement = {
        id, name: 'New Text', type: 'text', text: 'TEXTO', x: 256, y: 256, size: 72, 
        font: "'Roboto', sans-serif", weight: 900, scaleX: 1, scaleY: 1, rotate: 0, visible: true
      };
    } else if (type === 'rect') {
      newElement = {
        id, name: 'New Rect', type: 'rect', w: 150, h: 150, x: 256, y: 256, 
        scaleX: 1, scaleY: 1, rotate: 0, visible: true, isGrad: false, gradType: 'h', rx: 15
      };
    } else if (type === 'triangle') {
      newElement = {
        id, name: 'New Triangle', type: 'triangle', size: 120, x: 256, y: 256, 
        scaleX: 1, scaleY: 1, rotate: 0, visible: true, isGrad: false, gradType: 'h'
      };
    } else if (type === 'oval') {
      newElement = {
        id, name: 'New Oval', type: 'oval', rx: 100, ry: 60, x: 256, y: 256, 
        scaleX: 1, scaleY: 1, rotate: 0, visible: true, isGrad: false, gradType: 'h'
      };
    } else {
      newElement = {
        id, name: 'New Circle', type: 'circle', r: 75, x: 256, y: 256, 
        scaleX: 1, scaleY: 1, rotate: 0, visible: true, isGrad: false, gradType: 'h'
      };
    }

    set((state) => ({
      elements: { ...state.elements, [id]: newElement },
      selectedId: id
    }));
  },

  removeElement: (id) => {
    get().saveHistory();
    set((state) => {
      const newElements = { ...state.elements };
      delete newElements[id];
      return {
        elements: newElements,
        selectedId: state.selectedId === id ? null : state.selectedId
      };
    });
  },

  loadProject: (projectState) => set({
    ...projectState,
    past: [],
    future: [],
    selectedId: null
  }),

  resetProject: () => set({
    ...initialState,
    past: [],
    future: [],
    selectedId: null
  })
}));
