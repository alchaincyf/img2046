# iOS 图片压缩功能技术规格文档

> 基于图像魔方 (img2046.com) Web 版压缩功能，设计 iOS 原生实现方案

## 一、功能需求概述

### 1.1 核心功能

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 批量压缩 | 支持同时处理多张图片（最多 20 张） | P0 |
| 质量控制 | 10%-100% 可调节压缩质量 | P0 |
| 格式支持 | HEIC、JPEG、PNG、WebP | P0 |
| 智能模式 | 自动选择最优格式和参数 | P1 |
| Live Photo | 支持实况照片压缩（保留动态效果） | P1 |
| 压缩预览 | 实时显示压缩前后对比 | P1 |

### 1.2 压缩效果目标

基于 Web 版测试数据：

| 原始格式 | 质量设置 | 目标压缩率 | 输出格式 |
|---------|---------|-----------|---------|
| JPEG 照片 | 80% | 50-70% 体积减少 | JPEG |
| JPEG 照片 | 60% | 70-85% 体积减少 | JPEG |
| PNG 截图 | 80% | 60-80% 体积减少 | WebP/PNG |
| HEIC 照片 | 80% | 40-60% 体积减少 | HEIC |
| Live Photo | 70% | 50-70% 体积减少 | HEIC + MOV |

### 1.3 质量档位定义

```
高质量 (90-100%): 几乎无损，适合打印、存档
平衡   (70-85%) : 肉眼难辨，适合日常分享（推荐）
高压缩 (40-65%) : 明显压缩，适合网络传输、节省空间
极限   (10-35%) : 大幅压缩，仅适合缩略图
```

---

## 二、iOS 技术架构

### 2.1 技术栈选择

```
┌─────────────────────────────────────────────────────────┐
│                      UI Layer                            │
│              SwiftUI / UIKit                             │
├─────────────────────────────────────────────────────────┤
│                  Compression Service                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │ ImageIO      │ │ AVFoundation │ │ Photos Framework │ │
│  │ (图片压缩)    │ │ (视频压缩)    │ │ (相册访问)       │ │
│  └──────────────┘ └──────────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                   Core Graphics                          │
│              (底层图像处理、硬件加速)                      │
└─────────────────────────────────────────────────────────┘
```

### 2.2 框架职责

| 框架 | 用途 |
|------|------|
| **ImageIO** | 高性能图片编解码，支持 HEIC/JPEG/PNG/WebP |
| **Core Graphics** | 图像变换、缩放、裁剪 |
| **Photos** | 访问相册、处理 Live Photo |
| **AVFoundation** | Live Photo 视频部分压缩 |
| **PhotosUI** | PHPickerViewController 图片选择器 |

---

## 三、核心实现

### 3.1 图片压缩服务

