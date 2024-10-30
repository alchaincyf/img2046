'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function YouTubeSubscribe() {
  useEffect(() => {
    // 确保 window.gapi 存在后再渲染订阅按钮
    if (window.gapi) {
      window.gapi.ytsubscribe.go();
    }
  }, []);

  return (
    <div className="mt-auto py-4">
      <Script 
        src="https://apis.google.com/js/platform.js" 
        strategy="lazyOnload"
        onLoad={() => {
          if (window.gapi) {
            window.gapi.ytsubscribe.go();
          }
        }}
      />
      <div
        className="g-ytsubscribe"
        data-channelid="UCzbSuf_A_D8dARJ33HzoDew"
        data-layout="full"
        data-count="default"
      />
    </div>
  );
} 