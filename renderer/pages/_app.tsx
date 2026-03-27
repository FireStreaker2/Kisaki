import "./globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SettingsProvider } from "@/components/dashboard/settings-context";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
      </Head>
      <SettingsProvider>
        <main className={`${inter.className} h-screen w-screen`}>
          <Component {...pageProps} />
        </main>
      </SettingsProvider>
    </>
  );
}