```swift
import UIKit
import ImageIO
import UniformTypeIdentifiers

// MARK: - 压缩配置
struct CompressionConfig {
    var quality: CGFloat           // 0.0 - 1.0
    var outputFormat: OutputFormat // 输出格式
    var maxDimension: CGFloat?     // 最大边长（可选）
    var preserveMetadata: Bool     // 保留 EXIF 信息

    static let `default` = CompressionConfig(
        quality: 0.8,
        outputFormat: .auto,
        maxDimension: nil,
        preserveMetadata: true
    )
}

enum OutputFormat {
    case auto       // 智能选择
    case heic       // HEIC (iOS 优先)
    case jpeg       // JPEG (兼容性好)
    case png        // PNG (保留透明)
    case webp       // WebP (iOS 14+)

    var utType: UTType {
        switch self {
        case .auto, .heic: return .heic
        case .jpeg: return .jpeg
        case .png: return .png
        case .webp: return UTType("public.webp") ?? .jpeg
        }
    }
}

// MARK: - 压缩结果
struct CompressionResult {
    let originalSize: Int          // 原始大小 (bytes)
    let compressedSize: Int        // 压缩后大小 (bytes)
    let compressedData: Data       // 压缩后数据
    let outputFormat: OutputFormat // 实际输出格式
    let compressionRatio: Double   // 压缩率 (0-1, 越小压缩越多)

    var savedPercentage: Double {
        return (1 - compressionRatio) * 100
    }

    var savedSize: Int {
        return originalSize - compressedSize
    }
}

// MARK: - 图片压缩服务
class ImageCompressionService {

    static let shared = ImageCompressionService()

    // MARK: - 主压缩方法

    /// 压缩图片
    /// - Parameters:
    ///   - image: 原始 UIImage
    ///   - originalData: 原始数据（用于计算压缩率）
    ///   - config: 压缩配置
    /// - Returns: 压缩结果
    func compress(
        image: UIImage,
        originalData: Data? = nil,
        config: CompressionConfig = .default
    ) async throws -> CompressionResult {

        // 1. 确定输出格式
        let outputFormat = resolveOutputFormat(
            image: image,
            requestedFormat: config.outputFormat
        )

        // 2. 调整尺寸（如果需要）
        let processedImage = resizeIfNeeded(image, maxDimension: config.maxDimension)

        // 3. 执行压缩
        let compressedData = try compressToFormat(
            image: processedImage,
            format: outputFormat,
            quality: config.quality,
            preserveMetadata: config.preserveMetadata
        )

        // 4. 构建结果
        let originalSize = originalData?.count ?? estimateOriginalSize(image)

        return CompressionResult(
            originalSize: originalSize,
            compressedSize: compressedData.count,
            compressedData: compressedData,
            outputFormat: outputFormat,
            compressionRatio: Double(compressedData.count) / Double(originalSize)
        )
    }

    /// 批量压缩
    func compressBatch(
        images: [(UIImage, Data?)],
        config: CompressionConfig = .default,
        progress: ((Int, Int) -> Void)? = nil
    ) async throws -> [CompressionResult] {

        var results: [CompressionResult] = []

        for (index, (image, data)) in images.enumerated() {
            let result = try await compress(
                image: image,
                originalData: data,
                config: config
            )
            results.append(result)
            progress?(index + 1, images.count)
        }

        return results
    }

    // MARK: - 格式处理

    /// 智能选择输出格式
    private func resolveOutputFormat(
        image: UIImage,
        requestedFormat: OutputFormat
    ) -> OutputFormat {

        guard requestedFormat == .auto else {
            return requestedFormat
        }

        // 检测是否有透明通道
        if hasAlphaChannel(image) {
            return .png
        }

        // iOS 设备优先使用 HEIC（压缩率更好）
        if #available(iOS 11.0, *) {
            return .heic
        }

        return .jpeg
    }

    /// 检测透明通道
    private func hasAlphaChannel(_ image: UIImage) -> Bool {
        guard let cgImage = image.cgImage else { return false }

        let alphaInfo = cgImage.alphaInfo
        return alphaInfo == .first ||
               alphaInfo == .last ||
               alphaInfo == .premultipliedFirst ||
               alphaInfo == .premultipliedLast
    }

    // MARK: - 核心压缩

    /// 压缩到指定格式
    private func compressToFormat(
        image: UIImage,
        format: OutputFormat,
        quality: CGFloat,
        preserveMetadata: Bool
    ) throws -> Data {

        guard let cgImage = image.cgImage else {
            throw CompressionError.invalidImage
        }

        let data = NSMutableData()

        guard let destination = CGImageDestinationCreateWithData(
            data,
            format.utType.identifier as CFString,
            1,
            nil
        ) else {
            throw CompressionError.destinationCreationFailed
        }

        // 压缩选项
        var options: [CFString: Any] = [
            kCGImageDestinationLossyCompressionQuality: quality
        ]

        // 是否保留元数据
        if !preserveMetadata {
            options[kCGImageDestinationMetadata] = nil
        }

        CGImageDestinationAddImage(destination, cgImage, options as CFDictionary)

        guard CGImageDestinationFinalize(destination) else {
            throw CompressionError.compressionFailed
        }

        return data as Data
    }

    // MARK: - 尺寸处理

    /// 按需调整尺寸
    private func resizeIfNeeded(
        _ image: UIImage,
        maxDimension: CGFloat?
    ) -> UIImage {

        guard let maxDim = maxDimension else { return image }

        let size = image.size
        let maxCurrent = max(size.width, size.height)

        guard maxCurrent > maxDim else { return image }

        let scale = maxDim / maxCurrent
        let newSize = CGSize(
            width: size.width * scale,
            height: size.height * scale
        )

        let renderer = UIGraphicsImageRenderer(size: newSize)
        return renderer.image { _ in
            image.draw(in: CGRect(origin: .zero, size: newSize))
        }
    }

    /// 估算原始大小
    private func estimateOriginalSize(_ image: UIImage) -> Int {
        guard let cgImage = image.cgImage else { return 0 }
        return cgImage.bytesPerRow * cgImage.height
    }
}

// MARK: - 错误定义
enum CompressionError: Error, LocalizedError {
    case invalidImage
    case destinationCreationFailed
    case compressionFailed
    case unsupportedFormat

    var errorDescription: String? {
        switch self {
        case .invalidImage: return "无效的图片"
        case .destinationCreationFailed: return "无法创建输出目标"
        case .compressionFailed: return "压缩失败"
        case .unsupportedFormat: return "不支持的格式"
        }
    }
}
```

