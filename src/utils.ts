import type { IRenderer } from '@antv/g';
import { Renderer as GCanvasRenderer } from '@antv/g-canvas';
import { Renderer as GSVGRenderer } from '@antv/g-svg';

export type RenderMode = 'svg' | 'canvas';
const CanvasRenderer = new GCanvasRenderer();
const SVGRenderer = new GSVGRenderer();
export function getRenderer(mode: RenderMode) {
  return (mode === 'svg' ? SVGRenderer : CanvasRenderer) as unknown as IRenderer;
}
