import Head from 'next/head';
import '../src/styles/globals.css'
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <link rel="icon" href="/favicon.png" sizes="any" />
                <meta
                    name="description"
                    content="Blockchain icons resource for cracked frontend devs"
                />
                <meta
                    name="keywords"
                    content="React, Next, Icons, Icon Library, Crypto, Blockchains, Chains, Chain Configs"
                />
                <meta name="author" content="@0xflooreyes" />
                <title>chainicons by @0xflooreyes</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
