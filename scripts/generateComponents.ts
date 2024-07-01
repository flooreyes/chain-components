//@ts-nocheck
const fs = require('fs');
const path = require('path');

const chainsDir = path.join(__dirname, '../public/chains');
const outputDir = path.join(__dirname, '../generated');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to convert kebab-case to camelCase
const toCamelCase = (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// Function to camelCase SVG attributes
const camelCaseAttributes = (svgContent: string): string => {
    const regex = /(\s+)([a-z0-9]+-[a-z0-9]+)=/g;
    return svgContent.replace(regex, (_, space, attr) => {
        const camelCasedAttr = toCamelCase(attr);
        return `${space}${camelCasedAttr}=`;
    });
};

// Function to format the component code
const formatComponentCode = (code: string, fileName: string): string => {
    const parts = fileName.replace('.svg', '').split('-');
    const chainName = parts[0];
    const theme = parts[1];
    const chainId = parts.length > 2 ? parts[2] : null;

    const componentName = `${chainName}${theme.charAt(0).toUpperCase() + theme.slice(1)}Icon`;
    const camelCasedCode = camelCaseAttributes(code);

    const formattedCode = camelCasedCode
        .replace(
            /<svg([^>]*)>/,
            `<svg ${chainId ? `id="${chainId}" ` : ''} viewBox="0 0 456 526" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>`
        )
        .replace(/height="[^"]*"/g, '')
        .replace(/width="[^"]*"/g, '');

    return `import React from 'react';
export const ${componentName} = (props) => {
    return (
${formattedCode
        .split('\n')
        .map((line) => '        ' + line)
        .join('\n')}
    );
};
`;
};

// Read SVG files and generate components
const generateComponents = async () => {
    const files = fs.readdirSync(chainsDir);
    for (const file of files) {
        if (file.endsWith('.svg')) {
            const svgPath = path.join(chainsDir, file);
            const svgContent = fs.readFileSync(svgPath, 'utf8');
            const componentCode = formatComponentCode(svgContent, file);

            const outputFilePath = path.join(outputDir, file.replace('.svg', '.jsx'));
            fs.writeFileSync(outputFilePath, componentCode);
            console.log(`Generated: ${outputFilePath}`);
        }
    }

    // Generate index.js
    const indexContent = fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.jsx'))
        .map(file => `export * from './${file.replace('.jsx', '')}';`)
        .join('\n');

    fs.writeFileSync(path.join(outputDir, 'index.js'), indexContent);
    console.log('Generated: index.js');
};

generateComponents().catch(console.error);
