<template>
<div class="">

  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">

        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>

    </div>
  </aside>
  </div>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  export default {
    data () {
      return {
        dynamicMenuRoutes: [],
        status: 0,
        id: 0
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
    },
    methods: {
      conslo () {

      },
      routers (names) {
        this.$router.push({ path: names})
      },
      // 路由操作
      routeHandle (route) {
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              paramslist: Object.keys(this.$route.query).length > 0 ? this.$route.query : '',
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || '',
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      }
    }
  }
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>

.marstr{
  position :absolute;
  right :0;
  top:0;
  background :#FBFCFF;

  /deep/ .el-menu-item{
    height :36px;
    line-height :36px;
    background :#FBFCFF;
  }

  /deep/ .el-menu-item.is-active{
    color:#ffffff;
  }

  /deep/ .el-menu-item:hover{
    color:#4486f4;
  }
  /deep/ .el-menu-item.is-active:hover{
    color:#ffffff;
  }
}
  /deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu,{
    background-color:#ffffff;
  }
  .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item,{
    color :#6C6B8F;
  }
  .sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title,{
    color :#6C6B8F;
  }
  .iconso{
    width: 16px;
    height: 16px;
    fill: currentColor;
    margin-right: 5px;
    text-align: center;
    font-size: 16px;
    color: inherit !important;
    vertical-align :top;
  }
  .site-sidebar__inner{
    background: #FFFFFF;
  }

  /deep/ .site-sidebar__menu.el-menu .el-menu-item.is-active,{
    color :#256EFD;
  }
  /deep/ .site-sidebar__menu.el-menu{
    background: #FFFFFF !important;
  }
  /deep/ .site-sidebar__menu.el-menu .el-menu,{
    background: #FFFFFF;

    /deep/ .el-submenu__title{
      color :#6C6B8F !important;
    }
  }

  /deep/ .el-submenu.is-opened{
    background :#FFFFFF !important;
    /deep/ .el-submenu__title{
      background :#FFFFFF !important;
    }
  }
  /deep/ .el-menu-item.is-active {
    background-color: #17B3A3 !important;
  }

  /deep/ .el-menu-item{
    margin :5px;
  }

  /deep/ .el-submenu__title{
    margin :5px;
  }

  /deep/ .el-submenu:hover{
    background-color: #F5F8FF !important;
  }

  /deep/ .el-submenu__title:hover{
    background-color: #17B3A3 !important;
  }

  /deep/ .el-submenu__title{
    background-color:#F5F8FF !important;
    color :#256EFD !important;
  }

  /deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.is-active{
    background-color :#17B3A3 !important;
    color:#ffffff;
  }

  /deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item:hover{
    background-color :#17B3A3 !important;
    color:#ffffff;
  }

  /deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu.is-active > .el-submenu__title,{
    color :#6C6B8F;
  }

  /deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title:hover,{
    background :#17B3A3;
  }

  /deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title{
    margin :5px;
  }
</style>
