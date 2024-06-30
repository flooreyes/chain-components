import { LuGithub, LuBook, LuX } from 'react-icons/lu';
import Export from './Export';
import { useState } from 'react';

const Menu = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(true);

    return (
        <>
            {isDropdownVisible && (
                <div className="absolute h-[40rem] w-[26.3rem] left-4  bottom-20 rounded-2xl pr-2 backdrop-blur-md ring-1 ring-black ring-opacity-5 bg-white/70 overflow-hidden">
                    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden p-4">
                        <button
                            className="absolute top-4 right-2 text-gray-500 hover:text-rose-600"
                            onClick={() => setDropdownVisible(false)}
                        >
                            <LuX size={'1.5em'} />
                        </button>
                        <h1 className="text-5xl font-thin mb-2">ChainIcons</h1>
                        <p className="mb-6 text-sm">
                            Blockchain icons resource for cracked frontend devs
                        </p>
                        <div className="mt-2 w-full bg-white/40 py-2 px-8 font-mono rounded mb-4">
                            npm install chainicons
                        </div>
                        <h2 className="my-4 text-2xl font-thin">Usage</h2>
                        <p className="mt-4 text-sm mb-2">
                            Import components from package and use freely in
                            pages & components:
                        </p>
                        <pre className="bg-gray-900/75 text-white p-4 rounded text-[.7rem]">
                            <code>
                                {`import { ArbitrumLightIcon } from 'chainicons';\n\nexport default function Page() {\n  return (\n    <ArbitrumLightIcon />\n  );\n}`}
                            </code>
                        </pre>
                        <p className="my-2 text-sm">
                            Style with Tailwind using <code>className</code>{' '}
                            prop:
                        </p>
                        <pre className="bg-gray-900/75 text-white p-4 rounded text-[.7rem]">
                            <code>
                                {`export default function Page() {\n  return (\n    <ArbitrumLightIcon className='h-8 w-8' />\n  );\n}`}
                            </code>
                        </pre>
                        <p className="my-2 text-sm">Make it a circle:</p>
                        <pre className="bg-gray-900/75 text-white p-4 rounded text-[.7rem]">
                            <code>
                                {`<BaseDarkIcon className='h-8 w-8 rounded-full'/>`}
                            </code>
                        </pre>
                        <p className="my-2 text-sm">
                            Pass props if you're not using Tailwind:
                        </p>
                        <pre className="bg-gray-900/75 text-white p-4 rounded text-[.7rem] overflow-hidden">
                            <code className="overflow-x-scroll">
                                {`export default function Page() {\n  return (\n    <ArbitrumLightIcon\n      width={500}\n      height={500}\n    />\n  );\n}`}
                            </code>
                        </pre>
                        <h2 className="my-4 text-2xl font-thin">
                            Download component library:
                        </h2>
                        <p className="text-sm mb-2">
                            Download or copy <code>chainicons.tsx</code> into
                            your React or Next.js app's desired directory.
                            Import components from the local directory and use
                            them freely in pages & components:
                        </p>
                        <pre className="bg-gray-900/75 text-white p-4 rounded text-[.7rem]">
                            <code>
                                {`import { ArbitrumLightIcon } from '@/chainicons.ts';\n\nexport default function Page() {\n  return (\n    <ArbitrumLightIcon className='h-8 w-8' />\n  );\n}`}
                            </code>
                        </pre>
                        <h2 className="my-4 text-2xl font-thin">
                            Download SVG Library:
                        </h2>
                        <p className="text-sm mb-2">
                            Download or copy <code>chainicons.tsx</code> into
                            your React or Next.js app's{' '}
                            <code>public/chainicons</code> directory. This is a
                            good resource for designers, or if you just use Next
                            Image tags:
                        </p>
                        <pre className="bg-gray-900/75 text-white p-4 rounded text-[.7rem]">
                            <code>
                                {`import ArbitrumLightIcon from 'public/images/chainicons/ArbitrumLightIcon';\n\nexport default function Page() {\n  return (\n    <Image\n      src={ArbitrumLightIcon}\n      width={500}\n      height={500}\n      alt="ArbitrumLightIcon"\n    />\n  );\n}`}
                            </code>
                        </pre>
                        <h2 className="my-4 text-2xl font-thin">
                            Copy in component code:
                        </h2>
                        <p className="text-sm mb-2">
                            Select any icon to copy the formatted react
                            component code, or download a single tsx file.
                            Example:
                        </p>
                        <pre className="bg-gray-900/75 text-white p-4 rounded text-[.7rem] overflow-hidden">
                            <code className="overflow-x-scroll">
                                {`export const BaseDarkIcon = (props) => {\n  return (\n    <svg viewBox="0 0 456 526" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>\n      <path d="M203.123 14.5656C218.593 5.63395 237.653 5.63395 253.123 14.5656L430.52 116.985C445.99 125.917 455.52 142.423 455.52 160.287V365.131C455.52 382.995 445.989 399.502 430.519 408.433L253.122 510.846C237.653 519.777 218.594 519.777 203.125 510.846L25.728 408.433C10.2573 399.502 0.726807 382.995 0.726807 365.131V160.287C0.726807 142.423 10.2568 125.917 25.7268 116.985L203.123 14.5656Z" fill="url(#paint0_linear_705_126)"/>\n      <path d="M227.843 421.694C315.815 421.694 387.123 350.513 387.123 262.694C387.123 174.875 315.815 103.694 227.843 103.694C144.388 103.694 75.9285 167.778 69.1233 249.326H279.652V276.063H69.1233C75.9285 357.611 144.388 421.694 227.843 421.694Z" fill="url(#paint1_radial_705_126)"/>\n      <path d="M227.843 421.694C315.815 421.694 387.123 350.513 387.123 262.694C387.123 174.875 315.815 103.694 227.843 103.694C144.388 103.694 75.9285 167.778 69.1233 249.326H279.652V276.063H69.1233C75.9285 357.611 144.388 421.694 227.843 421.694Z" fill="url(#paint2_radial_705_126)"/>\n      <defs>\n        <linearGradient id="paint0_linear_705_126" x1="326.886" y1="53.8995" x2="28.0167" y2="628.41" gradientUnits="userSpaceOnUse">\n          <stop stopColor="#0052FF"/>\n          <stop offset="1" stopColor="#003199"/>\n        </linearGradient>\n        <radialGradient id="paint1_radial_705_126" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(316.319 164.909) rotate(121.405) scale(300.86)">\n          <stop stopColor="white"/>\n          <stop offset="1" stopColor="white" stopOpacity="0.73"/>\n        </radialGradient>\n        <radialGradient id="paint2_radial_705_126" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(316.319 164.909) rotate(121.405) scale(300.86)">\n          <stop stopColor="white"/>\n          <stop offset="1" stopColor="white" stopOpacity="0.73"/>\n        </radialGradient>\n      </defs>\n    </svg>\n  );\n};`}
                            </code>
                        </pre>
                        <h2 className="my-4 text-2xl font-thin">
                            Copy in SVG code:
                        </h2>
                        <p className="text-sm mb-2">
                            Select any icon to copy or download the raw SVG
                            code.
                        </p>
                    </div>
                </div>
            )}
            <div className="flex flex-row space-x-2 fixed bottom-4 left-4">
                <a
                    href="https://github.com/flooreyes/chainicons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex px-4 py-6 justify-center rounded-lg items-center w-auto h-6 drop-shadow-[0px_0px_8px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-sm"
                >
                    <LuGithub size={'1.5em'} style={{ opacity: 0.8 }} />
                    <div className="ml-5 tracking-wide opacity-80">Github</div>
                </a>
                <div
                    onClick={() => setDropdownVisible(!isDropdownVisible)}
                    className="flex px-4 py-6 justify-center rounded-lg items-center w-auto h-6 drop-shadow-[0px_0px_8px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-sm cursor-pointer"
                >
                    <LuBook size={'1.5em'} style={{ opacity: 0.8 }} />
                    <div className="ml-5 tracking-wide opacity-80">Docs</div>
                </div>
                <Export />
            </div>
        </>
    );
};

export default Menu;
