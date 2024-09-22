'use client'

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import Layout from './components/Layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body>
          <Layout>{children}</Layout>
        </body>
      </ThemeProvider>
    </html>
  )
}
