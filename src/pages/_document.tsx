import * as React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import { AppType } from 'next/app';
import { roboto } from '@/theme/appTheme';
import createEmotionCache from '@/theme/createEmotionCache';
import { MyAppProps } from './_app';
import Script from 'next/script';
import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v13-pagesRouter'

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

export default function MyDocument(props: MyDocumentProps) {

  return (
    <Html lang="en" className={roboto.className} id='htmlId'>
      <Head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <DocumentHeadTags {...props} />
        {props.emotionStyleTags}
      </Head>
      <body id='body'>
        <Main />
        <NextScript />

        <Script src="/js/parallax.min.js" strategy="beforeInteractive" />
        <Script src="/js/jquery-2.1.3.min.js" strategy="beforeInteractive" />
        <Script src="/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      </body>
    </Html>
  );
}
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const emotionCache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(emotionCache);

  const finalProps = await documentGetInitialProps(ctx, {
    emotionCache,
    plugins: [
      {
        enhanceApp: (App) => (props) => <App emotionCache={emotionCache} {...props} />,
        resolveProps: async (initialProps) => {
          const emotionStyles = extractCriticalToChunks(initialProps.html);
          const emotionStyleTags = emotionStyles.styles.map((style) => {
            return (

              <style
                data-emotion={`${style.key} ${style.ids.join(' ')}`}
                key={style.key}
                dangerouslySetInnerHTML={{ __html: style.css }}
              />

            )
          });

          return {
            ...initialProps,
            styles: [
              ...(Array.isArray(initialProps.styles) ? initialProps.styles : []),
              ...emotionStyleTags,
            ],
          };
        },
      },
    ],
  });

  return finalProps;
};
// MyDocument.getInitialProps = async (ctx: DocumentContext) => {
//   const originalRenderPage = ctx.renderPage;

//   const cache = createEmotionCache();
//   const { extractCriticalToChunks } = createEmotionServer(cache);

//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>) =>
//         function EnhanceApp(props) {
//           return <App emotionCache={cache} {...props} />;
//         },
//     });

//   const initialProps = await Document.getInitialProps(ctx);
//   const emotionStyles = extractCriticalToChunks(initialProps.html);
//   const emotionStyleTags = emotionStyles.styles.map((style) => (
//     <style
//       data-emotion={`${style.key} ${style.ids.join(' ')}`}
//       key={style.key}
//       // eslint-disable-next-line react/no-danger
//       dangerouslySetInnerHTML={{ __html: style.css }}
//     />
//   ));

//   return {
//     ...initialProps,
//     emotionStyleTags,
//   };
// };

