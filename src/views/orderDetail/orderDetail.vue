<template>
  <div class="wapper">
    <h2>订单详情</h2>
    <div class="pannelT">
      <h3>
        交易状态：
        <span class="s1" v-html="getOrderState(form.operStatus)">已发货</span>
      </h3>
      <dl>
        <dt>下单人信息</dt>
        <dd>下单人姓名：{{form.userName}}</dd>
        <dd>下单人手机号：{{form.userMobile}}</dd>
        <dd>用户下单时间：{{form.createDate}}</dd>
      </dl>
      <!-- <dl>
        <dt>订单信息</dt>
        <dd>用户下单时间：{{form.cashtime}}</dd>
        <dd>用户支付金额：{{form.orderType==1?'0.00':form.payAmountYuan |currency }}元（运费：{{form.freight}}）</dd>
        <dd>机构支付金额：{{form.paySupplyYuan |currency}}元 （运费：{{form.supplyFreight}}）</dd>
        <dd>
          用户支付方式：
          <span v-html="getpayMode(form.payMode)"></span>
        </dd>
      </dl> -->
      <dl>
        <dt>收货人信息</dt>
        <dd>收货人：{{form.receiver}}</dd>
        <dd>收货人手机号：{{form.receiverPhone}}</dd>
        <dd>收货地址：{{form.address}}</dd>
      </dl>
       <dl>
        <dt>备注</dt>
        <dd>订单备注：<span style="color:red">{{form.remarks1}}</span></dd>
      </dl>
      <!-- <dl>
        <dt>订单来源信息</dt>
        <dd>所属商城：{{form.siteName}}</dd>
      </dl> -->
    </div>
    <h2 class="mb20">商品详情</h2>
    <!-- <el-button type="primary" @click="delivery()">发货</el-button> -->
    <div class="pannelM">
      <table>
        <thead>
          <tr>
            <th width="400">商品详情</th>
            <th>数量</th>
            <th>供应价</th>
            <th>供应商</th>
            <th>物流状态</th>
            <!-- <th>操作</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <img :src="item.productPic" width="50" />
              <span>{{item.itemName}}</span>
            </td>
            <td>{{item.saleNum}}</td>
            <td>{{item.supplyPrice |currency}}</td>
            <td>{{item.supplyName}}</td>
            <td>{{item.trackState}}</td>
            <!-- <td>
              <span @click="addTag(item)" class="add">添加标记</span>
            </td>-->
          </tr>
        </tbody>
      </table>
    </div>
    <h2>包裹信息</h2>
    <div v-if="source=== 2 || source=== 102">
      <div class="order-nav">
        <ul class="boxPannel">
          <li
            v-for="(item,index) in itemList"
            :key="index"
            :class="{'active':item.select==true}"
            @click="selectBox(item)"
          >包裹{{index+1}}</li>
        </ul>
        <div
          class="goodsInfo"
          v-for="(item,index) in itemList"
          :key="index"
          v-show="item.select==true"
        >
          <div class="goodsInfo-t">
            <span>供货方：{{item.supplier}}</span>
            <span>物流信息：{{item.type== 0?'自配送':item.comName}}{{item.type==0?'':' | '}}{{item.nu}}</span>
                <el-button
                type="text"
                @click="updataNo(item)"
                v-if="item.type!=0"
                style="font-size:12px"
                class="ml10"
              >修改单号</el-button>
              <el-button
                type="text"
                @click="updataPhone(item)"
                v-if="item.type==0"
                style="font-size:12px"
                class="ml10"
              >修改电话</el-button>
          </div>
          <div class="goodsInfo-c" v-for="(itemA,indexA) in item.orderDetailList" :key="indexA">
            <img :src="itemA.productPic" width="100" height="100" />
            <p>
              {{itemA.itemName}}
              <!-- <br />1条装*1 -->
            </p>
          </div>
          <div class="goodsInfo-b">
            <div class="block">
              <light-timeline :items="item.activities"></light-timeline>
            </div>
          </div>
        </div>
      </div>
      <div class="notrack">{{trackInfo}}</div>
    </div>
    <div v-else>
      <div class="order-nav">
        <ul class="boxPannel">
          <li
            v-for="(item,index) in itemList"
            :key="index"
            :class="{'active':item.select==true}"
            @click="selectBox(item)"
          >包裹{{index+1}}</li>
        </ul>
        <div
          class="goodsInfo"
          v-for="(item,index) in itemList"
          :key="index"
          v-show="item.select==true"
        >
          <div class="goodsInfo-t">
            <span>供货方：{{item.supplier}}</span>
            <span>物流信息：{{item.express}}｜{{item.packageId}}</span>

          </div>
          <div class="goodsInfo-c" v-for="(itemA,indexA) in item.orderDetailList" :key="indexA">
            <img :src="itemA.productPic" width="100" height="100" />
            <p>
              {{itemA.name}}
              <!-- <br />1条装*1 -->
            </p>
          </div>
          <div class="goodsInfo-b">
            <div class="block">
              <light-timeline :items="item.activities" class="lineContent"></light-timeline>
            </div>
          </div>
        </div>
      </div>
      <div class="notrack">{{trackInfo}}</div>
    </div>
    <!-- <addNewTag ref="addNewTag"></addNewTag> -->
    <!-- <delivery ref="delivery"></delivery> -->
        <el-dialog title="修改" :visible.sync="dialogDelivery" width="600px" :closeOnClickModal="false">
      <el-form ref="form" :model="formDelivery" class="formPannel">
        <el-form-item label="物流公司" class="formItem" label-width="80px">
          <el-select
            v-model="formDelivery.region"
            class="w140"
            placeholder="全部"
            @change="getexpress"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item,index) in formDelivery.formDeliveryList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" class="formItem" label-width="80px" v-if="type==1">
          <el-input v-model.trim="formDelivery.name" placeholder="请填写快递单号" class="w150"></el-input>
        </el-form-item>
        <el-form-item label="配送员电话" class="formItem" label-width="90px" v-if="type==0">
          <el-input v-model.trim="formDelivery.tel" placeholder class="w150"></el-input>
        </el-form-item>
        <el-form-item class="textRight" label-width="10px">
          <el-button @click="dialogDelivery=false">取消</el-button>
          <el-button type="primary" @click="sure"  :disabled="disabled">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import delivery from '@/components/delivery/delivery';
