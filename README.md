# axios-uniapp (typescript)

## 介绍

uniapp版axios封装，核心请求相关代码使用的是uni的request、upload和download方法，整体上用法和axios相同，适当做了一些代码缩减。
其中像get、post请求这些和axios用法一样，新增了upload上传和download下载的方法对应uni.upload、uni.download

## 安装

```bash
npm install --save-dev axios-uniapp
```

## 使用方法

### 拦截器

```js
import axios from 'axios-uniapp'
const defaultConfig = {
  baseURL: '/api'
}
const instance = axios.create(defaultConfig)
instance.interceptors.request.use(config => {
  config.headers.token = 'xxxx'
  return config
})
instance.interceptors.response.use(response => {
  return response
})
```

### 请求

```js
axios.get('/api/getUser', {
  params: {
    userId: 1
  },
  timeout: 1000 * 5
})

axios.post(
  '/api/addUser',
  {
    name: '小明',
    age: 10,
    sex: 1
  },
  {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 1000 * 5
  }
)

axios({
  url: '/api/getUser',
  method: 'get',
  params: {
    userId: 1
  },
  timeout: 1000 * 5
})
```

### 上传、下载

```js
axios.upload('/api/setUserAvatar', {
  // 上传相关配置项upload
  upload: {
    // files: 	Array	是（files和filePath选其一）	需要上传的文件列表。使用files时，filePath和name不生效。App、H5（ 2.6.15+）
    // fileType:	String	见平台差异说明 文件类型，image/video/audio仅支付宝小程序，且必填。
    // file:	File	否	要上传的文件对象。	仅H5（2.6.15+）支持
    // filePath:	String	是（files和filePath选其一）要上传文件资源的路径。
    // name:	String	是	文件对应的key,开发者在服务器端通过这个key可以获取到文件二进制内容
  },
  onUploadProgress(e) {
    // 上传进度
    console.log(e.progress)
  }
})

axios.download('/api/exportExcel', {
  // 下载相关配置项download
  download: {
    // filePath	string	否	指定文件下载后存储的路径 (本地路径)
  },
  onDownloadProgress(e) {
    // 下载进度
    console.log(e.progress)
  }
})

axios({
  url: '/api/setUserAvatar',
  method: 'upload',
  upload: {
    name: 'file',
    filePath: res.tempFiles[0].path,
    formData: {}
  },
  onUploadProgress(e) {
    console.log(e.progress)
  }
})
```