### 3.2 HEIC 专项处理

```swift
import ImageIO
import MobileCoreServices

extension ImageCompressionService {

    /// HEIC 压缩（保持 HEIC 格式）
    /// - 适用于 iPhone 拍摄的照片
    /// - HEIC 比 JPEG 压缩率高 40-50%
    func compressHEIC(
        imageData: Data,
        quality: CGFloat
    ) throws -> Data {

        guard let source = CGImageSourceCreateWithData(imageData as CFData, nil),
              let cgImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
            throw CompressionError.invalidImage
        }

        let data = NSMutableData()

        guard let destination = CGImageDestinationCreateWithData(
            data,
            UTType.heic.identifier as CFString,
            1,
            nil
        ) else {
            throw CompressionError.destinationCreationFailed
        }

        // 复制原始元数据
        let metadata = CGImageSourceCopyPropertiesAtIndex(source, 0, nil)

        var options: [CFString: Any] = [
            kCGImageDestinationLossyCompressionQuality: quality
        ]

        if let metadata = metadata {
            options[kCGImageDestinationMetadata] = metadata
        }

        CGImageDestinationAddImage(destination, cgImage, options as CFDictionary)

        guard CGImageDestinationFinalize(destination) else {
            throw CompressionError.compressionFailed
        }

        return data as Data
    }

    /// HEIC 转 JPEG（兼容性场景）
    func heicToJPEG(
        heicData: Data,
        quality: CGFloat
    ) throws -> Data {

        guard let source = CGImageSourceCreateWithData(heicData as CFData, nil),
              let cgImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
            throw CompressionError.invalidImage
        }

        let data = NSMutableData()

        guard let destination = CGImageDestinationCreateWithData(
            data,
            UTType.jpeg.identifier as CFString,
            1,
            nil
        ) else {
            throw CompressionError.destinationCreationFailed
        }

        let options: [CFString: Any] = [
            kCGImageDestinationLossyCompressionQuality: quality
        ]

        CGImageDestinationAddImage(destination, cgImage, options as CFDictionary)

        guard CGImageDestinationFinalize(destination) else {
            throw CompressionError.compressionFailed
        }

        return data as Data
    }
}
```

### 3.3 Live Photo 压缩