// import addNewTag from '@/components/delivery/addNewTag';
export default {
  name: 'orderList',
  data () {
    return {
      dialogDelivery: false,
      disabled: false,
      supplier: '',
      express: '',
      expressNo: '',
      gridData: [],
      dialogTableVisible: false,
      orderNo: this.$route.query.orderNo,
      tableData: [],
      activities: [],
      itemList: [],
      form: {
        desc: ''
      },
      trackInfo: '',
      source: '',
      formDelivery: {
        region: '',
        name: '',
        tel: '',
        formDeliveryList: []
      },
      typePass: '',
      type: '',
      expressId: '',
      deliveryMobilePass: ''
    }
  },
  mounted () {
    this.delivery()
  },
  created () {
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
      // this.setExpress.expressCompanyName = this.formDelivery.formDeliveryList.filter(item => item.id === this.expressId)[0].name
      console.log(this.expressId)
    },
    sure () {
      if (this.formDelivery.region === '') {
        this.$message.error('请选择物流公司')
        return false
      }

      if (this.formDelivery.name === '' && this.type === 1) {
        this.formDelivery.tel = ''
        this.$message.error('请填写快递单号')
        return false
      }
      if (this.formDelivery.tel === '' && this.type === 0) {
        this.formDelivery.name = ''
        this.$message.error('请填写快递员电话')
        return false
      }
      this.formDelivery.name = this.formDelivery.name.replace(/\s/g, '')
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/uptdistrib'),
        method: 'post',
        data: this.$http.adornData(
          {
            expressNo: this.expressNo || '',
            orderId: this.orderNo,
            deliveryMobile: this.deliveryMobilePass || '',
            express: this.formDelivery.region,
            type: this.typePass,
            typeUpt: this.type,
            deliveryMobileUpt: this.formDelivery.tel,
            expressNoUpt: this.formDelivery.name
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.dialogDelivery = false
          this.$message.success('保存成功')
          this.formDelivery.tel = ''
          this.formDelivery.name = ''
          this.formDelivery.region = ''
          this.delivery()
        } else {
          this.trackInfo = '请核实填写的物流单号是否准确或物流公司还未录入系统！可点击修改再次输入！'
        }
        this.disabled = false
      })
    },
    updataNo (item) {
      debugger
      this.typePass = item.type
      this.type = item.type
      this.expressNo = item.nu
      this.formDelivery.region = item.data.com
      this.formDelivery.name = item.nu
      this.dialogDelivery = true
    },
    updataPhone (item) {
      this.typePass = item.type
      this.type = item.type
      this.formDelivery.region = 'zps'
      this.expressNo = item.expressNo
      this.formDelivery.tel = item.deliveryMobile
      this.dialogDelivery = true
    },
    tabsCloseOtherHandle () {
      this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    // addTag (item) {
    //   this.dialogTableVisible = true
    // },
    selectBox (item) {
      for (let index = 0; index < this.itemList.length; index++) {
        const element = this.itemList[index]
        element.select = false
      }
      item.select = true
    },
    delivery () {
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/queryOrderDetail'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderNo: this.orderNo
          }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          var res = data.data
          this.source = res.order.source
          this.form = res.order
          for (let index = 0; index < res.order.orderDetailList.length; index++) {
            const element = res.order.orderDetailList[index]
            element.productPic = element.source === 1 ? 'http://img13.360buyimg.com/n1/' + element.productPic : element.productPic
            element.trackState = element.trackState === 0 ? '未发货' : '已发货'
          }
          this.tableData = res.order.orderDetailList

          if (this.source === 2 || this.source === 102) {
            if (res.track && res.track.list.length > 0) {
              for (let i = 0; i < res.track.list.length; i++) {
                const itemA = res.track.list[i]
                itemA.select = false
                if (i === 0) {
                  itemA.select = true
                }
                itemA.activities = []
                if (itemA.type === 0) {
                  itemA.activities.push(
                    {
                      tag: itemA.deliveryTime,
                      content: '订单已交由配送员，电话：' + itemA.deliveryMobile,
                      color: '#3ac691'
                    },
                    {
                      tag: itemA.deliveryTime,
                      content: '订单已支付，待发货',
                      color: '#dddddd'
                    })
                } else {
                  var itemList = itemA.data.data
                  for (let j = 0; j < itemList.length; j++) {
                    const itemB = itemList[j]
                    itemA.activities.push({
                      tag: itemB.ftime,
                      content: itemB.context,
                      color: j === 0 ? '#3ac691' : '#dddddd'
                    })
                  }
                }
                itemA.supplier = res.track.supplyName
                itemA.nu = itemA.type == 0 ? '' : itemA.data.nu
                itemA.type = itemA.type
                itemA.comName = itemA.type == 0 ? '' : itemA.data.comName
                itemA.deliveryMobile = itemA.type == 0 ? itemA.deliveryMobile : itemA.data.deliveryMobile
                itemA.deliveryTime = itemA.type == 0 ? itemA.deliveryTime : itemA.data.deliveryTime
                for (let indexA = 0; indexA < itemA.orderDetailList.length; indexA++) {
                  const elementA = itemA.orderDetailList[indexA]
                  elementA.productPic = elementA.source === 1 ? 'http://img13.360buyimg.com/n1/' + elementA.productPic : elementA.productPic
                }
              }
              this.itemList = res.track.list
              this.deliveryMobilePass = this.itemList[0].deliveryMobile === undefined ? '' : this.itemList[0].deliveryMobile
            } else {
              this.trackInfo = '暂无物流信息'
            }
          } else {
            if (res.track.msg.length > 0 && res.track.msg != '暂无物流信息') {
              for (let i = 0; i < res.track.msg.length; i++) {
                const itemA = res.track.msg[i]
                itemA.select = false
                if (i === 0) {
                  itemA.select = true
                }
                itemA.activities = []
                itemA.orderDetailList = []
                for (let j = itemA.itemList.length - 1; j >= 0; j--) {
                  const itemB = itemA.itemList[j]
                  itemA.activities.push({
                    tag: itemB.msgTime,
                    content: itemB.content,
                    color: j === itemA.itemList.length - 1 ? '#3ac691' : '#dddddd'
                  })
                }

                itemA.supplier = res.order.source === 1 ? '京东' : '自有供应商'
                console.log(itemA, 12123)
                itemA.express = itemA.itemList[0].distrName

                for (let m = 0; m < itemA.logistList.length; m++) {
                  const itemC = itemA.logistList[m]
                  for (let n = 0; n < this.tableData.length; n++) {
                    if (itemC.skuId === this.tableData[n].itemCode) {
                      itemA.orderDetailList.push({
                        name: this.tableData[n].itemName,
                        saleNum: this.tableData[n].saleNum,
                        productPic: this.tableData[n].productPic
                      })
                    }
                  }
                }
              }
              this.itemList = res.track.msg
              console.log(this.itemList)
            } else {
              this.trackInfo = '暂无物流信息'
            }
          }
        }
      })
    },
    getOrderState (val) {
      switch (val) {
        case 0:
          return '新创建'
        case 4:
          return '撤销'
        case 11:
          return '一级审批'
        case 12:
          return '二级审批'
        case 15:
          return '支付中'
        case 21:
          return '不通过'
        case 22:
          return '待收货'
        case 23:
          return '已完成'
        case 13:
          return '撤销待审核'
        case 31:
          return '退货'
        case 41:
          return '过期取消'
      }
    },
    getpayMode (val) {
      switch (val) {
        case 'ye':
          return '余额支付'
        case 'wx':
          return '微信支付'
        case 'ycb':
          return '驿车宝支付'
        case 'zh_ywt':
          return '招行一网通支付'
      }
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

        }
      })
    }

  },
  components: {
    // delivery,
    // addNewTag
  }
}
</script>
<style lang="scss" scoped>
.wapper {
  position: relative;
  background: #ffffff;
  h2 {
    border-left: 4px solid #019b69;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
  }
  .pannelT {
    margin-bottom: 40px;
    margin-top: 20px;
    h3 {
      line-height: 40px;
      font-weight: bold;
      span {
        color: #ff862e;
      }
    }
    dl {
      dt {
        width: 100%;
        line-height: 40px;
        font-weight: bold;
      }
      dd {
        display: inline-block;
        line-height: 40px;
        margin-right: 20px;
        color: #8a979e;
      }
    }
  }
  .pannelM {
    margin-bottom: 40px;
    table {
      width: 100%;
      tr {
        td,
        th {
          padding: 12px 10px;
          min-width: 0;
          box-sizing: border-box;
          text-overflow: ellipsis;
          vertical-align: middle;
          position: relative;
          text-align: left;
          border-bottom: 1px solid #ebeef5;
          // transition: background-color 0.25s ease;
          font-size: 14px;
          color: #606266;
        }
        th {
          font-weight: bold;
          color: rgb(51, 51, 51);
          background: rgb(245, 247, 250);
        }
        td {
          img {
            vertical-align: top;
            display: inline-block;
          }
          span {
            display: inline-block;
            width: 200px;
            padding-top: 10px;
            line-height: 20px;
            font-size: 12px;
          }
        }
        .td1 {
          border: 1px solid #ebeef5;
          text-align: center;
        }
      }
      .thStyle {
        background-color: #e6ecf7;
      }
      .tdInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          margin-right: 10px;
        }
        .tdr {
          span {
            color: #4486f4;
            cursor: pointer;
          }
        }
      }
    }
  }
  .order-nav {
    margin-top: 30px;
    ul.boxPannel {
      border-bottom: 1px solid #d7e0f1;
    }
    li {
      min-width: 92px;
      height: 56px;
      line-height: 48px;
      text-align: center;
      top: 2px;
      position: relative;
      border: 1px solid transparent;
      transition: 0.2s ease;
      border-radius: 3px;
      display: inline-block;
      cursor: pointer;
      &.active {
        border: 1px solid #d7e0f1;
        background-color: #fff;
        border-bottom: 2px solid #fff;
      }
    }
  }
  .goodsInfo-t {
    height: 42px;
    background-color: #dee9f7;
    line-height: 42px;
    text-indent: 10px;
    margin: 20px 0;
  }
  .goodsInfo-c {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img,
    p {
      display: inline-block;
    }
    img {
      vertical-align: top;
    }
    p {
      width: 200px;
      display: inline-block;
      line-height: 20px;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      padding-left: 20px;
    }
  }
  .add {
    color: #4486f4;
    cursor: pointer;
  }
  .notrack {
    padding: 50px;
    text-align: left;
    font-weight: bold;
  }
}
</style>
