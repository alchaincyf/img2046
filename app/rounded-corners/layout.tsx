import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '圆角处理工具 - 图像魔方',
  description: '在线图片圆角处理工具，支持图片裁剪和圆角程度调整。轻松为您的图片添加圆角效果，提升视觉效果。',
  keywords: '圆角处理, 图片圆角, 图片裁剪, 在线图片编辑',
  openGraph: {
    title: '圆角处理工具 - 图像魔方',
    description: '在线图片圆角处理工具，支持图片裁剪和圆角程度调整。轻松为您的图片添加圆角效果，提升视觉效果。',
    type: 'website',
  },
};

export default function RoundedCornersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