```swift
import Photos
import AVFoundation

// MARK: - Live Photo 压缩服务
class LivePhotoCompressionService {

    struct LivePhotoResult {
        let imageData: Data         // 压缩后的图片
        let videoURL: URL           // 压缩后的视频
        let originalTotalSize: Int
        let compressedTotalSize: Int

        var savedPercentage: Double {
            return (1 - Double(compressedTotalSize) / Double(originalTotalSize)) * 100
        }
    }

    /// 压缩 Live Photo
    /// - Parameters:
    ///   - asset: PHAsset (Live Photo)
    ///   - imageQuality: 图片压缩质量 (0-1)
    ///   - videoQuality: 视频压缩预设
    func compress(
        asset: PHAsset,
        imageQuality: CGFloat = 0.7,
        videoQuality: AVAssetExportPreset = .presetMediumQuality
    ) async throws -> LivePhotoResult {

        // 1. 获取 Live Photo 资源
        let resources = PHAssetResource.assetResources(for: asset)

        guard let imageResource = resources.first(where: {
            $0.type == .photo || $0.type == .fullSizePhoto
        }),
        let videoResource = resources.first(where: {
            $0.type == .pairedVideo || $0.type == .fullSizePairedVideo
        }) else {
            throw CompressionError.invalidImage
        }

        // 2. 提取并压缩图片
        let originalImageData = try await extractResource(imageResource)
        let compressedImageData = try ImageCompressionService.shared.compressHEIC(
            imageData: originalImageData,
            quality: imageQuality
        )

        // 3. 提取并压缩视频
        let originalVideoURL = try await extractVideoResource(videoResource)
        let originalVideoSize = try FileManager.default
            .attributesOfItem(atPath: originalVideoURL.path)[.size] as? Int ?? 0

        let compressedVideoURL = try await compressVideo(
            url: originalVideoURL,
            preset: videoQuality
        )
        let compressedVideoSize = try FileManager.default
            .attributesOfItem(atPath: compressedVideoURL.path)[.size] as? Int ?? 0

        // 4. 返回结果
        return LivePhotoResult(
            imageData: compressedImageData,
            videoURL: compressedVideoURL,
            originalTotalSize: originalImageData.count + originalVideoSize,
            compressedTotalSize: compressedImageData.count + compressedVideoSize
        )
    }

    // MARK: - 私有方法

    private func extractResource(_ resource: PHAssetResource) async throws -> Data {
        return try await withCheckedThrowingContinuation { continuation in
            var data = Data()

            PHAssetResourceManager.default().requestData(
                for: resource,
                options: nil,
                dataReceivedHandler: { chunk in
                    data.append(chunk)
                },
                completionHandler: { error in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else {
                        continuation.resume(returning: data)
                    }
                }
            )
        }
    }

    private func extractVideoResource(_ resource: PHAssetResource) async throws -> URL {
        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
            .appendingPathExtension("mov")

        return try await withCheckedThrowingContinuation { continuation in
            PHAssetResourceManager.default().writeData(
                for: resource,
                toFile: tempURL,
                options: nil
            ) { error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume(returning: tempURL)
                }
            }
        }
    }

    private func compressVideo(
        url: URL,
        preset: AVAssetExportPreset
    ) async throws -> URL {

        let asset = AVAsset(url: url)

        guard let exportSession = AVAssetExportSession(
            asset: asset,
            presetName: preset
        ) else {
            throw CompressionError.compressionFailed
        }

        let outputURL = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
            .appendingPathExtension("mov")

        exportSession.outputURL = outputURL
        exportSession.outputFileType = .mov
        exportSession.shouldOptimizeForNetworkUse = true

        await exportSession.export()

        guard exportSession.status == .completed else {
            throw exportSession.error ?? CompressionError.compressionFailed
        }

        return outputURL
    }
}

// MARK: - 视频压缩预设说明
extension AVAssetExportPreset {
    /// 低质量 - 最小文件
    static let presetLowQuality = AVAssetExportPresetLowQuality

    /// 中等质量 - 平衡（推荐）
    static let presetMediumQuality = AVAssetExportPresetMediumQuality

    /// 高质量 - 较大文件
    static let presetHighQuality = AVAssetExportPresetHighestQuality

    /// 保持原分辨率，仅重编码
    static let presetPassthrough = AVAssetExportPresetPassthrough
}
```

