import { createReadStream } from 'fs';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import archiver from 'archiver';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const zip = archiver('zip', { zlib: { level: 9 } });
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=chainicons.zip');

        zip.on('error', (err) => {
            throw err;
        });

        const directoryPath = join(process.cwd(), 'public/chains');
        const files = readdirSync(directoryPath);

        files.forEach((file) => {
            const filePath = join(directoryPath, file);
            if (statSync(filePath).isFile()) {
                zip.file(filePath, { name: file });
            }
        });

        zip.pipe(res);
        await zip.finalize();
    } catch (err) {
        console.error('Error generating ZIP file:', err);
        res.status(500).json({ error: 'Failed to generate ZIP file' });
    }
}
