'use client';

import React from 'react';
import MultiAdsPopup from './MultiAdsPopup';

// 为了向后兼容，我们将旧的AdPopup组件包装为新组件
// 这样依赖旧组件的代码不会出错，但实际上使用的是新组件
interface AdPopupProps {
  adLink: string;
}

const AdPopup: React.FC<AdPopupProps> = ({ adLink }) => {
  // 不再使用adLink参数，使用MultiAdsPopup中的配置
  return null; // 返回null，因为MultiAdsPopup已经在Layout中集成
};

export default AdPopup; 