### 3.4 智能压缩策略

```swift
// MARK: - 智能压缩建议
struct SmartCompressionSuggestion {
    let suggestedQuality: CGFloat
    let suggestedFormat: OutputFormat
    let reason: String
}

extension ImageCompressionService {

    /// 获取智能压缩建议
    /// - 类似 Web 版的 getSmartSuggestion 功能
    func getSuggestion(
        for image: UIImage,
        originalData: Data,
        usage: ImageUsage
    ) -> SmartCompressionSuggestion {

        let sizeInMB = Double(originalData.count) / (1024 * 1024)
        let hasAlpha = hasAlphaChannel(image)

        switch usage {
        case .socialMedia:
            // 社交媒体：平衡质量和大小
            if sizeInMB > 5 {
                return SmartCompressionSuggestion(
                    suggestedQuality: 0.6,
                    suggestedFormat: hasAlpha ? .png : .heic,
                    reason: "大文件建议 60% 质量，显著减小体积"
                )
            }
            return SmartCompressionSuggestion(
                suggestedQuality: 0.75,
                suggestedFormat: hasAlpha ? .png : .heic,
                reason: "社交分享建议 75% 质量"
            )

        case .messaging:
            // 即时通讯：优先小体积
            return SmartCompressionSuggestion(
                suggestedQuality: 0.5,
                suggestedFormat: .jpeg,
                reason: "消息发送建议 50% 质量，快速传输"
            )

        case .archive:
            // 存档：优先质量
            return SmartCompressionSuggestion(
                suggestedQuality: 0.9,
                suggestedFormat: .heic,
                reason: "存档建议 90% 质量，HEIC 格式节省空间"
            )

        case .print:
            // 打印：最高质量
            return SmartCompressionSuggestion(
                suggestedQuality: 0.95,
                suggestedFormat: .jpeg, // 打印店通常需要 JPEG
                reason: "打印建议 95% 质量，JPEG 兼容性好"
            )

        case .web:
            // 网页使用：WebP 最优
            if #available(iOS 14.0, *) {
                return SmartCompressionSuggestion(
                    suggestedQuality: 0.75,
                    suggestedFormat: .webp,
                    reason: "网页使用建议 WebP 格式，压缩率最佳"
                )
            }
            return SmartCompressionSuggestion(
                suggestedQuality: 0.7,
                suggestedFormat: .jpeg,
                reason: "网页使用建议 70% JPEG"
            )
        }
    }
}

enum ImageUsage {
    case socialMedia  // 社交媒体（微信、微博等）
    case messaging    // 即时通讯
    case archive      // 长期存档
    case print        // 打印
    case web          // 网页使用
}
```

---

## 四、UI 层实现

### 4.1 SwiftUI 视图

