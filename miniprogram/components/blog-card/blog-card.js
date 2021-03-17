// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object,
  },

  observers: {
    ['blog.createTime'](val) {
      if (val) {
        // console.log(val)
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: '',
    isShow:false,
  },

  lifetimes:{
    ready(){
      this.delShow()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event) {
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc,
      })
    },
    // 删除字样显示
    delShow(){
       const pages = getCurrentPages();
       const currentPage = pages[pages.length - 1];
       const url = `/${currentPage.route}`;
       if (url == '/pages/blog-comment/blog-comment') {
        this.setData({
          isShow :true
        })
       }
      //  console.log(url);
    },
    // 删除博客
    delBlog(){
      const db = wx.cloud.database()
      const myblogId = wx.getStorageSync('blogID')
      // console.log(myblogId);
      
      db.collection('blog').doc(myblogId).remove().then(res=>{
        // 返回blog页面，并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        // 取到上一个页面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      })
        

      
    },
  }
})