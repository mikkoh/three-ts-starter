import {Texture, TextureLoader} from 'three';

export function textureLoader(
  url: string,
  onProgress?: (event: ProgressEvent<EventTarget>) => void
): Promise<Texture> {
  return new Promise((resolve, reject) => {
    new TextureLoader().load(url, resolve, onProgress, reject);
  });
}
