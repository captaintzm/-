<template>
  <div class="mod-sysor">
    <div class="mod-sysor-table">
      <div class="mod-sysors" @click="$router.push({ path: '/sys-user' })">用户管理</div>
      <div class="mod-sysors" @click="$router.push({ path: '/sys-role' })">角色管理</div>
      <div class="mod-sysors userManagement" @click="$router.push({ path: '/modules-sys-sysorganization' })">组织机构</div>
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
      <!-- <v-jstree :data="menuList" multiple allow-batch whole-row @item-click="itemClick" text-field-name="name" children-field-name="childList"><!-->
    </div>
    <div class="mod-user-right">
      <div class="right-head">组织机构列表</div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button
            v-if="isAuth('sys:user:save')"
            type="primary"
            @click="centerDialogVisible=true"
          >新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        height="250"
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;"
      >
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
        <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
        <el-table-column prop="name" header-align="center" align="center" width="200" label="名称"></el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.locked === 0" size="small" type="danger">正常</el-tag>
            <el-tag v-else size="small">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="isAuth('sys:user:update')"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.id,scope.row.name,scope.row.locked)"
            >修改</el-button>
            <!-- <el-button
              v-if="isAuth('sys:user:delete')"
              type="text"
              size="small"
              @click="deleteHandle(scope.row.userId)"
            >删除</el-button> -->
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
    <el-dialog :title="!idr ? '新增' : '修改'" :visible.sync="centerDialogVisible" width="500px">
      <el-form v-model="dux">
        <el-form-item label="机构名称：">
          <el-input :style="{'width':'200px'}" v-model="ordername"></el-input>
        </el-form-item>
        <el-form-item label="机构状态：">
          <el-radio v-model="locked" label="1">禁用</el-radio>
          <el-radio v-model="locked" label="0">正常</el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="increased(ids)">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
      locked: '0',
      centerDialogVisible: false,
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
        },
        {
          siteName: '线下商户',
          id: 3
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
      dux: {

      },
      status: '',
      idr: '',
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
      ordername: '',
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
    this.getDataList()
    this.getTreelist()
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
    increased (parentId) {
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/sys/sysorganization/save'),
        method: 'post',
        params: this.$http.adornParams({
          name: this.ordername,
          locked: this.locked,
          parentId,
          id: this.idr
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.$message.success('操作成功')
          this.centerDialogVisible = false
          this.getDataList()
        } else {
          console.log(data.msg)
          this.$message.error(data.msg)
        }
      })
    },
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
        url: this.$http.adornUrl('/ybt-supply/sys/sysorganization/list'),
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
    addOrUpdateHandle (id, name, locked) {
      console.log(id)
      this.centerDialogVisible = true
      this.idr = id
      this.ordername = name
      this.locked = String(locked)
      console.log(this.locked)
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
.mod-sysor-table{
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  margin-bottom: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.349019607843137);
  .mod-sysors{
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
/deep/ .el-dialog {
  // height: 300px;
  width: 500px;
  border-radius: 6px;
  overflow: hidden;
}

/deep/ .el-dialog__header {
  padding: 0;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  background: #f7f7f7;

  /deep/ .el-dialog__title {
    font-size: 14px;
    line-height: 34px;
    margin-left: 15px;
  }

  /deep/ .el-dialog__headerbtn {
    top: 5px;
  }
}

/deep/ .el-dialog__body {
  padding: 0;
  font-size: 14px;
  margin: 30px 0 40px;
}

/deep/ .el-dialog__footer {
  text-align: center;

  /deep/ .el-button--default {
    background: #f1f1f1;
    width: 87px;
    height: 32px;
    padding: 0;
  }

  /deep/ .el-button--primary {
    width: 87px;
    height: 32px;
    padding: 0;
  }
}
.mod-user-left {
  float: left;
  width: 18%;
  border: 1px solid #d7d7d7;
  border-radius: 4px 4px 4px 4px;
  margin-right: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.349019607843137);
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
