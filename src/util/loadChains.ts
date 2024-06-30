//@ts-nocheck
import { ChainsElement } from './types';

const loadChains = async (): Promise<ChainsElement[]> => {
    const modules = import.meta.glob('/src/chains/*.svg', { as: 'raw' });
    const chains: ChainsElement[] = [];

    for (const path in modules) {
        const shape = await modules[path]();
        const id = path.split('/').pop()?.replace('.svg', '');

        if (id) {
            chains.push({
                id,
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 456, y: 526 },
                shape,
            });
            // console.log(`Loaded chain: ${id}`);
        }
    }

    return chains;
};

export default loadChains;
