<template>
  <el-dialog
    title="订单标记"
    :visible.sync="dialogTableVisible"
    width="550px"
    :closeOnClickModal="false"
  >
    <el-table
      ref="multipleTable"
      :data="tableData"
      class="mb20"
      tooltip-effect="dark"
      height="200px"
    >
      <el-table-column prop="content" label="标记内容"></el-table-column>
      <el-table-column prop="tagUserName" label="标记人"></el-table-column>
      <el-table-column prop="tagDate" label="标记时间" width="200"></el-table-column>
    </el-table>
    <el-form ref="form" :model="form">
      <el-form-item>
        添加新标记
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button @click="dialogTableVisible=false">取消</el-button>
        <el-button type="primary" @click="saveOrderTag">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogTableVisible: false,
      tableData: [],
      form: {
        desc: ''
      },
      orderTag: [],
      orderNo: ''
    }
  },
  mounted () {
  },
  methods: {
    //  查询订单标记

    getAddTag (orderNo) {
      this.form.desc = ''
      this.orderNo = orderNo
      this.tableData = []
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/queryOrderTag'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderNo: orderNo
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.tableData = res.data.orderTagList
          //   console.log(data.data.orderTag);
          //   if (data.data.orderTag != null) {
          //     _this.gridData = data.data.orderTag
          //   }
        }
      })
    },
    // 保存
    saveOrderTag () {
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/saveOrderTag'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderNo: this.orderNo,
            content: this.form.desc
          }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.$message.success('添加标记成功')
          this.dialogTableVisible = false
        } else {
          this.$message.error(data.data.msg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
