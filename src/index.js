const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const { koaBody } = require('koa-body')
const { resolvePath, saveBase64ToFile } = require('./utils')
const CryptoJS = require('crypto-js')

const app = new Koa()
const router = new Router()

app.use(
  koaBody({
    multipart: true,
  }),
)

let publicKey = 'hello'

// 获取公钥接口
router.get('/public-key', async (ctx) => {
  ctx.body = publicKey
})

// 文件上传
router.post('/upload', async (ctx) => {
  const file = ctx.request.body.file
  const bytes = CryptoJS.AES.decrypt(file, publicKey)
  const decryptedFile = bytes.toString(CryptoJS.enc.Utf8)
  saveBase64ToFile(decryptedFile)
  ctx.body = '上传成功'
})

// 路由注册
app.use(router.routes())
app.use(router.allowedMethods())

app.use(serve(resolvePath('./static'), { extensions: ['html'] }))

// 服务端口
const port = 3000

// 启动服务
app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
})
