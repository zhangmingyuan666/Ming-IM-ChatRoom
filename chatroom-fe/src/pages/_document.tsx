// _document.js
import Docuemnt, {Html, Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import {createCache, extractStyle, StyleProvider} from '@ant-design/cssinjs';


// function withLog(Comp) {
//     return props => {
//         console.log(props);
//         return <Comp {...props} />
//     }
// }

class MyDocument extends Docuemnt {
    static async getInitialProps(ctx: any) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    // 增强 APP 功能
                    enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
                    // 增强组件功能
                    // enhanceComponent: Component => withLog(Component)
                });

            const props = await Docuemnt.getInitialProps(ctx);

            return {
                ...props,
                styles: (
                    <>
                        {props.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument