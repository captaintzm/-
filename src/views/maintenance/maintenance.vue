<template>
  <div class="maintenance">
    <span class="title">&nbsp;项目维护</span>
    <el-button size="mini" type="success" @click="newProjects = true" v-if="$qx('supplyprojectorganizationrule:save')">新增</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 30px;"
      :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}"
      :cell-class-name="changeCellStyle"
    >
      <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
      <el-table-column prop="projectId" label="项目ID" align="center"></el-table-column>
      <el-table-column prop="projectId" label="附件" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.accessoryUrl" target="_blank" v-if="scope.row.accessoryUrl"><img :src="scope.row.accessoryUrl" style="display:inline-block; width: 80px; height: 80px;"></a>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" label="所属机构" align="center"></el-table-column>
      <el-table-column prop="orgId" label="机构ID" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="80">
        <template slot-scope="scope">{{scope.row.status == 0 ? '禁用' : '启用'}}</template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="200" v-if="$qx('supplyprojectorganization:update') || $qx('supplyprojectorganization:enable')" >
        <template slot-scope="scope">
          <el-button type="text" size @click="info(scope.row)" v-if="$qx('supplyprojectorganization:update')">修改</el-button>
          <el-button type="text" @click="enable(scope.row)" v-if="$qx('supplyprojectorganization:enable')">{{scope.row.status != 0 ? '禁用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <page-common url="list" @dataList="getDataList" ref="page"></page-common>

    <el-dialog :title="!updateFlag ? '添加项目' : '修改项目'" :visible.sync="newProjects" class="addDialog">
      <el-form :inline="true" :model="form" label-width="110px" style="width:100%">
       <el-form-item label="项目名称" required class="w500">
        <el-input v-model="form.projectName" autocomplete="off" style="width:300px" ></el-input>
        </el-form-item>
      <el-form-item label="所属机构" required  class="w500">
        <el-input v-model="form.orgName" autocomplete="off" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="上传附件"  class="w500">
        <el-upload
          style="display: inline-block;"
          class="avatar-uploader"
          :action="$ajax.upload"
          :show-file-list="false"
          :beforeUpload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :headers="upDataToken"
        >
          <img v-if="form.accessoryUrl" :src="form.accessoryUrl" class="avatar" style="width: 178px; height: 178px;" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
        <el-form-item label="绑定机构ID"  class="w500">
            <el-input v-model="form.saasOrgId" autocomplete="off" style="width:300px" ></el-input>
        </el-form-item>
          <!-- <el-form-item label="绑定商城ID"  class="w500">
            <el-input v-model="form.siteId" autocomplete="off" style="width:300px" ></el-input>
        </el-form-item> -->
         <el-form-item label="公钥"  class="w500">
            <el-input v-model="form.publicKey" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>
          <el-form-item label="备注"  class="w500">
            <el-input v-model="form.remarks" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newProjects = false">取 消</el-button>
        <el-button type="primary" @click="addMainSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: { pageCommon },
  data () {
    return {
      tableData: [],
      form: {
        projectName: '',
        orgName: '',
        remarks: '',
        accessoryUrl: '',
        saasOrgId: '',
        // siteId: '',
        publicKey: ''
      },
      formRule: {
        projectName: '请填写项目名称',
        orgName: '请填写所属机构'
      },
      newProjects: false,
      updateFlag: false,
      id: '',
      page: 1,
      limit: 10,
      total: 0,
      upDataToken: {
        token: sessionStorage.getItem('token')
      }
    }
  },
  mounted () {},
  watch: {
    newProjects (n, o) {
      if (!n) {
        this.updateFlag = false
        this.$initObj(this.form)
      }
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 8
      if (!isLt2M) {
        this.$message({
          message: '上传图片大小不能超过 8MB!',
          type: 'error'
        })
      }
      return isLt2M
    },
    handleAvatarSuccess (res, file) {
      this.form.accessoryUrl = res.url
    },
    changeCellStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5) {
        let str = row.status == 0 ? 'red' : 'green'
        return str
      }
    },
    enable (row) {
      row.status = Number(row.status)
      this.$confirm(`确定${!row.status ? '启' : '禁'}用当前项目吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax
          .enable({ id: row.id, status: Number(!row.status) })
          .then(res => {
            this.$message.success((!row.status ? '启' : '禁') + '用成功')
            row.status = !row.status
          })
      })
    },
    //   修改数据
    info (row) {
      if (row.status == 1) return this.$message.error('启用中的项目不可做修改')
      this.id = row.id
      this.updateFlag = true
      this.newProjects = true
      for (let k in this.form) {
        if (row[k]) this.form[k] = row[k]
      }
    },
    // 获取列表数据
    getDataList (res) {
      this.tableData = res.page.list
    },
    // 新增项目
    addMainSubmit () {
      for (let k in this.form) {
        if (!this.form[k] && !this.form[k].trim()) {
          if (k === 'remarks' || k === 'accessoryUrl') continue
          return this.$message.error(this.formRule[k])
        }
      }
      // updateFlag判断是否数据修改
      let str = this.updateFlag ? 'update' : 'save'
      let formData = JSON.parse(JSON.stringify(this.form))
      if (this.updateFlag) formData.id = this.id
      this.$ajax[str](formData).then(res => {
        this.$message.success('操作成功')
        this.$refs.page.resetList()
        this.$initObj(this.form)
        this.newProjects = false
      })
    }
  }
}
</script>

<style lang="scss">
.maintenance {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    display: inline-block;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .title {
    display: inline-block;
    margin-right: 5px;
    font-size: 18px;
    border-left: 3px solid #17b3a3;
  }
  .red {
    color: #f56c6c !important;
  }
  .green {
    color: #67c23a !important;
  }
  .dialog-footer {
    text-align: center;
  }
  .addDialog {
    text-align: left;
    .el-dialog__header {
      background-color: #93e395;
      .el-dialog__title {
        color: #fff;
        font-size: 20px;
        font-weight: 500;
      }
    }
    .w500{
      width:500px;
    }
    // p {
    //   margin-bottom: 20px;
    //   span {
    //     display: inline-block;
    //     margin-right: 5px;
    //     text-align: right;
    //     vertical-align: middle;
    //     width: 100px;
    //     i {
    //       display: inline-block;
    //       margin-right: 5px;
    //       color: red;
    //     }
    //   }
    // }
  }
}
</style>
