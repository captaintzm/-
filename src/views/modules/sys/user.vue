<template>
  <div class="mod-user">
    <div class="mod-user-table">
      <div class="mod-users userManagement">用户管理</div>
      <div class="mod-users" @click="$router.push({ path: '/sys-role' })">角色管理</div>
      <div class="mod-users" @click="$router.push({ path: '/modules-sys-sysorganization' })">组织机构</div>
    </div>
    <div class="mod-user-left">
      <div class="left-head">组织机构</div>
      <div class="sid-menu">
        <sub-menu
          :sub="item"
          :openKeys="openKeys"
          @getData="getData"
          v-for="item in menuList"
          :key="item.id"
        />
      </div>
    </div>
    <div class="mod-user-right">
      <div class="right-head">用户列表</div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="账户">
          <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="ID">
          <el-input v-model="userId" placeholder="ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select
            v-model="status"
            placeholder="请选择"
            class="el-selects"
            :style="{'width':'350px'}"
          >
            <el-option
              v-for="item in options"
              :key="item.status"
              :label="item.statusName"
              :value="item.status"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select
            v-model="style"
            placeholder="请选择"
            class="el-selects"
            :style="{'width':'350px'}"
          >
            <el-option
              v-for="item in option"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button
            v-if="isAuth('sys:user:delete')"
            type="danger"
            @click="deleteHandle()"
            :disabled="dataListSelections.length <= 0"
          >批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        height="250"
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;"
      >
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="userId" header-align="center" align="center" width="80" label="ID"></el-table-column>
        <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
        <el-table-column prop="mobile" header-align="center" align="center" label="手机号"></el-table-column>
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          :formatter="stateFormat"
          label="角色类型"
        ></el-table-column>
        <el-table-column prop="orgName" header-align="center" align="center" label="角色"></el-table-column>
        <el-table-column prop="locked" header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.locked == '0'" size="small" type="danger">正常</el-tag>
            <el-tag v-else size="small">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          width="180"
          label="创建时间"
        ></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="isAuth('sys:user:update')"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.userId)"
            >修改</el-button>
            <el-button
              v-if="isAuth('sys:user:delete')"
              type="text"
              size="small"
              @click="deleteHandle(scope.row.userId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :idser="ids"
    ></add-or-update>
  </div>
</template>

<script>
import VJstree from 'vue-jstree';
import AddOrUpdate from './user-add-or-update';
import { treeDataTranslate } from '@/utils';
const SubMenu = {
  name: 'SubMenu',
  props: ['sub', 'openKeys'],
  data () {
    return {
      activeOpen: []
    }
  },
  template: `
      <div class="item-menu sub2" :ref="'item_menu'+sub.id">
        <div :class="'sid-title ' + (openKeys == sub.id && 'sid-active')" >
            <i class="icon" v-if="sub.childList.length>0" type="cluster" @click.stop="onChange(sub)"></i>
            <i class="iconsr" v-if="sub.childList" type="cluster"></i>
             <span @click.stop="getData(sub)" class="sidconter">{{sub.name}}</span>
          </div>
          <ul class="sid-list" v-if="sub.childList" >
            <li class="" @click.stop="getData(item)" v-for="item in sub.childList" :key="item.id">
              <SubMenu  :sub="item" :openKeys="openKeys" @onChange="onChange" @getData="getData" />
          </li>
        </ul>
      </div>
    
    `,
  watch: {
    openKeys (newV) {
      this.$nextTick(() => {
        this.onChange({
          id: this.openKeys
        })
      })
    }
  },

  methods: {
    onChange (sub) {
      var divP = this.$refs['item_menu' + sub.id]
        if (divP) {
          if (!this.activeOpen.some(item => item === sub.id)) {
            this.activeOpen.push(sub.id)
            divP.style.height = 'auto';
            divP.style.overflow = 'initial';
          } else {
            this.activeOpen = this.activeOpen.filter(item => item !== sub.id)
            divP.style.height = '32px';
            divP.style.overflow = 'hidden';
          }
        }
    },
    getData (item) {
        this.$emit('getData', item)
      }
  }
}

