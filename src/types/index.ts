export type ElementType = 'rect' | 'circle' | 'triangle' | 'oval' | 'text' | 'image';

export interface BaseElement {
  id: string;
  name: string;
  type: ElementType;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  visible: boolean;
  opacity?: number;
  isGrad?: boolean;
  gradType?: 'h' | 'v';
}

export interface RectElement extends BaseElement {
  type: 'rect';
  w: number;
  h: number;
  rx?: number;
}

export interface CircleElement extends BaseElement {
  type: 'circle';
  r: number;
}

export interface TriangleElement extends BaseElement {
  type: 'triangle';
  size: number;
}

export interface OvalElement extends BaseElement {
  type: 'oval';
  rx: number;
  ry: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  size: number;
  weight: number | string;
  font: string;
  tLen?: number;
  align?: 'start' | 'middle' | 'end';
  baseline?: 'hanging' | 'middle' | 'alphabetic';
}

export type SvgElement = RectElement | CircleElement | TriangleElement | OvalElement | TextElement;

export interface ProjectState {
  canvasWidth: number;
  canvasHeight: number;
  colorBase: string;
  colorText: string;
  elements: Record<string, SvgElement>;
}
