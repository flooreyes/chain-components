import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const chainsDir = path.resolve('./public/chains');
  const files = fs.readdirSync(chainsDir).filter(file => file.endsWith('.svg'));

  res.status(200).json(files);
};

export default handler;
