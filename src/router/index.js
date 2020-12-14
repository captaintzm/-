/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import {
  isURL
} from '@/utils/validate'
import {
  clearLoginInfo
} from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
  path: '/404',
  component: _import('common/404'),
  name: '404',
  meta: {
    title: '404未找到'
  }
},
{
  path: '/login',
  component: _import('login/login'),
  name: 'login',
  meta: {
    title: '登录'
  }
}
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: {
    name: 'supplyProductConfig'
  },
  meta: {
    title: '主入口整体布局'
  },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {
      path: '/home',
      component: _import('home/home'),
      name: 'home',
      meta: {
        title: '首页'
      }
    },
    {
      path: '/orderList',
      component: _import('orderList/orderList'),
      name: 'orderList',
      meta: {
        title: '商品订单',
        isTab: true,
        keepAlive: false // 不需要缓存
        
      }
    },
    {
      path: '/distributionOrder',
      component: _import('orderList/distributionOrder'),
      name: 'distributionOrder',
      meta: {
        title: '分销订单',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },

    {
      path: '/orderDetail',
      component: _import('orderDetail/orderDetail'),
      name: 'orderDetail',
      meta: {
        title: '订单详情',
        isTab: true,
        keepAlive: true, // 不需要缓存
        query: ''
      }
    },
    {
      path: '/management',
      component: _import('management/management'),
      name: 'management',
      meta: {
        title: '分类管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/firstCate',
      component: _import('firstCate/firstCate'),
      name: 'firstCate',
      meta: {
        title: '一级分类管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/maintenance',
      component: _import('maintenance/maintenance'),
      name: 'maintenance',
      meta: {
        title: '项目维护',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/configuration',
      component: _import('configuration/configuration'),
      name: 'configuration',
      meta: {
        title: '项目配置',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/create',
      component: _import('configuration/create'),
      name: 'create',
      meta: {
        title: '新增项目配置', 
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/supplierConfig',
      component: _import('supplierConfig/supplierConfig'),
      name: 'supplierConfig',
      meta: {
        title: '供应商账号管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/addSupplier',
      component: _import('supplierConfig/addSupplier'),
      name: 'addSupplier',
      meta: {
        title: '新增供应商',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/productConfig',
      component: _import('supplierConfig/productConfig'),
      name: 'productConfig',
      meta: {
        title: '商品配置',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/commodityConfig',
      component: _import('commodityConfig/commodityConfig'),
      name: 'commodityConfig',
      meta: {
        title: '供应商商品管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/supplierPostConfig',
      component: _import('supplierPostConfig/supplierPostConfig'),
      name: 'supplierPostConfig',
      meta: {
        title: '供应商运费配置',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/supplyProductConfig',
      component: _import('supplyProductConfig/supplyProductConfig'),
      name: 'supplyProductConfig',
      meta: {
        title: '商品列表管理',
        // isTab:true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/addSupplierProduct',
      component: _import('addSupplierProduct/addSupplierProduct'),
      name: 'addSupplierProduct',
      meta: {
        title: '新增商品',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/supplierProductPriceLog',
      component: _import('supplierProductPriceLog/supplierProductPriceLog'),
      name: 'supplierProductPriceLog',
      meta: {
        title: '商品改价记录',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/productGrab',
      component: _import('productGrab/productGrab'),
      name: 'productGrab',
      meta: {
        title: '批量添加SKU',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    }
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({
        name: 'login'
      })
    }
    next()
  },
  beforeRouteUpdate (to, from, next) {
    next()
  } 
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({
    y: 0
  }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/ybt-supply/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({
      data
    }) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        let toObj = {}
        for (let key in to) {
          toObj[key] = to[key]
        }
        toObj.replace = true
        next(toObj)
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({
        name: 'login'
      })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      {
        path: '*',
        redirect: {
          name: '404'
        }
      }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  }
}

export default router
