<template>
  <div class="firstCate">
    <span class="title">&nbsp;一级分类管理</span>
    <el-button size="mini" type="success" @click="newProjects = true,type = '1'">新增</el-button>
    <el-table
      :data="tableData"
      style="width: 80%;margin-top: 30px;"
      :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}"
    >
      <el-table-column prop="lableName" label="分类名称" align="center"></el-table-column>
      <el-table-column prop="id" label="一级分类ID" width="180" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0" style="color:#f56c6c;">禁用</span>
          <span v-else style="color:#67c23a;">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="" @click="info(scope.row)">修改</el-button>
          <el-button
            type="text"
            @click="enable(scope.row)"
          >{{scope.row.status != 0 ? '禁用' : '启用'}}</el-button>
          <el-button type="text" size="" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-common url="supplycatelable" @dataList = getDataList ref="page"></page-common>
    <el-dialog :title="type === '1' ? '新增一级分类' : '修改一级分类'" :visible.sync="newProjects" class="addDialog">
      <p>
        <span class="label">
          <i>*</i>分类名称
        </span>
        <el-input v-model="form.cat_name" autocomplete="off" style="width: 50%;"></el-input>
      </p>
      <p>
        <span class="label">
          <i>*</i>启用状态
        </span>
        <el-radio v-model="form.status" label="1">启用</el-radio>
        <el-radio v-model="form.status" label="0">禁用</el-radio>
      </p>
      <p></p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="addMainSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: {pageCommon},
  data () {
    return {
      newProjects: false,
      form: {
        cat_name: '',
        status: '1',
        cat_pid: '',
        type: 1
      },
      tableData: [],
      // type1新增 2修改
      type: '',
      id: ''
    }
  },
  watch: {
    newProjects (n, v) {
      if (!n) {
        this.form.cat_name = ''
        this.form.status = '1'
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    enable (row) {
      row.status = Number(row.status)
      this.$confirm(`确定${(!Number(row.status) ? '启' : '禁')}用当前一级分类吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax.firstEnable({id: row.id, status: Number(!row.status) }).then(res => {
          this.$message.success((!row.status ? '启' : '禁') + '用成功')
          row.status = !row.status
        })
      })
    },
    // 删除
    deleteRow (row) {
      this.$confirm(`确定删除当前一级分类吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax.deleteCate({type: 1, ids: row.id}).then(res => {
          this.$message.success('删除成功')
          this.$refs.page.resetList()
        })
      })
    },
    // 编辑
    info (row) {
      this.type = 2
      this.newProjects = true
      this.form.status = row.status + ''
      this.form.cat_name = row.lableName
      this.id = row.id
    },
    // 新增
    addMainSubmit () {
      if (!this.form.cat_name.trim()) return this.$message.error('请填写一级分类名称')
      let form = JSON.parse(JSON.stringify(this.form))
      if (this.type === 2) form.id = this.id
      this.$ajax[this.type == 1 ? 'addLevel' : 'updateCate'](form).then(res => {
        this.$message.success(`${this.type == 1 ? '新增' : '修改'}分类成功`)
        this.$refs.page.resetList()
        this.closeDialog()
      })
    },
    // 关闭弹窗
    closeDialog () {
      this.newProjects = false
    },
    // 获取数据
    getDataList (res) {
      this.tableData = res.page.list
    }
  }
}
</script>

<style lang="scss">
.firstCate {
  .title {
    display: inline-block;
    margin-right: 5px;
    font-size: 18px;
    border-left: 3px solid #17b3a3;
  }
  .dialog-footer {
    text-align: center;
  }
  .addDialog {

    .el-dialog__header {
      text-align: center;
      background-color: #93e395;
      .el-dialog__title {
        color: #fff;
        font-size: 20px;
        font-weight: 500;
      }
    }
    p {
      .label{
        display: inline-block;
        margin-right: 10px;
      }
      padding-left: 25%;
      margin-bottom: 20px;
        i {
          display: inline-block;
          margin-right: 5px;
          color: red;
        }
      }
  }
}
</style>
