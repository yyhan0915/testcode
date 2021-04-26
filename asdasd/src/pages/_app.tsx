import { ThemeProvider } from '@material-ui/core';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import { useStore } from '../store/store';
import '../styles/global.css';
import materialTheme from '../styles/theme/materialTheme';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    const store = useStore(pageProps.initialReduxState);

    return (
        <>
            <Head>
                <title>Document Title</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=3.0, minimum-scale=1"
                />
            </Head>
            <ThemeProvider theme={materialTheme}>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </ThemeProvider>
        </>
    );
};

export default App;