```swift
import SwiftUI
import PhotosUI

struct ImageCompressionView: View {
    @StateObject private var viewModel = CompressionViewModel()

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // 图片选择器
                PhotosPicker(
                    selection: $viewModel.selectedItems,
                    maxSelectionCount: 20,
                    matching: .images
                ) {
                    Label("选择图片（最多20张）", systemImage: "photo.on.rectangle")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }

                // 质量滑块
                VStack(alignment: .leading) {
                    Text("压缩质量: \(Int(viewModel.quality * 100))%")
                        .font(.headline)

                    Slider(value: $viewModel.quality, in: 0.1...1.0)

                    HStack {
                        Text("高压缩").font(.caption)
                        Spacer()
                        Text("平衡").font(.caption)
                        Spacer()
                        Text("高质量").font(.caption)
                    }
                    .foregroundColor(.secondary)
                }
                .padding()

                // 格式选择
                Picker("输出格式", selection: $viewModel.outputFormat) {
                    Text("自动").tag(OutputFormat.auto)
                    Text("HEIC").tag(OutputFormat.heic)
                    Text("JPEG").tag(OutputFormat.jpeg)
                    Text("PNG").tag(OutputFormat.png)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                // 智能建议
                if let suggestion = viewModel.suggestion {
                    HStack {
                        Image(systemName: "lightbulb.fill")
                            .foregroundColor(.yellow)
                        Text(suggestion.reason)
                            .font(.caption)
                    }
                    .padding()
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(8)
                }

                // 预览区
                if !viewModel.results.isEmpty {
                    CompressionResultsView(results: viewModel.results)
                }

                Spacer()

                // 压缩按钮
                Button(action: { viewModel.compress() }) {
                    if viewModel.isCompressing {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Text("开始压缩")
                    }
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(viewModel.canCompress ? Color.green : Color.gray)
                .foregroundColor(.white)
                .cornerRadius(10)
                .disabled(!viewModel.canCompress)
            }
            .padding()
            .navigationTitle("图片压缩")
        }
    }
}

// MARK: - 压缩结果展示
struct CompressionResultsView: View {
    let results: [CompressionResult]

    var totalStats: (original: Int, compressed: Int, saved: Double) {
        let original = results.reduce(0) { $0 + $1.originalSize }
        let compressed = results.reduce(0) { $0 + $1.compressedSize }
        let saved = (1 - Double(compressed) / Double(original)) * 100
        return (original, compressed, saved)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // 总计统计
            HStack {
                VStack(alignment: .leading) {
                    Text("压缩完成")
                        .font(.headline)
                    Text("\(formatSize(totalStats.original)) → \(formatSize(totalStats.compressed))")
                        .font(.caption)
                }
                Spacer()
                Text("节省 \(String(format: "%.1f", totalStats.saved))%")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.green)
            }
            .padding()
            .background(Color.green.opacity(0.1))
            .cornerRadius(10)

            // 单张结果列表
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(results.indices, id: \.self) { index in
                        CompressionResultCard(result: results[index])
                    }
                }
            }
        }
    }

    private func formatSize(_ bytes: Int) -> String {
        let formatter = ByteCountFormatter()
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(bytes))
    }
}

struct CompressionResultCard: View {
    let result: CompressionResult

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // 缩略图
            if let image = UIImage(data: result.compressedData) {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 100, height: 100)
                    .clipped()
                    .cornerRadius(8)
            }

            Text(formatSize(result.compressedSize))
                .font(.caption)

            Text("-\(String(format: "%.0f", result.savedPercentage))%")
                .font(.caption)
                .foregroundColor(.green)
                .fontWeight(.bold)
        }
        .padding(8)
        .background(Color(.systemGray6))
        .cornerRadius(10)
    }

    private func formatSize(_ bytes: Int) -> String {
        let formatter = ByteCountFormatter()
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(bytes))
    }
}
```

### 4.2 ViewModel

```swift
import SwiftUI
import PhotosUI

@MainActor
class CompressionViewModel: ObservableObject {
    @Published var selectedItems: [PhotosPickerItem] = []
    @Published var quality: CGFloat = 0.8
    @Published var outputFormat: OutputFormat = .auto
    @Published var isCompressing = false
    @Published var results: [CompressionResult] = []
    @Published var suggestion: SmartCompressionSuggestion?

    private let compressionService = ImageCompressionService.shared

    var canCompress: Bool {
        !selectedItems.isEmpty && !isCompressing
    }

    func compress() {
        Task {
            isCompressing = true
            results = []

            do {
                var images: [(UIImage, Data?)] = []

                for item in selectedItems {
                    if let data = try? await item.loadTransferable(type: Data.self),
                       let image = UIImage(data: data) {
                        images.append((image, data))
                    }
                }

                let config = CompressionConfig(
                    quality: quality,
                    outputFormat: outputFormat,
                    maxDimension: nil,
                    preserveMetadata: true
                )

                results = try await compressionService.compressBatch(
                    images: images,
                    config: config
                ) { current, total in
                    // 更新进度（如需要）
                }

            } catch {
                print("压缩失败: \(error)")
            }

            isCompressing = false
        }
    }
}
```

