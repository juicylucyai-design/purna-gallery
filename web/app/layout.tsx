import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { content } from '../lib/content';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://purnagallery.com'),
  title: content.meta.title,
  description: content.meta.description,
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    images: [{ url: content.hero.image.src, width: 1600, height: 1196, alt: content.hero.image.alt }],
    type: 'website',
    siteName: 'Purna Gallery',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0809',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400&family=Lora:ital,wght@0,400;0,500;1,400&family=Poppins:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
