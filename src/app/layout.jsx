import './globals.css';

export const metadata = {
  title: 'SKINAA — Skin, in motion',
  description: 'A full-stack skincare homepage experience by SKINAA.'
};

export const viewport = { themeColor: '#f5f2ec' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
