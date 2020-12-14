<template>
  <div class="supplierConfig">
    <div class="bodyheader">
      <span class="title">&nbsp;供应商账号管理</span>
      <el-button
        size="mini"
        type="success"
        @click="$router.push('/addSupplier');$route.meta.title='新增供应商'"
        style="margin-right: 50px;"
      >新增</el-button>
      <div class="searchTab">
        <span>
          供应商名称&nbsp;
          <el-input style="width: 200px;" size="mini" v-model="form.supplyName"></el-input>
        </span>
        <span>
          联系人&nbsp;
          <el-input style="width: 150px;" size="mini" v-model="form.contractName"></el-input>
        </span>
        <span>
          状态&nbsp;
          <el-select v-model="form.status" placeholder="请选择" size="mini">
            <el-option
              v-for="item in [{value:'',label:'全部'},{value: '0',label: '禁用'},{value: '1',label: '启用'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <el-button size="mini" type="primary" @click="resetSeach" style="margin-left: 20px;">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}">
      <el-table-column prop="supplyNo" label="编号" align="center"></el-table-column>
      <el-table-column prop="supplyName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="shortName" label="简称" align="center"></el-table-column>
      <el-table-column prop="contractName" label="联系人" align="center"></el-table-column>
      <el-table-column prop="contractTel" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="username" label="管理员账号" align="center"></el-table-column>
      <el-table-column prop="contractTel" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style="color: #67c23a;">启用</span>
          <span v-else style="color: #f56c6c;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="sass" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            @click="$router.push({path:'addSupplier',query:{id:scope.row.id}})"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            @click="enable(scope.row)"
          >{{scope.row.status != 0 ? '禁用' : '启用'}}</el-button>
          <el-button
            size="mini"
            type="text"
            @click="$router.push({path:'addSupplier',query:{id:scope.row.id,type:'watch'}});$route.meta.title='供应商详情'"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-common url="supplySupplierList" @dataList="getDataList" :pages="form" ref="page"></page-common>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: { pageCommon },
  data () {
    return {
      tableData: [],
      newSupplier: false,
      form: {
        supplyName: '',
        contractName: '',
        status: ''
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 禁用启用功能
    enable (row) {
      row.status = Number(row.status)
      this.$confirm(
        `${!Number(row.status) ? '确定启用当前供应商吗?' : '禁用当前供应商账号，该供应商推送到其他平台商品会同步下架。确定禁用当前供应商账号吗？'}`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$ajax
          .saveOrUpdateSupplierInfo({ id: row.id, status: Number(!row.status) })
          .then(res => {
            this.$message.success((!row.status ? '启' : '禁') + '用成功')
            row.status = !row.status
          })
      })
    },
    // 获取表格数据
    getDataList (res) {
      this.tableData = res.page.list
    },
    // 搜索功能
    resetSeach () {
      this.$refs.page.resetList()
    }
  }
}
</script>

<style lang="scss">
.supplierConfig {
  .title {
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 20px;
    font-size: 18px;
    border-left: 3px solid #17b3a3;
  }
  .el-input__inner {
    display: inline-block;
  }
  .searchTab {
    margin-bottom: 20px;
  }
  .addDialog {
    text-align: center;
    .el-dialog__header {
      background-color: #93e395;
      .el-dialog__title {
        color: #fff;
        font-size: 20px;
        font-weight: 500;
      }
    }
    p {
      margin-bottom: 15px;
      span {
        display: inline-block;
        margin-right: 5px;
        text-align: right;
        vertical-align: middle;
        width: 90px;
        i {
          display: inline-block;
          margin-right: 5px;
          color: red;
        }
      }
    }
  }
}
</style>
