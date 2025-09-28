const path = require('node:path')
const fs = require('node:fs')
const { mimeTypeToExtensionMap } = require('./enum')

function resolvePath(...paths) {
  return path.join(__dirname, '.', ...paths)
}

function saveBase64ToFile(base64String) {
  // 确保输出目录存在
  const uploadDir = path.join(__dirname, 'upload')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
    console.log(`目录已创建: ${uploadDir}`)
  }

  // 解码Base64字符串
  try {
    // 检查Base64字符串是否有效
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('无效的Base64字符串')
    }

    // 移除Base64前缀
    const base64Data = base64String.includes('base64,')
      ? base64String.split('base64,')[1]
      : base64String

    const buffer = Buffer.from(base64Data, 'base64')

    // 获取mimetype
    const mime = getFileTypeFromBase64(base64String)
    const suffix = mimeTypeToExtension(mime)

    // 生成文件名（如果未提供，则使用时间戳）
    const fileName = Date.now() + suffix
    const filePath = resolvePath('upload', fileName)

    // 写入文件
    fs.writeFileSync(filePath, buffer)
    console.log(`文件已保存到: ${filePath}`)
  } catch (error) {
    console.error('保存文件时出错:', error.message)
    throw error
  }
}

function getFileTypeFromBase64(base64String) {
  // 检查是否为标准的Base64前缀格式
  const matches = base64String.match(/^data:(.+?);base64,/)
  if (matches && matches[1]) {
    return matches[1] // 返回MIME类型（如 image/png）
  }
  return null // 如果不是标准前缀，返回null
}

function mimeTypeToExtension(mimeType) {
  return mimeTypeToExtensionMap[mimeType] || '.bin'
}

module.exports = {
  resolvePath,
  saveBase64ToFile,
  getFileTypeFromBase64,
  mimeTypeToExtension,
}
