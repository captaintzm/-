<template>
  <div class="supplierConfig">
    <div class="bodyheader">
      <span class="title">&nbsp;供应商运费配置</span>
      <el-button
        size="mini"
        type="success"
        @click="newProjects = true"
        style="margin-right: 50px;"
      >新增</el-button>
      <div class="searchTab">
        <span>
          供应商名称&nbsp;
          <el-input style="width: 200px;" size="mini" v-model="pages.supplyName"></el-input>
        </span>
        <span>
          供应商编号&nbsp;
          <el-input style="width: 150px;" size="mini" v-model="pages.supplyNo"></el-input>
        </span>
        <span>
          状态&nbsp;
          <el-select v-model="pages.status" placeholder="请选择" size="mini">
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
    <el-table
      :data="tableData"
      :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}"
    >
      <el-table-column prop="supplyName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplyNo" label="编号" align="center"></el-table-column>
      <el-table-column prop="postPrice" label="包邮价格" align="center"></el-table-column>
      <el-table-column prop="postAmount" label="非包邮运费" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <el-table-column prop="contractTel" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style="color: #67c23a;">启用</span>
          <span v-else style="color: #f56c6c;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="sass" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 0"
            @click="watchDetail(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            @click="enable(scope.row)"
          >{{scope.row.status != 0 ? '禁用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-common url="getSupplierPostList" @dataList="getDataList" :pages="pages" ref="page"></page-common>
    <el-dialog
      title="供应商运费配置"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="newProjects"
      class="addDialog"
      :center="true"
    >
      <p>
        <span>
          <i>*</i>供应商名称
        </span>
        <el-select
          v-model="form.supplyId"
          placeholder="请选择"
          @change="showSupplyId"
          :disabled="watchFlag"
        >
          <el-option
            v-for="item in supplyNameArr"
            :key="item.value"
            :label="item.supplyName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <p>
        <span>
          <i>*</i>供应商编号
        </span>
        <el-input v-model="supplyNo" autocomplete="off" style="width: 60%;" disabled></el-input>
      </p>
      <p>
        <span>
          <i>*</i>包邮价格
        </span>
        <el-input
          v-model="form.postPrice"
          autocomplete="off"
          style="width: 60%;"
          maxlength="5"
          @keyup.stop.native="form.postPrice= form.postPrice.replace(/[^\.\d]/g,'')"
          @blur.stop.native="form.postPrice= form.postPrice.replace(/[^\.\d]/g,'')"
        ></el-input>
      </p>
      <p>
        <span>
          <i>*</i>非包邮运费
        </span>
        <el-input
          v-model="form.postAmount"
          autocomplete="off"
          style="width: 60%;"
          maxlength="5"
          @keyup.stop.native="form.postAmount= form.postAmount.replace(/[^\.\d]/g,'')"
          @blur.stop.native="form.postAmount= form.postAmount.replace(/[^\.\d]/g,'')"
        ></el-input>
      </p>
      <p>
        <span>备注</span>
        <el-input v-model="form.remarks" autocomplete="off" style="width: 60%;"></el-input>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newProjects = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
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
      watchId: '',
      supplyNo: '',
      newSupplier: false,
      pages: {
        supplyName: '',
        supplyNo: '',
        status: ''
      },
      form: {
        supplyId: '',
        postPrice: '',
        remarks: '',
        postAmount: ''
      },
      upDateForm: {
        supplyId: '',
        postPrice: '',
        remarks: '',
        postAmount: ''
      },
      newProjects: false,
      supplyNameArr: [],
      watchFlag: false
    }
  },
  watch: {
    newProjects (n, o) {
      this.supplyNameArr = []
      this.$ajax.getUnConfigPostSupplierList().then(res => {
        this.supplyNameArr = res.supplySupplierList
      })
      if (!n) {
        this.$initObj(this.form)
        this.watchFlag = false
        this.supplyNo = ''
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    watchDetail (row) {
      this.watchId = row.id
      this.newProjects = true
      this.watchFlag = true
      this.form.supplyId = row.supplyName
      this.form.postPrice = row.postPrice
      this.form.remarks = row.remarks
      this.form.postAmount = row.postAmount
      this.supplyNo = row.supplyNo
      this.upDateForm.id = row.id
      this.upDateForm.supplyId = row.supplyId
      this.upDateForm.postPrice = row.postPrice
      this.upDateForm.remarks = row.remarks
      this.upDateForm.postAmount = row.postAmount
    },
    resetDialog () {
      this.newProjects = false
      this.$initObj(this.form)
    },
    //   新增配置
    submit () {
      if (this.watchFlag) {
        this.upDateForm.postPrice = this.form.postPrice
        this.upDateForm.remarks = this.form.remarks
        this.upDateForm.postAmount = this.form.postAmount
      }
      console.log(this.upDateForm)
      if (!(this.watchFlag ? this.upDateForm.supplyId : this.form.supplyId)) { return this.$message.error('请选择供应商') }
      if (!(this.watchFlag ? this.upDateForm.postPrice : this.form.postPrice)) { return this.$message.error('请填写包邮价格') }
      if (!(this.watchFlag ? this.upDateForm.postAmount : this.form.postAmount)) { return this.$message.error('请填写非包邮运费') }
      this.$ajax
        .saveOrUpdateSupplierPost(this.watchFlag ? this.upDateForm : this.form)
        .then(res => {
          this.$message.success('操作成功')
          this.resetSeach()
          this.resetDialog()
        })
    },
    showSupplyId () {
      this.supplyNo = this.supplyNameArr.filter(
        item => item.id === this.form.supplyId
      )[0].supplyNo
    },
    // 禁用启用功能
    enable (row) {
      row.status = Number(row.status)
      this.$confirm(
        `确定${!Number(row.status) ? '启' : '禁'}用当前供应商配置吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$ajax
          .saveOrUpdateSupplierPost({ id: row.id, status: Number(!row.status) })
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
    .dialog-footer {
      text-align: center;
    }
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
      width: 60%;
      margin: 0 auto 15px;
      > span {
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
