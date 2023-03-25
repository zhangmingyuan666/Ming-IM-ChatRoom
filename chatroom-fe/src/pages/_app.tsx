import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import styled from 'styled-components'
import {Provider} from 'react-redux';
import store from '@/store';

// 在浏览器环境下进行监听
if(process.browser){
  import("../patching")
}

// fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=all")
//         .then((res) => {
//           return res.json();
//         })
//         .then(res => {
//           console.log(res);
//         });

export default function App({Component, pageProps}: AppProps) {
  return <Layout>
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </Layout>
}

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`