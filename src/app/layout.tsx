import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BorlaHaze | Premium Trash Hailing Ghana',
  description: 'High-fidelity waste management infrastructure for Ghana. AI-powered classification and dynamic pricing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
