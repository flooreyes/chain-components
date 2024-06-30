import archiver from 'archiver';
import { join } from 'path';
import { readdir, createReadStream } from 'fs';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const directory = join(process.cwd(), 'public', 'chains');
    try {
        const files = await new Promise((resolve, reject) => {
            readdir(directory, (err, files) => {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=chainicons.zip');

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        files.forEach(file => {
            const filePath = join(directory, file);
            archive.append(createReadStream(filePath), { name: file });
        });

        await archive.finalize();
    } catch (error) {
        console.error('Error creating zip:', error);
        res.status(500).json({ error: 'Failed to create zip' });
    }
}
