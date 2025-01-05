import type { IRenderer } from '@antv/g';

export const GITHUB_URL = 'https://github.com/typed-sigterm/cf-comparer';

export type RenderMode = 'svg' | 'canvas';
let cachedSVGRenderer: IRenderer | undefined;
export function getRenderer(mode: RenderMode): Promise<IRenderer | undefined> {
  if (mode === 'svg') {
    if (cachedSVGRenderer)
      return Promise.resolve(cachedSVGRenderer);
    return import('@/renderers/svg').then(
      m => cachedSVGRenderer = new m.Renderer() as unknown as IRenderer,
    );
  }
  return Promise.resolve(undefined);
}
