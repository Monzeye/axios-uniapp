<template>
  <view class="content">
    <view class="text-area" @click="handleClick">
      <text class="title">{{ title }}</text>
    </view>
    <view>
      {{res1}}
    </view>
    <view>
      {{res2}}
    </view>
    <view>
      {{res3}}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import uniAxios from 'axios-uniapp'
const title = ref('Hello')
const defaultConfig = {
  baseURL: 'http://127.0.0.1'
  // baseURL: '/api'
  // baseURL: 'http://127.0.0.1:3080/'
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // }
}
const uniRequest = uniAxios.create(defaultConfig)
uniRequest.interceptors.request.use(config => {
  config.headers.token = 'xxxx'
  return config
})
uniRequest.interceptors.response.use(response => {
  console.log(response)
  return response
})
let cancelToken = uniAxios.CancelToken
let control = cancelToken.source()

const res1 = ref()
const res2 = ref()
const res3 = ref()
const res4 = ref()
const res5 = ref()

uniRequest({
  url: '/map.html',
  cancelToken: control.token,
  responseType: 'arraybuffer'
})
  .then(res => {
    console.log('1', res)
    res1.value = res.data
  })
  .catch(err => {
    console.dir(err)
  })
uniRequest
  .download('/index.html', {
    download: {
      filePath: '/'
    },
    onDownloadProgress(e) {
      console.log(e.progress)
    }
  })
  .then(res => {
    console.log('download', res)
    res2.value = res.data
  })
  .catch(err => {
    console.log('download', err)
  })
// request
//   .get('/map.html', {
//     cancelToken: control1.token
//   })
//   .then(res => {
//     console.log('request', res)
//   })
//   .catch(err => {
//     console.log('request', err)
//   })
function handleClick() {
  uni.chooseMessageFile({
    count: 1, //默认100
    type: 'all',
    success: function (res) {
      console.log(res.tempFiles[0].path)
      uniRequest({
        url: '/admin/file/upload',
        method: 'upload',
        upload: {
          name: 'file',
          filePath: res.tempFiles[0].path,
          formData: {
            e: 'bbbbbbbb'
          }
        },
        onUploadProgress(e) {
          console.log(e.progress)
        }
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      // uniRequest
      //   .upload('/admin/file/upload', {
      //     upload: {
      //       name: 'file',
      //       filePath: res.tempFiles[0].path,
      //       formData: {
      //         e: 'bbbbbbbb'
      //       }
      //     },
      //     cancelToken: control.token
      //   })
      //   .then(res => {
      //     console.log(res)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
      // control.cancel()
    }
  })
}

// request
//   .get('/山东地震地图瓦片.zip', {
//     params: {
//       _: Date.now()
//     },
//     cancelToken: control1.token,
//     onDownloadProgress: e => {
//       // console.log(e.progress)
//     }
//   })
//   .then(res => {
//     console.log(res)
//   })
// uniRequest({
//   url: 'http://localhost:80/map.html',
//   cancelToken: control.token
// }).then(res => {
//   console.log('2', res)
// })
// uniRequest({
//   url: 'http://localhost:80/map.html',
//   cancelToken: control.token
// }).then(res => {
//   console.log('3', res)
// })
// uniRequest({
//   url: 'http://localhost:80/map.html',
//   cancelToken: control.token
// }).then(res => {
//   console.log('4', res)
// })
// uniRequest({
//   url: 'http://localhost:80/map.html',
//   cancelToken: control.token
// }).then(res => {
//   console.log('5', res)
// })
// control.cancel()
// control1.cancel()
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
