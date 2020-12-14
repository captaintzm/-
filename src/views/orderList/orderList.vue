<template>
  <div class="wapper">
    <div class="order-nav">
      <ul>
        <li
          v-for="item in ordernavlist"
          :key="item.type"
          :class="{'active':item.select==true}"
          @click="selecThis(item)"
        >
          <el-badge
            class="badgemark"
            :value="toreceiveCount"
            v-if="item.type==1&& item.select==false"
          />
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class="formList">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="下单时间" class="formItem">
          <el-date-picker
            v-model="form.orderTime"
            :default-value="timeDefaultShow"
            type="datetimerange"
            :picker-options="pickerOptions2"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="selectTimeOrderTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="关键字" class="formItem">
          <el-select v-model="form.region" class="w140" @change="getkey">
            <el-option label="全部" value></el-option>
            <el-option label="订单号" value="orderNo"></el-option>
            <!-- <el-option label="下单人" value="userName"></el-option> -->
            <el-option label="所属商城" value="siteName"></el-option>
            <el-option label="收货人手机号" value="receiverPhone"></el-option>
            <el-option label="收货人姓名" value="receiver"></el-option>
            <el-option label="商品名称" value="itemName"></el-option>
            <el-option label="供应商名称" value="supplyName"></el-option>
            <!-- <el-option label="物流单号" value="danhao"></el-option> -->
          </el-select>
          <el-input v-model.trim="form.key" placeholder="请输入关键字" class="w140"></el-input>
        </el-form-item>

        <!-- <el-form-item label="所属机构" class="formItem">
          <div v-if="form.organizationlistA.length>0" style="display:inline-block">
            <el-select
              v-model="form.organizationA"
              class="w140"
              placeholder="选择机构"
              @change="orgPannelFirst"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in form.organizationlistA"
                :key="index"
              ></el-option>
            </el-select>
          </div>
          <div v-if="form.organizationlistB.length>0" style="display:inline-block">
            <el-select
              v-model="form.orgChildrenB"
              class="w140"
              placeholder="选择机构"
              @change="orgPannelSencond"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in form.organizationlistB"
                :key="index"
              ></el-option>
            </el-select>
          </div>
          <div v-if="form.organizationlistC.length>0" style="display:inline-block">
            <el-select
              v-model="form.orgChildrenC"
              class="w140"
              placeholder="选择商城"
              @change="orgPannelThird"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in form.organizationlistC"
                :key="index"
              ></el-option>
            </el-select>
          </div>
        </el-form-item> -->
        <el-form-item label="完成时间" class="formItem" v-if="operStatus==23 || operStatus==''">
          <el-date-picker
            v-model="form.doneTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions3"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="发货状态"
          class="formItem"
          placeholder="请选择"
          v-if="operStatus=='' && operStatus==''"
        >
          <el-select v-model="form.extraType" class="w110">
            <el-option label="全部" value=""></el-option>
            <el-option label="待发货" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
            <el-option label="部分发货" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="formItem" label-width="10px">
          <el-button type="primary" @click="search()">搜索</el-button>
          <el-button type="primary" @click="exportOrder()">订单导出</el-button>
          <!-- <el-button type="primary">批量发货</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="tablescroll">
      <table>
        <thead>
          <tr>
            <th width="400">商品详情</th>
            <th>供应价</th>
            <th>数量</th>
            <th>供货方</th>
            <th>所属商城</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody v-for="item in tableData" :key="item.id">
          <tr>
            <td colspan="7" class="thStyle">
              <div class="tdInfo">
                <div class="tdl">
                  <span>订单编号：{{item.orderNo}}</span>
                  <span>下单时间：{{item.createDate}}</span>
                  <span>共{{item.orderDetailList.length}}件商品</span>
                  <!-- <span>订单总价：￥{{item.payAmountYuan}}</span> -->
                </div>
                <div class="tdr">
                  <span @click="addTag(item)">查看/添加标记</span>
                  <span @click="lookDetail(item)">查看详情</span>
                </div>
              </div>
            </td>
          </tr>
          <tr v-for="(childrenitem,childrenindex) in item.orderDetailList" :key="childrenitem.id">
            <td>
              <div class="styleA">
                <img :src="childrenitem.productPic" width="86" />
                <div>{{childrenitem.itemName}}</div>
              </div>
            </td>
            <td>{{childrenitem.supplyPrice}}</td>
            <td>{{childrenitem.saleNum}}</td>
            <!-- <td>{{childrenitem.profitPercent}}</td> -->
            <td>{{childrenitem.supplyName}}</td>
            <td>{{item.siteName}}</td>
            <td
              class="td1"
              :rowspan="item.orderDetailList.length"
              v-if="item.orderDetailList.length>0&&childrenindex==0"
            >
              <span v-if="item.source==102 && item.trackState==4">部分发货</span>
              <br />

              <el-button
                type="primary"
                size="small"
                v-if="((item.source==102 && item.trackState==0) || (item.source==102 && item.trackState==4) )&& item.operStatus != 31 "
                @click="deliverGoods(item)"
              >发货</el-button>
              <span v-else v-html="getOrderState(item)"></span>
              <br />
            </td>
            <td>
              订单备注：{{item.remarks1}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
    ></el-pagination>

    <delivery ref="delivery" @freshList="freshList"></delivery>
    <addNewTag ref="addNewTag"></addNewTag>

    <el-dialog title="提示" :visible.sync="returnGoods" width="30%">
      <span style="font-size:18px;display:inline-block" class="mb20">您确定要退货吗？</span>
      <p>提示：请在收到用户寄回的货物后操作，确定后该商品的货款将会返还给用户</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnGoods = false">取 消</el-button>
        <el-button type="primary" @click="returnClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import delivery from '@/components/delivery/delivery'
import addNewTag from '@/components/delivery/addNewTag'
import { getRecently7DayStartDate } from '@/utils/index'
export default {
  name: 'orderList',
  data () {
    return {
      toreceiveCount: 0,
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      pickerOptions3: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      ordernavlist: [
        {
          name: '全部订单',
          type: 0,
          operStatus: '',
          trackState: '',
          select: true
        },
        {
          name: '待发货',
          type: 1,
          operStatus: 22,
          trackState: 0,
          select: false
        },
        {
          name: '已发货',
          type: 2,
          operStatus: 22,
          trackState: 1,
          select: false
        },
        {
          name: '已完成',
          type: 3,
          operStatus: 23,
          trackState: '',
          select: false
        },
        {
          name: '已关闭',
          type: 4,
          operStatus: 23,
          trackState: '',
          close: 1,
          select: false
        },
        {
          name: '售后',
          type: 5,
          operStatus: 31,
          trackState: '',
          select: false
        }
      ],
      form: {
        orderTime: '',
        doneTime: '',
        region: '',
        key: '',
        extraType: '',
        orgChildrenA: '',
        organizationlistA: '',
        orgChildrenB: '',
        organizationlistB: '',
        orgChildrenC: '',
        organizationlistC: '',
        value: ''
      },
      tableData: [],
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      exportOrderFlag: false,
      orgType: '',
      operStatus: '',
      returnGoods: false,
      isSeven: true,
      isSelecThis: 0,
      timeDefaultShow: ''
    }
  },
  mounted () {
    this.orgId = ''
    this.orderId = ''
    this.isSelf = ''
    this.type = 1
    this.getkeyname = ''
    // this.getisSelecThis()
    // this.getqueryOrg('')
    this.getOrderList()
  },
  activated () {
    // this.tabsCloseOtherHandle()
  },
  computed: {
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    }
  },
  methods: {
    GetDateStr (AddDayCount) {
      var dd = new Date()
      dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
      var y = dd.getFullYear()
      var m = dd.getMonth() + 1 // 获取当前月份的日期
      var d = dd.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      return y + '-' + m + '-' + d
    },
    getisSelecThis () {
      var type = parseInt(this.$route.query.type)
      if (!isNaN(type)) {
        for (let index = 0; index < this.ordernavlist.length; index++) {
          const item = this.ordernavlist[index]
          item.select = false
          if (item.type === type) {
            item.select = true
            this.operStatus = item.operStatus === undefined ? '' : item.operStatus
            this.trackState = item.trackState === undefined ? '' : item.trackState
            this.close = item.close === undefined ? '' : item.close
          }
        }
        this.pageIndex = 1
        if (type === 0) {
          var yesterday = this.GetDateStr(-1)
          this.form.orderTime = []
          this.form.orderTime[0] = yesterday + ' 00:00:00'
          this.form.orderTime[1] = yesterday + ' 23:59:59'
        }
        // console.log(this.form.orderTime)
      }
    },
    deliverReturnGoods (item) {
      this.orderId = item.id
      this.returnGoods = true
    },
    returnClose (done) {
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/cancleOrder'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderId: this.orderId
          }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.$message.success('退货成功')
          this.returnGoods = false
          this.getOrderList()
        } else {
          this.$message.error(data.data.msg)
        }
      })
    },
    freshList () {
      this.getOrderList()
    },
    deliverGoods (item) {
      this.$refs.delivery.getorderid(item)
      this.$refs.delivery.getSend = item
      var trackStateJson = []
      for (let index = 0; index < item.orderDetailList.length; index++) {
        const element = item.orderDetailList[index]
        if (element.trackState === 0) {
          trackStateJson.push({
            id: element.id,
            itemName: element.itemName,
            saleNum: element.saleNum,
            trackState: '未发货'
          })
        }
      }
      this.$refs.delivery.getDelivery = trackStateJson
      this.$refs.delivery.dialogDelivery = true
    },
    // /order/order/queryOrg
    // 查询机构
    handleChange (orgId) {

    },
    orgPannelFirst (orgId) {
      this.isSelf = ''
      if (this.orgType === 3) {
        this.type = 2
      } else if (this.orgType === 2) {
        this.type = 3
        for (let index = 0; index < this.form.organizationlistA.length; index++) {
          const element = this.form.organizationlistA[index]
          if (element.name === '自营' && element.id === orgId) {
            orgId = ''
            this.isSelf = 1
          }
        }
      }

      this.form.orgChildrenB = ''
      this.form.organizationlistB = []
      this.form.organizationlistC = []
      this.form.orgChildrenC = ''
      this.getqueryOrg(orgId)
    },
    orgPannelSencond (orgId) {
      this.form.organizationlistC = []
      this.form.orgChildrenC = ''
      this.type = 3
      for (let index = 0; index < this.form.organizationlistB.length; index++) {
        const element = this.form.organizationlistB[index]
        if (element.name === '自营' && element.id === orgId) {
          this.isSelf = 1
          break
        } else {
          this.isSelf = ''
        }
      }
      this.getqueryOrg(orgId)
    },
    orgPannelThird (orgId) {

    },
    getqueryOrg (orgId) {
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/queryOrg'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: orgId,
            isSelf: this.isSelf
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          var siteName = res.data.data[0].siteName
          if (siteName !== undefined && siteName !== null) {
            this.orgType = 1
            this.type = 3
            for (let index = 0; index < res.data.data.length; index++) {
              const element = res.data.data[index]
              element.name = element.siteName
            }
          }
          if (this.type === 1) {
            this.form.organizationlistA = res.data.data
            if (this.form.organizationlistA[0].type === 3) {
              this.orgType = 3
            } else if (this.form.organizationlistA[0].type === 4) {
              var item1 = { 'isSelf': 1, 'name': '自营', 'id': orgId }
              this.form.organizationlistA.splice(0, 0, item1)
              this.orgType = 2
            } else {
              this.orgType = 1
            }
          }
          if (this.type === 2) {
            this.form.organizationlistB = res.data.data
            if (this.orgType === 2) {
            } else {
              var item2 = { 'isSelf': 1, 'name': '自营', 'id': orgId }
              this.form.organizationlistB.splice(0, 0, item2)
            }
          }
          if (this.type === 3) {
            this.form.organizationlistC = res.data.data
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 关键字
    getkey (id) {
      this.getkeyname = id
      this.form.key = ''
    },
    // 添加标记
    addTag (item) {
      // console.log(item)
      this.$refs.addNewTag.orderTag = item
      this.$refs.addNewTag.getAddTag(item.orderNo)
      this.$refs.addNewTag.dialogTableVisible = true
    },
    lookDetail (item) {
      // this.$router.push('/orderDetail?orderNo=' + item.orderNo + '&outTradeNo=' + item.outTradeNo + '&source=' + item.source)
      this.$router.push('/orderDetail?orderNo=' + item.orderNo)
    },
    selectTimeOrderTime (val) {
      // console.log(val)
      this.form.orderTime = val
    },
    search () {
      if (this.getkeyname !== '' && this.form.key === '') {
        this.$message.error('请输入关键字')
        return false
      }
      this.pageIndex = 1
      this.getOrderList()
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return [0, 0]
        } else if (columnIndex === 1) {
          return [1, 8]
        }
      }
    },
    // 导出
    exportOrder () {
      if (this.form.orderTime === null || this.form.orderTime === '') {
        this.$message.error('请选择下单时间')
        return false
      }
      this.exportOrderFlag = true
      this.getOrderList()
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getOrderList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getOrderList()
    },
    selecThis (item) {
      this.form.extraType = ''
      for (let index = 0; index < this.ordernavlist.length; index++) {
        const element = this.ordernavlist[index]
        element.select = false
      }
      item.select = true
      this.operStatus = item.operStatus === undefined ? '' : item.operStatus
      this.trackState = item.trackState === undefined ? '' : item.trackState
      this.close = item.close === undefined ? '' : item.close
      this.pageIndex = 1
      this.getOrderList()
    },
    getOrderList () {
      this.tableData = []
      if (this.form.orgChildrenC !== '') {
        this.form.orgChildrenB = ''
        this.form.orgChildrenA = ''
      } else {
        this.form.orgChildrenC = ''
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-supply/order/order/list'),
        method: 'post',
        data: this.$http.adornData(
          {
            operStatus: this.operStatus === undefined ? '' : this.operStatus, // 订单状态
            trackState: this.trackState === undefined ? '' : this.trackState,
            close: this.close === undefined ? '' : this.close, // 已关闭
            isDeliver: '', // 是否发货
            searchBy: this.getkeyname,
            searchValue: this.form.key,
            orderFrom: '2', // 订单来源
            siteId: this.form.orgChildrenC,
            orgId: this.form.orgChildrenB === '' ? this.form.orgChildrenA : this.form.orgChildrenB,
            startTime: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[0],
            endTime: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[1],
            receiptStartTime: this.form.doneTime === null || this.form.doneTime === '' ? '' : this.form.doneTime[0],
            receiptEndTime: this.form.doneTime === null || this.form.doneTime === '' ? '' : this.form.doneTime[1],
            page: this.pageIndex,
            limit: this.pageSize,
            extraType: this.form.extraType
          }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          for (let i = 0; i < data.data.page.list.length; i++) {
            const itemA = data.data.page.list[i]
            for (let j = 0; j < itemA.orderDetailList.length; j++) {
              const itemB = itemA.orderDetailList[j]
              itemB.productPic = itemB.source === 1 ? 'http://img13.360buyimg.com/n1/' + itemB.productPic : itemB.productPic
            }
          }
          this.tableData = data.data.page.list
          this.totalPage = data.data.page.totalCount
          if (this.exportOrderFlag === true) {
            this.$http({
              url: this.$http.adornUrl('/ybt-supply/order/order/exportOrder'),
              method: 'post',
              responseType: 'arraybuffer',
              data: this.$http.adornData(
                {
                  operStatus: this.operStatus === undefined ? '' : this.operStatus, // 订单状态
                  trackState: this.trackState === undefined ? '' : this.trackState,
                  close: this.close === undefined ? '' : this.close, // 已关闭
                  isDeliver: '', // 是否发货
                  searchBy: this.getkeyname,
                  searchValue: this.form.key,
                  orderFrom: '2', // 订单来源
                  siteId: this.form.orgChildrenC,
                  orgId: this.form.orgChildrenB === '' ? this.form.orgChildrenA : this.form.orgChildrenB,
                  startTime: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[0],
                  endTime: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[1],
                  receiptStartTime: this.form.doneTime === null || this.form.doneTime === '' ? '' : this.form.doneTime[0],
                  receiptEndTime: this.form.doneTime === null || this.form.doneTime === '' ? '' : this.form.doneTime[1],
                  extraType: this.form.extraType
                }, true)
            }).then((res) => {
              if (res) {
                let blob = new Blob([res.data], {
                  type: 'application/x-xls',
                  charset: 'utf-8'
                })
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = '订单列表.xls'
                var event = new MouseEvent('click')
                link.dispatchEvent(event)
                this.exportOrderFlag = false
              }
            })
          }
          this.exportOrderFlag = false
          this.toreceiveCount = data.data.toreceiveCount
        } else {
          this.toreceiveCount = 0
        }
      })

      // /order/order/list订单列表
    },

    getOrderState (item) {
      var getRecently7Day = getRecently7DayStartDate()
      var time1 = new Date(getRecently7Day).getTime()
      if (item.operStatus === 22 && item.trackState === 0) {
        return '待发货'
      } else if (item.operStatus === 22 && item.trackState === 1) {
        return '已发货'
      } else if (item.operStatus === 23 && time1 > item.time2) {
        console.log('已发货')
        this.isSeven = true
        return '已关闭'
      } else if (item.operStatus === 23) {
        this.isSeven = false
        return '已完成'
      } else {
        switch (item.operStatus) {
          case 0:
            return '新创建'
          case 4:
            return '撤销'
          case 11:
            return '一级审批'
          case 12:
            return '二级审批'
          case 13:
            return '撤销待审核'
          case 15:
            return '支付中'
          case 21:
            return '不通过'
          // case 23:
          //   return '已完成';
          case 31:
            return '退货'
          case 41:
            return '过期取消'
        }
      }
    }
  },
  components: {
    delivery,
    addNewTag
  }
}
</script>
<style lang="scss" scoped>
.wapper {
  position: relative;
  background: #ffffff;
  .w140 {
    width: 140px;
  }
  .order-nav {
    ul {
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
  .formList {
    padding: 20px;
    .formItem {
      display: inline-block;
    }
  }
  .tablescroll {
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
          transition: background-color 0.25s ease;
          font-size: 12px;
          color: #606266;
        }
        th {
          font-weight: bold;
          color: rgb(51, 51, 51);
          background: rgb(245, 247, 250);
        }
        .td1 {
          border: 1px solid #ebeef5;
        }
        .styleA {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          img {
            display: inline-block;
            margin-right: 10px;
          }
          div {
            display: inline-block;
            width: 200px;
          }
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
            color: #17b3a3;
            cursor: pointer;
          }
        }
      }
    }
  }
  .badgemark {
    position: absolute;
    right: 0px;
    top: -9px;
  }
}
</style>
