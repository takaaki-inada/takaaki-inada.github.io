import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';
import { convertBVHToVRMAnimation } from '@/lib/bvh-converter/convertBVHToVRMAnimation';

interface FileBlob {
  blob: Buffer;
  name: string;
}

// https://github.com/mrdoob/three.js/blob/0e55a079cec600a17eb67c669c683d13daa9d79d/examples/js/loaders/BVHLoader.js
const loader = new BVHLoader();

export async function loadBVHAnimationUrl(url: string): Promise<string> {
  const bvh = await loader.loadAsync(url);
  const vrmaArrayBuffer = await convertBVHToVRMAnimation(bvh);
  const vrmaBuffer = Buffer.from(vrmaArrayBuffer);
  const ext = Date.now().toString();
  let vrmaBlob: FileBlob = { blob: vrmaBuffer, name: ext };
  // Blobオブジェクトを作成
  const blob = new Blob([vrmaBlob.blob], { type: 'application/octet-stream' });
  // BlobオブジェクトからURLを生成
  const vrmAnimationUrl = URL.createObjectURL(blob);

  return vrmAnimationUrl;
}
