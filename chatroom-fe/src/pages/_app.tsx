import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import styled from 'styled-components'
import {Provider} from 'react-redux';
import store from '@/store';


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