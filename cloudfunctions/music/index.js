// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

const axios = require('axios')

const BASE_URL = 'https://apis.imooc.com'
const ICODE = 'icode=B57B86C6F272CF6A'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })

  // 歌单列表
  app.router('playlist', async(ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  // 音乐列表
  app.router('musiclist', async(ctx, next) => {
      const res = await axios.get(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}&${ICODE}`)
      ctx.body = res.data
  })
  // 歌曲地址
  app.router('musicUrl', async(ctx, next) => {
    const res = await axios.get(`${BASE_URL}/song/url?id=${event.musicId}&${ICODE}`)
    ctx.body = res.data
  })
  // 歌词
  app.router('lyric', async(ctx, next) => {
    const res = await axios.get(`${BASE_URL}/lyric?id=${event.musicId}&${ICODE}`)
    ctx.body = res.data
  })

  return app.serve()
}