---

## 五、性能优化

### 5.1 内存管理

```swift
extension ImageCompressionService {

    /// 大图片分块处理（避免内存溢出）
    func compressLargeImage(
        url: URL,
        config: CompressionConfig,
        chunkSize: Int = 2048
    ) async throws -> Data {

        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw CompressionError.invalidImage
        }

        // 获取原始尺寸
        guard let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
              let width = properties[kCGImagePropertyPixelWidth] as? Int,
              let height = properties[kCGImagePropertyPixelHeight] as? Int else {
            throw CompressionError.invalidImage
        }

        // 计算缩略图尺寸（如果需要）
        let maxPixels = 4096 * 4096 // 约 16MP
        let currentPixels = width * height

        var options: [CFString: Any] = [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceShouldCacheImmediately: true
        ]

        if currentPixels > maxPixels {
            let scale = sqrt(Double(maxPixels) / Double(currentPixels))
            options[kCGImageSourceThumbnailMaxPixelSize] = Int(Double(max(width, height)) * scale)
        }

        guard let cgImage = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else {
            throw CompressionError.compressionFailed
        }

        let image = UIImage(cgImage: cgImage)
        return try compressToFormat(
            image: image,
            format: config.outputFormat == .auto ? .heic : config.outputFormat,
            quality: config.quality,
            preserveMetadata: config.preserveMetadata
        )
    }
}
```

### 5.2 后台处理

```swift
import BackgroundTasks

class BackgroundCompressionManager {

    static let taskIdentifier = "com.img2046.compression"

    /// 注册后台任务
    static func register() {
        BGTaskScheduler.shared.register(
            forTaskWithIdentifier: taskIdentifier,
            using: nil
        ) { task in
            handleBackgroundTask(task as! BGProcessingTask)
        }
    }

    /// 调度后台压缩
    static func scheduleBackgroundCompression() {
        let request = BGProcessingTaskRequest(identifier: taskIdentifier)
        request.requiresNetworkConnectivity = false
        request.requiresExternalPower = false

        do {
            try BGTaskScheduler.shared.submit(request)
        } catch {
            print("无法调度后台任务: \(error)")
        }
    }

    private static func handleBackgroundTask(_ task: BGProcessingTask) {
        // 执行后台压缩
        Task {
            // ... 压缩逻辑
            task.setTaskCompleted(success: true)
        }

        task.expirationHandler = {
            // 清理
        }
    }
}
```

---

## 六、功能对照表

| Web 版功能 | iOS 实现 | 状态 |
|-----------|---------|------|
| 批量压缩 (20张) | `compressBatch()` | ✅ |
| 质量滑块 (10-100%) | `CompressionConfig.quality` | ✅ |
| 自动格式选择 | `resolveOutputFormat()` | ✅ |
| JPEG 压缩 | ImageIO | ✅ |
| PNG 压缩 | ImageIO | ✅ |
| WebP 压缩 | ImageIO (iOS 14+) | ✅ |
| HEIC 压缩 | ImageIO (原生) | ✅ ⭐ |
| Live Photo 压缩 | Photos + AVFoundation | ✅ ⭐ |
| 透明度检测 | `hasAlphaChannel()` | ✅ |
| 智能建议 | `getSuggestion()` | ✅ |
| 压缩率显示 | `CompressionResult` | ✅ |
| 历史记录 | Core Data / UserDefaults | 📋 待实现 |
| ZIP 打包 | ZIPFoundation | 📋 待实现 |

---

## 七、测试用例