export default {
  data () {
    return {
      rootSubmenuKeys: [],
      openKeys: '1',
      treeList: [],
      collapsed: false,

      option: [
        {
          siteName: '公司员工',
          id: 1
        },
        {
          siteName: '线上供应商',
          id: 2
        }
      ],
      coluse: false,
      style: '',
      userId: '',
      options: [
        {
          statusName: '禁用',
          status: 0
        },
        {
          statusName: '正常',
          status: 1
        }
      ],
      status: '',
      data: [
        {
          text: 'Same but with checkboxes',
          childList: [
            {
              text: 'initially selected'
            },
            {
              text: 'custom icon'
            },
            {
              text: 'initially open',
              childList: [
                {
                  text: 'Another node'
                }
              ]
            },
            {
              text: 'custom icon',
              icon: 'fa fa-warning icon-state-warning'
            },
            {
              text: 'disabled node'
            }
          ]
        }
      ],
      menuListTreeProps: {
        label: 'name',
        children: 'childList'
      },
      dataForm: {
        userName: ''
      },
      // ordername:"",
      menuList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      ids: ''
    }
  },
  components: {
    AddOrUpdate,
    'sub-menu': SubMenu
  },
  activated () {
    this.getTreelist()
    this.getDataList()
  },
  watch: {
    ids () {
      console.log(this.ids)
    }
  },
  // computed:{
  //   userName: {
  //     get () { return this.$store.state.user.name }
  //   }
  // },
  methods: {
    getData (item) {
       this.openKeys = item.id
        this.ids = item.id
        this.getDataList()
     },


    onMenuItem (id) {
        console.log('id', id)
      },
    itemClick (node) {
      console.log(node.model)
      this.ids = node.model.id
      this.getDataList()
    },
    stateFormat (row, column) {
      if (row.type == 1) {
        return '公司员工';
      } else if (row.type == 2) {
        return '线上供应商';
      } else if (row.type == 3) {
        return '线下商户';
      }
    },
    handleNodeClick (data) {
      console.log(data)
      this.ids = data.id
      // this.ordername=data.name
      console.log(this.ids)
      this.getDataList()
    },
    getTreelist () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/sys/sysorganization/treelist'),
        method: 'post',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.menuList = [data.orgTree]
          // this.menuList=this.menuList.push(data.orgTree)
          console.log(data.orgTree)
          console.log(this.menuList)
        } else {
          console.log(data.msg)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      console.log(this.dataForm)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/sys/user/list'),
        method: 'post',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.userName,
          orgId: this.ids,
          type: ''
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.userId
          })
      this.$confirm(
        `确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/ybt-supply/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.mod-user-table{
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  margin-bottom: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.349019607843137);
  .mod-users{
    height: 50px;
    text-align: center;
    width: 33%;
    background-color: rgba(215, 215, 215, 1);
    line-height: 50px;
    cursor:pointer;
  }
  .userManagement{
    background: #e6f7ff;
  }
}
.mod-user-left {
  float: left;
  width: 20%;
  border: 1px solid #d7d7d7;
  border-radius: 8px 8px 8px 8px;
  margin-right: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.349019607843137);
  min-height:500px;
  .left-head{
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 20px;
    padding-left: 6px;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
  }
}
.mod-user-right {
  // float: right;
  width: 70%;
  float: left;
  .right-head{
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 20px;
    padding-left: 6px;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    margin-bottom: 11px;
  }
}
.sid-menu {
  padding: 10px;
  line-height: 32px;
  max-height: 760px;
  overflow-y: auto;
  // width: 270px;
  font-size: 14px;
}
.sid-menu .sid-active {
  background: #e6f7ff;
  border-right: #1890ff solid 2px;
}
.sid-menu .sid-list {
  padding-left: 24px;
}
.sid-menu .sid-title,
.sid-menu .sid-sub {
  cursor: pointer;
}
.sid-menu .sub2 {
  height: 32px;
  overflow: hidden;
}
.sid-menu .sid-title:hover,
.sid-menu .sid-sub:hover {
  color: #1890ff;
}
.sid-menu .icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background-position: -100px 1px;
  // background: #1890ff;
  background-image:url("../../../../static/img/icons.png");
  color: #f90;
  padding-right: 6px;
  cursor: pointer;
}
.iconsr{
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background-position: -260px 1px;
  // background: #1890ff;
  background-image:url("../../../../static/img/icons.png");
  color: #f90;
  padding-right: 6px;
  cursor: pointer;
}
.sidconter{
  display: inline-block;
}
</style>
