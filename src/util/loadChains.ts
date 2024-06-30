import { ChainsElement } from './types';

const loadChains = async (): Promise<ChainsElement[]> => {
  const response = await fetch('/api/chains');
  const files = await response.json();

  const chains: ChainsElement[] = await Promise.all(
    files.map(async (file: string) => {
      const response = await fetch(`/chains/${file}`);
      const shape = await response.text();

      return {
        id: file.replace('.svg', ''),
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 456, y: 526 },
        shape,
      };
    })
  );

  return chains;
};

export default loadChains;
