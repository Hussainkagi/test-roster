
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const inter = Inter({ subsets: ['latin'] });
import store from '@/Global/store';
import { Provider } from 'react-redux';

export const metadata = {
  title: 'The Roaster',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
   
      <html lang='en'>
        <body className={inter.className}>{children}</body>
      </html>
       
  );
}
