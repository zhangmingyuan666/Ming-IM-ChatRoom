// import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import styled from 'styled-components'
import {Provider} from 'react-redux';
import {StyleProvider} from '@ant-design/cssinjs';
import store from '@/store';
import {wrapper} from "../wrapper";

// import '../public/antd.min.css';
import '../styles/globals.css';

// 在浏览器环境下进行监听
if (process.browser) {
  import("../patching")
}

// fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=all")
//         .then((res) => {
//           return res.json();
//         })
//         .then(res => {
//           console.log(res);
//         });

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function App({Component, ...rest}: AppProps) {
  const {store, props} = wrapper.useWrappedStore(rest);
  console.log(store.getState());

  return <Layout>
    <StyleProvider hashPriority="high">
      <Provider store={store}>
        <Component {...props.pageProps} />
      </Provider>
    </StyleProvider>
  </Layout>
}