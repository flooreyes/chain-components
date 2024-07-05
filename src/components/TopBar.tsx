import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';


const TopBar: React.FC = () => {

    const router = useRouter()

    return (
        <div className="flex rounded-lg drop-shadow-[0px_0px_8px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-sm absolute mt-4 text-zinc-700 cursor-default left-1/2 -translate-x-1/2 flex-row space-x-2 p-1 ">
            <Link href='/' className={`${ router.pathname === '/' ? 'bg-sky-300/50  text-black ' : ''} p-1 rounded-md`}>
                Chains
            </Link>
            <Link href='https://tokenicons.io' className={`${ router.pathname === '/tokens' ? 'bg-sky-300/70  text-black ' : ''} p-1 rounded-md`}>
                Tokens
            </Link>
        </div>
    );
};

export default TopBar;
