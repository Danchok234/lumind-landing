import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [
    {
      path: './Satoshi-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Satoshi-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Satoshi-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
