import './globals.css';
import MotionPreferences from '../components/MotionPreferences';

export const metadata = {
  title: 'SKINAA — Skin, in motion',
  description: 'Explore science-led skincare, discover your skin essentials, and build a personalized daily routine with SKINAA.'
};

export const viewport = { themeColor: '#eef1e4' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><MotionPreferences />{children}</body>
    </html>
  );
}
