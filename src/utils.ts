export const GITHUB_URL = 'https://github.com/typed-sigterm/cf-comparer';

export function downloadBlob(blob: Blob, filename: string) {
  const el = document.createElement('a');
  el.href = URL.createObjectURL(blob);
  el.download = filename;
  el.click();
  return el.href;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob)
        return reject(new Error('Failed to convert canvas to blob'));
      const url = downloadBlob(blob, filename);
      resolve();
      URL.revokeObjectURL(url);
    });
  });
}
