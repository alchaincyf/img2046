'use client';

import dynamic from 'next/dynamic';

const SVGEditorClient = dynamic(() => import('./SVGEditorClient'), { ssr: false });

export default function SVGEditorPage() {
  return <SVGEditorClient />;
}
