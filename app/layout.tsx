import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rev 360 Nigeria Tax Portal',
  description: 'Federal Inland Revenue Service — Rev 360 Tax Management Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
