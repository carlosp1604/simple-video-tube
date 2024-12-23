import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html suppressHydrationWarning={ true }>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
