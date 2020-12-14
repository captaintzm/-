<template>
  <div class="mod-role">
    <div class="mod-role-table">
      <div class="mod-roles" @click="$router.push({ path: '/sys-user' })">用户管理</div>
      <div class="mod-roles userManagement">角色管理</div>
      <div class="mod-roles" @click="$router.push({ path: '/modules-sys-sysorganization' })">组织机构</div>
    </div>
    <!-- <v-jstree :data="menuList" multiple allow-batch whole-row @item-click="itemClick" text-field-name="name" children-field-name="childList"/> -->
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!-- <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button @click="getDataList()">查询</el-button> -->
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">添加新角色</el-button>
        <!-- <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      height="580"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        width="180"
        label="角色类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1" size="small" type="danger">公司员工</el-tag>
          <el-tag v-else size="small">线上供应商</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="最后更新时间">
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
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
      AddOrUpdate
    },
    activated () {
      this.getDataList()
      // this.getTreelist()
    },
    methods: {
      itemClick (node) {
        console.log(node.model)
        this.ids = node.model.id
        this.getDataList()
      },
      // 获取数据列表
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
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/ybt-supply/sys/role/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'roleName': this.dataForm.roleName
          })
        }).then(({data}) => {
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ybt-supply/sys/role/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
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
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss" scoped>
.mod-role-table{
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  margin-bottom: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.349019607843137);
  .mod-roles{
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
</style>
