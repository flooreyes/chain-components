import React, { useState } from 'react';
import { BiExport } from 'react-icons/bi';

const Export = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    // const handleExport = async (ext) => {
    //     if (ext === 'svg') {
    //         try {
    //             const response = await fetch('/api/downloadZip');
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch the zip file');
    //             }

    //             const blob = await response.blob();
    //             const url = window.URL.createObjectURL(blob);
    //             const a = document.createElement('a');
    //             a.href = url;
    //             a.download = 'chainicons.zip';
    //             document.body.appendChild(a);
    //             a.click();
    //             a.remove();
    //         } catch (error) {
    //             console.error('Error exporting SVG:', error);
    //         }
    //     }
    // };

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
                            // onClick={() => handleExport('svg')}
                        >
                            SVG Files
                        </li>
                        <li
                            className="cursor-pointer py-2 items-center px-4 hover:bg-gray-100"
                            // onClick={() => handleExport('tsx')}
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
