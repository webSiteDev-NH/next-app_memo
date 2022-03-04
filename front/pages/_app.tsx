import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  /*
   Components that use recoil state need RecoilRoot to appear somewhere in the parent tree. A good place to put this is in your root component
  */
  // RecoilRootコンポーネント以下で reciol state が使用できる
  return (
    <RecoilRoot>
        <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
