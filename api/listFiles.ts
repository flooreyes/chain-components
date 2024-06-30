import { readdir } from 'fs/promises';
import archiver from 'archiver';
import path from 'path';
import { createReadStream } from 'fs';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { directory } = req.query;
    const directoryPath = path.join(process.cwd(), 'public', directory);

    try {
        const files = await readdir(directoryPath);
        if (!files.length) {
            res.status(404).json({ error: 'No files found' });
            return;
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=chainicons.zip');

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            archive.append(createReadStream(filePath), { name: file });
        }

        await archive.finalize();
    } catch (error) {
        console.error('Error reading directory:', error);
        res.status(500).json({ error: 'Failed to read directory' });
    }
}
