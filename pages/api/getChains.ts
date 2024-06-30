import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const directoryPath = path.join(process.cwd(), 'public', 'chains');
    try {
        const files = await fs.readdir(directoryPath);
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read directory' });
    }
}
