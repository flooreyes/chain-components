import React, { useState } from 'react';
import { BiExport } from 'react-icons/bi';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Export = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

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

    const handleExport = async (ext: 'svg' | 'tsx') => {
        if (ext === 'svg') {
            try {
                const zip = new JSZip();
                const folder = zip.folder('chainiconsSVG');

                // Fetch the list of files in the /public/chains directory
                const response = await fetch('/api/getChains');
                const files: string[] = await response.json();

                // Add each file to the zip
                const promises = files.map(async (file) => {
                    const fileResponse = await fetch(`/chains/${file}`);
                    const fileData = await fileResponse.blob();
                    folder?.file(file, fileData);
                });

                await Promise.all(promises);

                // Generate the zip file and trigger download
                const content = await zip.generateAsync({ type: 'blob' });
                saveAs(content, 'chainicons.zip');
            } catch (error) {
                console.error('Error exporting SVG:', error);
            }
        } else if (ext === 'tsx') {
            try {
                let tsxContent = '';

                // Fetch the list of files in the /public/chains directory
                const response = await fetch('/api/getChains');
                const files: string[] = await response.json();

                // Process each file to create the formatted component code
                for (const file of files) {
                    const fileResponse = await fetch(`/chains/${file}`);
                    const svgCode = await fileResponse.text();
                    const formattedCode = formatComponentCode(svgCode, file);
                    tsxContent += formattedCode + '\n\n';
                }

                // Trigger download of the single .tsx file
                const element = document.createElement('a');
                const file = new Blob([tsxContent], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = 'chainicons.tsx';
                document.body.appendChild(element);
                element.click();
            } catch (error) {
                console.error('Error exporting TSX:', error);
            }
        }
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className=""
        >
            <div className={` ${isDropdownVisible ? 'rounded-t-none' : ''} relative flex items-center cursor-pointer drop-shadow-[0px_0px_8px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-sm py-3 px-4 rounded-lg w-40`}>
                <BiExport className='rotate-180' size={'1.5em'} style={{ opacity: 0.8 }} />
                <div className="ml-5 tracking-wide opacity-80">
                    Download
                </div>
            </div>
            {isDropdownVisible && (
                <div className="absolute right-0 bottom-12 w-40 rounded-md backdrop-blur-sm ring-1 ring-black ring-opacity-5 bg-white/70 rounded-b-none overflow-hidden">
                    <ul>
                        <li
                            className="cursor-pointer py-2 items-center px-4 hover:bg-gray-100"
                            onClick={() => handleExport('svg')}
                        >
                            SVG Files
                        </li>
                        <li
                            className="cursor-pointer py-2 items-center px-4 hover:bg-gray-100"
                            onClick={() => handleExport('tsx')}
                        >
                            TSX Files
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Export;
