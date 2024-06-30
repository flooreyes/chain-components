// scripts/generateComponents.ts
import fs from 'fs';
import path from 'path';

const svgDir = path.resolve(__dirname, '../public/chains');
const outputFilePath = path.resolve(__dirname, '../src/index.ts');

const formatComponentCode = (code: string, fileName: string): string => {
  const parts = fileName.replace('.svg', '').split('-');
  const chainName = parts[0];
  const theme = parts[1];
  const chainId = parts.length > 2 ? parts[2] : null;

  const componentName = `${chainName}${theme.charAt(0).toUpperCase() + theme.slice(1)}Icon`;
  const formattedCode = code
    .replace(
      /<svg([^>]*)>/,
      `<svg ${chainId ? `id="${chainId}" ` : ''}viewBox="0 0 456 526" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>`
    )
    .replace(/height="[^"]*"/g, '')
    .replace(/width="[^"]*"/g, '');

  return `export const ${componentName} = (props) => {
    return (
${formattedCode
    .split('\n')
    .map((line) => '        ' + line)
    .join('\n')}
    );
};`;
};

const generateIndexFile = async () => {
  const files = fs.readdirSync(svgDir);
  const exports: string[] = [];

  for (const file of files) {
    if (path.extname(file) === '.svg') {
      const svgContent = fs.readFileSync(path.join(svgDir, file), 'utf-8');
      const componentCode = formatComponentCode(svgContent, file);
      exports.push(componentCode);
    }
  }

  const indexFileContent = `${exports.join('\n\n')}`;
  fs.writeFileSync(outputFilePath, indexFileContent);
};

generateIndexFile().then(() => console.log('Components generated successfully!'));
