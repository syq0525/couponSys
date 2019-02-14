
const login = resolve => require(['../pages/Login.vue'], resolve)
const home = resolve => require(['../pages/Home.vue'], resolve)
const modifypassword = resolve => require(['../pages/Modifypassword.vue'], resolve)
// 系统管理
const system_rolelist = resolve => require(['../pages/system/Rolelist.vue'], resolve)
const system_userlist = resolve => require(['../pages/system/Userlist.vue'], resolve)
const system_resourcelist = resolve => require(['../pages/system/Resourcelist.vue'], resolve)
const system_configinfolist = resolve => require(['../pages/system/Configinfolist.vue'], resolve)

//基础数据管理
const basedata_filelist = resolve => require(['../pages/basedata/Filelist.vue'], resolve)
const basedata_archiveslist = resolve => require(['../pages/basedata/Archiveslist.vue'], resolve)

//优惠券管理
const coupon_couponbox = resolve => require(['../pages/coupon/Couponbox.vue'], resolve)
const coupon_addcoupon = resolve => require(['../pages/coupon/Addcoupon.vue'], resolve)
const coupon_addlecheng = resolve => require(['../pages/coupon/Addlecheng.vue'], resolve)
const coupon_addplatform = resolve => require(['../pages/coupon/Addplatform.vue'], resolve)
const coupon_grantbox = resolve => require(['../pages/coupon/Grantbox.vue'], resolve)
const coupon_addmarketing = resolve => require(['../pages/coupon/Addmarketing.vue'], resolve)
const coupon_addunderline = resolve => require(['../pages/coupon/Addunderline.vue'], resolve)
const coupon_verifybox = resolve => require(['../pages/coupon/Verifybox.vue'], resolve)
const coupon_addpackage = resolve => require(['../pages/coupon/Addpackage.vue'], resolve)


export default [
  {
    path: '/login',
    component: login,
    meta:{
      name: '',
      
    }
  },{
    path: '/',
    redirect: '/home',
    meta:{
      
    }
    
  },{
    path: '*',
    redirect: '/home',
    meta:{
      
    }
    
  },{
    path: '/home',
    component: home,
    meta:{
      name: '系统管理',
      icon:'el-icon-setting'
    },
    children: [
      // { 
      //   path: '/', 
      //   redirect:{path:'system/rolelist'},
      //   meta:{
          
      //   }
      // },
      { 
        path: 'system/rolelist', 
        component: system_rolelist, 
        meta:{
          name: '角色管理',
        }
        
      },{ 
        path: 'system/userlist', 
        component: system_userlist, 
        meta:{
          name: '用户管理',
        } 
      },{ 
        path: 'system/resourcelist', 
        component: system_resourcelist, 
        meta:{
          name: '资源管理',
        } 
      },{ 
        path: 'system/configinfolist', 
        component: system_configinfolist, 
        meta:{
          name: '后台参数配置',
        } 
      },
    ]
  },{
    path: '/home',
    component: home,
    meta:{
      name: '营销管理',
      icon:'fa fa-flag'
    },
    children: [
      { 
        path: 'coupon/couponbox', 
        component: coupon_couponbox, 
        meta:{
          name: '券方案',
          hidden:true
        }  
      },{ 
        path: 'coupon/addcoupon', 
        component: coupon_addcoupon, 
        meta:{
          name: '新增优惠券方案',
        }  
      },{ 
        path: 'coupon/addlecheng', 
        component: coupon_addlecheng, 
        meta:{
          name: '新增乐橙券方案',
        }  
      },{ 
        path: 'coupon/addplatform', 
        component: coupon_addplatform, 
        meta:{
          name: '新增外平台券方案',
        }  
      },{ 
        path: 'coupon/addpackage', 
        component: coupon_addpackage, 
        meta:{
          name: '新增券包方案',
        }  
      },{ 
        path: 'coupon/grantbox', 
        component: coupon_grantbox, 
        meta:{
          name: '发放券',
          hidden:true
        }  
      },{ 
        path: 'coupon/addmarketing', 
        component: coupon_addmarketing, 
        meta:{
          name: '新增推送活动',

        }  
      },{ 
        path: 'coupon/addunderline', 
        component: coupon_addunderline, 
        meta:{
          name: '新增线下制券',

        }  
      },{ 
        path: 'coupon/verifybox', 
        component: coupon_verifybox, 
        meta:{
          name: '核销券',
          hidden:true
        }  
      },
    ]
  },{
    path: '/home',
    component: home,
    meta:{
      name: '基础数据',
      icon:'fa fa-database'
    },
    children: [
      { 
        path: 'basedata/filelist', 
        component: basedata_filelist, 
        meta:{
          name: '文件管理',
        }
        
      },{ 
        path: 'basedata/archiveslist', 
        component: basedata_archiveslist, 
        meta:{
          name: '自定义档案',
        }
        
      }
    ]
  }
]
