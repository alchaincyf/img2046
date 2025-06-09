# AWS中国峰会推广组件使用说明

## 功能概述

AWS中国峰会推广组件是一个固定在网站右下角的推广卡片，用于宣传2025年6月19-20日在上海世博中心举办的AWS中国峰会。

## 主要特性

### 1. 智能展示逻辑
- **时间控制**：只在2025年6月18日之前展示
- **用户体验**：页面加载3秒后才显示，避免干扰用户初始体验
- **记忆功能**：用户关闭后不再显示（使用localStorage记录）

### 2. 交互功能
- **可展开/收起**：点击卡片可展开查看更多活动详情
- **关闭按钮**：用户可以永久关闭推广
- **小程序码点击**：点击小程序码直接跳转到报名页面

### 3. 活动信息展示
- **基本信息**：时间、地点、主题
- **亮点展示**：200+全球重磅嘉宾、30+行业技术分论坛等
- **报名引导**：微信扫码或直接点击跳转

### 4. 视觉设计
- **AWS品牌色**：使用AWS橙色渐变背景
- **动画效果**：流畅的进入/退出动画和悬浮效果
- **响应式设计**：适配不同屏幕尺寸

## 技术实现

### 组件位置
```
app/components/AWSMiniProgramPromo.tsx
```

### 集成方式
组件已集成到主布局文件 `app/components/Layout.tsx` 中，会在所有页面显示。

### 小程序码图片
- **路径**：`/public/aws.jpg`
- **当前状态**：使用SVG占位符
- **建议**：替换为真实的AWS峰会小程序码图片

### 跳转链接
- **小程序链接**：https://mini.awsapp.cn/l/pcWvkgtaUeVU
- **官网链接**：https://aws.amazon.com/cn/events/summits/shanghai/

## 配置说明

### 修改展示时间
在组件中修改 `endDate`：
```typescript
const endDate = new Date('2025-06-18'); // 修改为所需的结束日期
```

### 修改延迟显示时间
```typescript
const timer = setTimeout(() => {
  setIsVisible(true);
}, 3000); // 修改延迟时间（毫秒）
```

### 更换小程序码图片
1. 将真实的小程序码图片保存为 `/public/aws.jpg`
2. 确保图片尺寸适中（建议200x200像素）

### 修改跳转链接
```typescript
const handleMiniProgramClick = () => {
  window.open('https://mini.awsapp.cn/l/pcWvkgtaUeVU', '_blank');
};
```

## 样式定制

### 位置调整
```typescript
style={{
  position: 'fixed',
  bottom: '20px',    // 距离底部距离
  right: '20px',     // 距离右侧距离
  zIndex: 1000,      // 层级
}}
```

### 尺寸调整
```typescript
sx={{
  width: isExpanded ? '320px' : '280px', // 展开/收起时的宽度
  maxWidth: '90vw',                      // 最大宽度（响应式）
}}
```

### 颜色主题
```typescript
background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)', // AWS橙色渐变
```

## 注意事项

1. **图片替换**：请将占位符图片替换为真实的AWS峰会小程序码
2. **时间更新**：活动结束后记得更新结束时间或移除组件
3. **链接验证**：定期检查小程序链接是否有效
4. **性能影响**：组件使用了动画效果，在低性能设备上可能需要优化

## 移除组件

如需移除AWS推广组件：

1. 从 `app/components/Layout.tsx` 中删除导入和使用：
```typescript
// 删除这两行
import AWSMiniProgramPromo from './AWSMiniProgramPromo';
<AWSMiniProgramPromo />
```

2. 删除组件文件：
```bash
rm app/components/AWSMiniProgramPromo.tsx
```

3. 删除小程序码图片：
```bash
rm public/aws.jpg
``` 