'use client';

import Bootstrap from '@/components/Bootstrap';

export default function LoginLayout({ children }) {
  return (
    <>
      <Bootstrap />
      {children}
    </>
  );
} 