<template>
  <el-dialog title="发货" :visible.sync="dialogDelivery" width="900px" :closeOnClickModal="false">
    <el-table
      ref="multipleTable"
      :data="getDelivery"
      tooltip-effect="dark"
      style="width: 100%"
      class="mb20"
      height="250px"
      @selection-change="handleSelectionChange"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="itemName" label="商品"></el-table-column>
      <el-table-column prop="saleNum" label="数量" width="200"></el-table-column>
      <el-table-column prop="trackState" label="状态" width="200"></el-table-column>
    </el-table>
    <el-form ref="form" :model="formDelivery" class="formPannel">
      <el-form-item label="物流公司" class="formItem" label-width="80px">
        <el-select v-model="formDelivery.region" class="w140" placeholder="全部" @change="getexpress">
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in formDelivery.formDeliveryList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号" class="formItem" label-width="80px" v-if="type==1">
        <el-input v-model="formDelivery.name" placeholder="请填写快递单号" class="w150"></el-input>
      </el-form-item>
      <el-form-item label="配送员电话" class="formItem" label-width="90px" v-if="type==0">
        <el-input v-model="formDelivery.tel" placeholder class="w150"></el-input>
      </el-form-item>
      <el-form-item
        class="ml0"
        label-width="10px"
      >用户收货信息：{{getSend.address}},{{getSend.receiver}},{{getSend.receiverPhone}}</el-form-item>
      <el-form-item class="textRight" label-width="10px">
        <el-button @click="dialogDelivery=false">取消</el-button>
        <el-button type="primary" @click="sure">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: 'orderList',
  data () {
    return {
      dialogDelivery: false,
      getSend: [],
      getDelivery: [],
      formDelivery: {
        region: '',
        name: '',
        tel: '',
        formDeliveryList: []
      },
      expressId: '',
      type: 1,
      multipleSelection: ''
    }
  },
  mounted () {
    this.queryComList()
  },
  methods: {

    getexpress (id) {
      if (id === 'zps') {
        this.type = 0
        this.expressId = ''
      } else {
        this.type = 1
        this.expressId = id
      }

      console.log(this.expressId)
    },
    getorderid (item) {
      this.formDelivery.name = ''
      this.orderId = item.id
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
    sure () {
      var orderIds = ''
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少勾选一个商品')
        return false
      }
      if (this.formDelivery.name == '' && this.type === 1) {
        this.$message.error('请填写快递单号')
        return false
      }
      if (this.formDelivery.tel == '' && this.type === 0) {
        this.$message.error('请填写快递员电话')
        return false
      }
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const element = this.multipleSelection[index]
        orderIds += element.id + ','
      }
      orderIds = orderIds.substring(0, orderIds.length - 1)
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/delivered'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderId: this.orderId,
            orderDetailIds: orderIds,
            type: this.type,
            deliveryMobile: this.type === 0 ? this.formDelivery.tel : '',
            express: this.type === 0 ? '' : this.expressId,
            expressNo: this.type === 0 ? '' : this.formDelivery.name
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.dialogDelivery = false
          this.$message.success('保存成功')
          this.$emit('freshList')
        }
      })
    },

    queryComList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/queryComList'),
        method: 'post',
        data: ''
      }).then((res) => {
        if (res && res.data.code === 1) {
          var obj = res.data.obj
          for (var key in obj) {
            this.formDelivery.formDeliveryList.push({
              id: key,
              name: obj[key],
              type: 1
            })
          }
          var item = {
            id: 'zps',
            name: '自配送',
            type: 0
          }
          this.formDelivery.formDeliveryList.splice(0, 0, item)
          console.log(this.formDelivery.formDeliveryList)
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formPannel {
  .formItem {
    display: inline-block;
  }
}
</style>