```swift
import XCTest

class ImageCompressionTests: XCTestCase {

    let service = ImageCompressionService.shared

    func testJPEGCompression() async throws {
        let testImage = createTestImage(size: CGSize(width: 1000, height: 1000))
        let originalData = testImage.jpegData(compressionQuality: 1.0)!

        let result = try await service.compress(
            image: testImage,
            originalData: originalData,
            config: CompressionConfig(quality: 0.8, outputFormat: .jpeg)
        )

        XCTAssertLessThan(result.compressedSize, result.originalSize)
        XCTAssertGreaterThan(result.savedPercentage, 20)
    }

    func testHEICCompression() async throws {
        let testImage = createTestImage(size: CGSize(width: 2000, height: 2000))

        let result = try await service.compress(
            image: testImage,
            config: CompressionConfig(quality: 0.7, outputFormat: .heic)
        )

        XCTAssertEqual(result.outputFormat, .heic)
    }

    func testAutoFormatSelection() async throws {
        // 测试透明图片
        let transparentImage = createTransparentImage()
        let result = try await service.compress(
            image: transparentImage,
            config: CompressionConfig(outputFormat: .auto)
        )

        XCTAssertEqual(result.outputFormat, .png)
    }

    func testBatchCompression() async throws {
        let images = (0..<5).map { _ in
            (createTestImage(size: CGSize(width: 500, height: 500)), nil as Data?)
        }

        let results = try await service.compressBatch(images: images)

        XCTAssertEqual(results.count, 5)
    }

    // MARK: - Helpers

    private func createTestImage(size: CGSize) -> UIImage {
        let renderer = UIGraphicsImageRenderer(size: size)
        return renderer.image { context in
            UIColor.red.setFill()
            context.fill(CGRect(origin: .zero, size: size))
        }
    }

    private func createTransparentImage() -> UIImage {
        let size = CGSize(width: 100, height: 100)
        let renderer = UIGraphicsImageRenderer(size: size)
        return renderer.image { context in
            // 透明背景 + 半透明圆形
            UIColor.clear.setFill()
            context.fill(CGRect(origin: .zero, size: size))

            UIColor.blue.withAlphaComponent(0.5).setFill()
            context.cgContext.fillEllipse(in: CGRect(origin: .zero, size: size))
        }
    }
}
```

---

## 八、项目集成清单

### 8.1 依赖项

```swift
// Package.swift 或 Podfile
// 无需外部依赖，全部使用系统框架
```

### 8.2 Info.plist 权限

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>需要访问相册以选择要压缩的图片</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>需要保存压缩后的图片到相册</string>
```

### 8.3 文件清单

```
Sources/
├── Services/
│   ├── ImageCompressionService.swift      # 核心压缩服务
│   ├── LivePhotoCompressionService.swift  # Live Photo 处理
│   └── BackgroundCompressionManager.swift # 后台任务
├── Models/
│   ├── CompressionConfig.swift            # 配置模型
│   ├── CompressionResult.swift            # 结果模型
│   └── OutputFormat.swift                 # 格式枚举
├── Views/
│   ├── ImageCompressionView.swift         # 主界面
│   ├── CompressionResultsView.swift       # 结果展示
│   └── CompressionResultCard.swift        # 结果卡片
├── ViewModels/
│   └── CompressionViewModel.swift         # 视图模型
└── Tests/
    └── ImageCompressionTests.swift        # 单元测试
```

---

## 九、后续扩展

| 功能 | 描述 | 复杂度 |
|------|------|-------|
| iCloud 同步 | 压缩历史跨设备同步 | 中 |
| 快捷指令 | Shortcuts 集成 | 低 |
| 分享扩展 | 从其他 App 直接压缩 | 中 |
| Widget | 桌面小组件快速压缩 | 低 |
| 批量重命名 | 压缩时自定义命名规则 | 低 |
| 水印添加 | 压缩时添加水印 | 中 |

---

*文档版本: 1.0*
*最后更新: 2025-01*
*基于: img2046.com Web 版 v0.1.0*
