import React, { useState } from 'react';
import { LuClipboard, LuDownload, LuX } from 'react-icons/lu';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    imageUrl: string;
    svgCode: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    content,
    imageUrl,
    svgCode,
}) => {
    const [componentMode, setComponentMode] = useState(true);
    const [copyButtonText, setCopyButtonText] = useState('Copy Component Code');
    const [copyRawButtonText, setCopyRawButtonText] =
        useState('Copy Vector Code');

    if (!isOpen) return null;

    const formatSVGCode = (code: string): string => {
        const lines = code.trim().split('\n');
        let indentLevel = 0;
        return lines
            .map((line) => {
                if (line.match(/<\/\w/)) indentLevel--;
                const indent = '  '.repeat(indentLevel);
                if (line.match(/<\w[^>]*[^/]>.*$/)) indentLevel++;
                return indent + line.trim();
            })
            .join('\n');
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

    const highlightCode = (code: string): string => {
        return code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    const formattedSVGCode = highlightCode(formatSVGCode(svgCode));
    const formattedComponentCode = highlightCode(
        formatComponentCode(svgCode, content)
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                if (componentMode) {
                    setCopyButtonText('Copied!');
                    setTimeout(
                        () => setCopyButtonText('Copy Component Code'),
                        3000
                    );
                } else {
                    setCopyRawButtonText('Copied!');
                    setTimeout(
                        () => setCopyRawButtonText('Copy Vector Code'),
                        3000
                    );
                }
            },
        );
    };

    const downloadFile = (filename: string, content: string) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
    };

    const handleCopy = () => {
        const code = componentMode
            ? formatComponentCode(svgCode, content)
            : formatSVGCode(svgCode);
        copyToClipboard(code);
    };

    const handleDownload = () => {
        const parts = content.replace('.svg', '').split('-');
        const chainName = parts[0];
        const theme = parts[1];
        const componentName = `${chainName}${theme.charAt(0).toUpperCase() + theme.slice(1)}Icon`;
        const filename = componentMode
            ? `${componentName}.tsx`
            : `${content}.svg`;
        const code = componentMode
            ? formatComponentCode(svgCode, content)
            : svgCode;
        downloadFile(filename, code);
    };

    const getFilenamePreview = () => {
        const parts = content.replace('.svg', '').split('-');
        const chainName = parts[0];
        const theme = parts[1];
        const componentName = `${chainName}${theme.charAt(0).toUpperCase() + theme.slice(1)}Icon`;
        return componentMode ? `${componentName}.tsx` : `${content}.svg`;
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-white/20"
            onClick={onClose}
        >
            <div
                className="bg-gray-900/65 backdrop-blur-2xl rounded-3xl max-h-[40rem] shadow-lg relative max-w-5xl w-full px-8 py-8 flex flex-row space-x-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between flex-col w-full space-y-4">
                    <div className="flex flex-row h-8 w-full justify-between">
                        <div>
                            <button
                                className={` px-4 pb-2 ${
                                    componentMode
                                        ? 'text-white border-b'
                                        : 'text-gray-200'
                                }`}
                                onClick={() => setComponentMode(true)}
                            >
                                React Component
                            </button>
                            <button
                                className={` px-4 pb-2 ${
                                    !componentMode
                                        ? 'text-white border-b'
                                        : 'text-gray-200'
                                }`}
                                onClick={() => setComponentMode(false)}
                            >
                                Raw SVG
                            </button>
                        </div>
                        <div className="flex flex-row w-2/3 items-center mb-2">
                            <img
                                src={imageUrl}
                                alt={content}
                                className=" w-8 h-8 mr-4"
                            />
                            <p className=" text-gray-200 text-2xl font-thin">
                                {getFilenamePreview()}
                            </p>
                        </div>
                        <button
                            className="absolute top-4 right-4 text-gray-300 hover:text-rose-500"
                            onClick={onClose}
                        >
                            <LuX size={'1.5em'} />
                        </button>
                    </div>
                    <div className="w-full flex flex-row rounded-3xl overflow-hidden">
                        <div className="1/3 p-1">
                            <img
                                src={imageUrl}
                                alt={content}
                                className=" mb-4 pr-10 py-0 h-full p-2"
                            />
                        </div>
                        <div className="w-2/3 flex flex-col h-full">
                            <pre
                                className="bg-black/70 text-gray-200/70 font-mono overflow-auto text-xs font-thin whitespace-pre p-4 h-96 rounded-xl"
                                dangerouslySetInnerHTML={{
                                    __html: componentMode
                                        ? formattedComponentCode
                                        : formattedSVGCode,
                                }}
                            ></pre>
                        </div>
                    </div>
                    {componentMode ? (
                        <div className="flex flex-row w-full space-x-4">
                            <button
                                className="bg-white/20 text-white py-2 rounded-lg w-full hover:bg-white hover:text-black transition duration-100 flex items-center justify-center space-x-2"
                                onClick={handleCopy}
                            >
                                <LuClipboard />
                                <p>{copyButtonText}</p>
                            </button>
                            <button
                                className="bg-white/20 text-white py-2 rounded-lg w-full hover:bg-white hover:text-black transition duration-100 flex items-center justify-center space-x-2"
                                onClick={handleDownload}
                            >
                                <LuDownload />
                                <p>Download .TSX File</p>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-row w-full space-x-4">
                            <button
                                className="bg-white/20 text-white py-2 rounded-lg w-full hover:bg-white hover:text-black transition duration-100 flex items-center justify-center space-x-2"
                                onClick={handleCopy}
                            >
                                <LuClipboard />
                                <p>{copyRawButtonText}</p>
                            </button>
                            <button
                                className="bg-white/20 text-white py-2 rounded-lg w-full hover:bg-white hover:text-black transition duration-100 flex items-center justify-center space-x-2"
                                onClick={handleDownload}
                            >
                                <LuDownload />
                                <p>Download .SVG File</p>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
