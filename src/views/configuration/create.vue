<template>
  <div class="created">
    <p class="title">&nbsp;{{headers}}</p>
    <div class="content">
      <div class="staff-head">商品设置</div>
      <el-form label-width="130px" :disabled="disabledALL">
        <el-form-item label="项目名称" style="font-weight:700;" required>
          <el-select v-model="selectForm.projectName" placeholder="请选择" :disabled="type==2">
            <el-option
              v-for="item in projectOption"
              :key="item.projectName"
              :label="item.projectName"
              :value="item.projectName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格区间" style="font-weight:700;" required>
          <el-input
            @keyup.stop.native="form.lowestPrice= form.lowestPrice.replace(/[^\.\d]/g,'')"
            @blur.stop.native="form.lowestPrice= form.lowestPrice.replace(/[^\.\d]/g,'')"
            maxlength="8"
            placeholder="请输入最低价"
            style="width:150px;"
            v-model="form.lowestPrice"
          ></el-input>&nbsp;-&nbsp;
          <el-input
            @keyup.stop.native="form.highestPrice= form.highestPrice.replace(/[^\.\d]/g,'')"
            maxlength="8"
            placeholder="请输入最高价"
            style="width:150px;"
            v-model="form.highestPrice"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类" style="font-weight:700;" required>
          <el-cascader :options="selecOption" :props="props" collapse-tags v-model="arr"></el-cascader>
        </el-form-item>

        <div class="staff-head">加价比例设置</div>
        <el-form-item>
          <div class="items" v-for="(item,index) in allChannelSupply" :key="index">
            <div class="order">
            <el-checkbox v-model="item.select"  @change="selectAll(item)"> 
              <span class="AA">{{item.channelName}}</span>
            </el-checkbox>
            <div class="styleOne">
              <el-input
                v-model="item.content"
                style="width:200px;"
                :disabled="!item.select"
                @blur="getall(item)"
              ></el-input>%
               <span
              v-if="item.boxshows"
              style="padding-left:80px; font-weight:700; font-size:16px;float:right;"
              @click="open(item)"
            >{{item.boxshowsSelect?'展开':'收起'}}<i :class="c1? 'el-icon-arrow-down':'el-icon-arrow-up'"></i></span>
              </div>
              </div>
            <div class="mb10"></div>
            <div
              class="flex-item"
              :style="item.boxshowsSelect?'height:0;overflow:hidden':'height:auto'"
            >
            <div class="checkStyle">
              <el-checkbox
                v-for="(itemB,indexB) in item.supplierList"
                :label="itemB.shortName"
                :value="itemB.id"
                :key="indexB"
                v-model="itemB.select"
                @change="selectItem(item,itemB)"
              >
                <span>{{itemB.shortName}}</span>
                <el-input
                  v-model="itemB.content"
                  style="width:200px;"
                  :disabled="!itemB.select"
                  @blur="getallA(itemB)"
                ></el-input>%
              </el-checkbox>
              </div>
            </div>
            <div class="mb50"></div>
          </div>
        </el-form-item>

        <div class="staff-head">扣点设置</div>
        <el-form-item>
          <span style="font-weight:700;">扣点模式</span>
          <el-tooltip class="item" placement="bottom-end">
            <div slot="content">
              下单时预存款账户按照每个渠道设置的扣点
              <br />进行扣除、机构端订单详情显示扣点信息，
              <br />售后时按照供应价和扣点退还预存款（按
              <br />照商品金额供应价）
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-checkbox v-model="form.deductionType" disabled>分销扣点模式</el-checkbox>
          <el-checkbox v-model="api" disabled>
            纯API扣点模式
            <div class="mb50"></div>
          </el-checkbox>
          <div class="items" v-for="(item,index) in allChannelSupplynew" :key="index">
            <div class="order">
            <el-checkbox v-model="item.select" style="width:300px;" @change="selectAll(item)">
              <span class="AA">{{item.channelName}}</span>
              <div class="styleOne">
              <el-input
                v-model="item.content"
                style="width:200px;"
                :disabled="!item.select"
                @blur="getalls(item)"
              ></el-input>%
              </div>
            </el-checkbox>
            <span
              v-if="item.boxshows"
              style="padding-left:80px; font-weight:700; font-size:16px; float:right;"
              @click="openA(item)"
            >{{item.boxshowsSelect?'展开':'收起'}}<i :class="c2? 'el-icon-arrow-down':'el-icon-arrow-up'"></i></span>
            </div>
            <div class="mb10"></div>
            <div
              class="flex-item"
              :style="item.boxshowsSelect?'height:0;overflow:hidden':'height:auto'"
            >
             <div class="checkStyle">
              <el-checkbox
                v-for="(itemB,indexB) in item.supplierList"
                :label="itemB.shortName"
                :value="itemB.id"
                :key="indexB"
                v-model="itemB.select"
                @change="selectItem(item,itemB)"
              >
               <span>{{itemB.shortName}}</span>
                <el-input
                  v-model="itemB.content"
                  style="width:200px;"
                  :disabled="!itemB.select"
                  @blur="getallB(itemB)"
                ></el-input>%
              </el-checkbox>
             </div>
            </div>
            <div class="mb50"></div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="dd">
            订单取消时间:
            <el-input v-model="form.orderCancelDuration" style="width:200px;"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="footer">
            <el-button  @click="back()">取消</el-button>
            <el-button type="primary" class="bg" @click="submit()">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      c1:true,
      c2:true,    
      input: '',
      headers: '',
      fleg: false,
      checkAll: false,
      leave: true,
      api: false,
      isIndeterminate: true,
      // 项目机构下拉框
      selectForm: {
        projectName: '',
        orgName: ''
      },
      props: {
        multiple: true
      },
      projectOption: [], //项目下拉
      selecOption: [], //商品分类
      checkTable: [],
      arr: [],
      // 提交表单
      form: {
        id: '',
        premiumRate: {}, // 商品渠道
        deductionRate: {},
        lowestPrice: '',
        highestPrice: '',
        types: '',
        deductionType: true,
        orderCancelDuration: ''
      },
      type: Number(this.$route.query.type), // 根据type判断1新增，2修改，3查看
      disabledALL: Number(this.$route.query.type) === 3,
      allChannelSupply: [],
      allChannelSupplynew: [],
    }
  },
  watch: {
    'form.deductionType' () {
      console.log(this.form.deductionType)
    }
  },
  methods: {
    //  展开
      open(item) {
        item.boxshowsSelect = !item.boxshowsSelect
        if(item.boxshowsSelect == true){
          this.c1 = true
        }else{
          this.c1 = false
        }
      },
       openA(item) {
        item.boxshowsSelect = !item.boxshowsSelect
        if(item.boxshowsSelect == true){
          this.c2 = true
        }else{
          this.c2 = false
        }
      },
    // 查看项目配置
    info (id, status = '') {
      // if (status == 1) return this.$message.error('启用中的项目不可做修改')

      this.$ajax.info({
        id: this.$route.query.id
      }).then(res => {
        this.newProjects = true
        this.arr = res.map.arr
        this.selectForm.projectName = res.map.rule.projectName
        this.orgName = [{
          orgName: res.map.rule.orgName
        }]
        this.selectForm.orgName = res.map.rule.orgName
        this.form.lowestPrice = res.map.rule.lowestPrice
        this.form.id = res.map.rule.id
        this.form.highestPrice = res.map.rule.highestPrice
        this.form.deductionType = Number(res.map.rule.deductionType) === 1
        this.form.orderCancelDuration = res.map.rule.orderCancelDuration
        for (let k in res.map.rule.premiumRate) {
          // console.log(k)
          this.allChannelSupply.forEach(item => {
            // console.log(item)
            item.supplierList.forEach(itemA => {
            // console.log(itemA)

              // console.log(itemA.id,k)
              if (itemA.id === Number(k)) {
                itemA.select = true
                itemA.content = res.map.rule.premiumRate[k]
                // console.log(itemA.content)
              }
            })
          })
        }
        for (let k in res.map.rule.deductionRate) {
          this.allChannelSupplynew.forEach(item => {
            item.supplierList.forEach(itemA => {
              if (itemA.id === Number(k)) {
                itemA.select = true
                itemA.content = res.map.rule.deductionRate[k]
              }
            })
          })
        }
      })
    },
    //  父级
    selectAll (item) {
      // console.log(item)
      for (let index = 0; index < item.supplierList.length; index++) {
        const element = item.supplierList[index];
        if (item.select === true) {
          element.select = true
        } else {
          element.select = false
          item.content = ''
          element.content = ''
        }
      }
    },
    //  子级
    selectItem (item, itemA) {
      var num = 0
      for (let index = 0; index < item.supplierList.length; index++) {
        const element = item.supplierList[index];
        if (element.select == true) {
          num++
        } else {
          element.content = ''
        }
      }

      if (num === item.supplierList.length) {
        item.select = true
      } else {
        item.select = false
      }
    },
    getall (item) {
      var reg = ''
      if (!/^\-?\d*$/.test(item.content) || !(item.content +'')) return this.$message.error('请正确输入所选供应商的加价比例')
      if (item.select === true && item.content !== '') {
        for (let index = 0; index < item.supplierList.length; index++) {
          const element = item.supplierList[index];
          element.content = item.content
        }
      }
    },
 
    getallA (itemB) {
      var reg = ''
      if (!/^\-?\d*$/.test(itemB.content) || !(itemB.content +'')) return this.$message.error('请正确输入所选供应商的加价比例')
    },
    getalls (item) {
      var reg = ''
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(item.content)  || !(item.content +'')) return this.$message.error('请正确输入所选供应商的加价比例')
      if (item.select === true && item.content !== '') {
        for (let index = 0; index < item.supplierList.length; index++) {
          const element = item.supplierList[index];
          element.content = item.content
        }
      }
    },
    getallB (itemB) {
      var reg = ''
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(itemB.content) ||  !(itemB.content +'')) return this.$message.error('请正确输入所选供应商的加价比例')
    },
    
    getallChannelSupply () {
      this.$ajax.allChannelSupply().then(res => {
        console.log(res)
        //判断code是接口提供的code时再拿数据
        if (res.code === 0) {
          for (let index = 0; index < res.frontSupplierList.length; index++) {
            const item = res.frontSupplierList[index];
            this.$set(item, 'select', false)
            this.$set(item, 'content', '')
            for (let j = 0; j < item.supplierList.length; j++) {
              const itemA = item.supplierList[j]
              this.$set(itemA, 'select', false)
              this.$set(itemA, 'content', '')
              if (item.channel == '102') {
                this.$set(item, 'boxshows', true)
                this.$set(item, 'boxshowsSelect', true)
              } else {
                this.$set(item, 'boxshows', false)
              }
            }
          }
          this.allChannelSupply = res.frontSupplierList.slice(0, 2) //加价比例中的自有供应商不显示
          this.allChannelSupplynew = JSON.parse(JSON.stringify(res.frontSupplierList)) //深拷贝一份
          if (this.type == 1) {
      this.headers = '新增项目配置'
    } else if (this.type == 2) {
      this.info()
      this.headers = '修改项目配置'
    } else {
      this.info()
      this.headers = '查看项目配置'
    }
        }
        // select = true  content != ''
      })
    },
    // 查看项目配置

    // 获取项目名称下拉数据
    dictRuleList () {
      this.$ajax.dictRuleList(this.selectForm).then(res => {
        this.projectOption = res.list.map(item => {
          return {
            projectName: item.projectName,
            id: item.id
          }
        })
      })
    },

    // 获取一二级商品分类下拉接口
    getList () {
      this.$ajax.getList().then(res => {
        this.selecOption = res.list.map(item => {
          return {
            value: item.id,
            label: item.lableName,
            children: item.children.map(child => {
              return {
                value: child.id,
                label: child.catName
              }
            })
          }
        })
      })
    },
    // 表单提交
    submit () {
      // debugger
      if (!this.selectForm.projectName) {
        return this.$message.error('请选择项目名')
      }
      if (this.form.lowestPrice != '0' && !this.form.lowestPrice) {
        return this.$message.error('请输入最低价')
      }
      if (!this.form.highestPrice) return this.$message.error('请输入最高价')

      var num = 0,
        supplyNum = 0
      this.allChannelSupply.map(item => {
        item.supplierList.forEach(itemA => {
          if (itemA.select === true) {
            if (itemA.content === '') {
              num++
            }
          }
        })

      })
      this.allChannelSupplynew.map(item => {
        item.supplierList.forEach(itemA => {
          if (itemA.select === true) {
            if (itemA.content === '') {
              num++
            }
          }
        })
      })
      if (num > 0) {
        return this.$message.error('请输入所选供应商的加价比例')
      }
      if (!this.arr.length) return this.$message.error('请选择商品分类')

      for (let i = 0; i < this.allChannelSupply.length; i++) {
        const AA = this.allChannelSupply[i];
        for (let j = 0; j < AA.supplierList.length; j++) {
          const BB = AA.supplierList[j]
          if (BB.select === true) {
            this.form.premiumRate[BB.id] = Number(BB.content)
          }
        }

      }
      for (let i = 0; i < this.allChannelSupplynew.length; i++) {
        const AA = this.allChannelSupplynew[i];
        for (let j = 0; j < AA.supplierList.length; j++) {
          const BB = AA.supplierList[j]
          if (BB.select === true) {
            this.form.deductionRate[BB.id] = Number(BB.content)
          }
        }
      }

      if (this.form.deductionType === true || Number(this.form.deductionType) === 1) {
        var arr = Object.keys(this.form.deductionRate)
        if (arr.length === 0) {
          return this.$message.error('请至少设置一个渠道的扣点')
        }
      }
      
      this.form.deductionType = 1
      if (this.type == 1) {
        this.form.id = this.projectOption.filter(
          item => item.projectName === this.selectForm.projectName
        )[0].id
      }
      this.form.types = this.arr.map(item => item[1]).join(',')
      this.form.lowestPrice = Number(this.form.lowestPrice)
      this.$ajax[this.type == 1 ? 'addConfig' : 'updateConfig'](this.form).then(
        res => {
          this.$message.success(`${this.type == 1 ? '新增' : '修改'}成功`)
        }
      )
    },
    back () {
      // this.$router.back(-1)
      this.$router.push({
        path: '/configuration'
      })
    }
  },
  created () {
    this.dictRuleList()
    this.getList()
    this.getallChannelSupply()
    this.type = this.$route.query.type
    
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-input--medium .el-input__inner {
  text-align: center;
}

.title {
  display: inline-block;
  margin-right: 5px;
  font-size: 18px;
  border-left: 3px solid #17b3a3;
}
.content {
  .staff-head {
    margin-top: 30px;
    font-size: 18px;
    padding-left: 10px;
    color: #3c3c3c;
    position: relative;
    height: 16px;
    line-height: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .items {
    margin-left: -30px;
    position: relative;
    .order{
      margin-left: 80px;
    }
    .AA{
      font-size: 16px;
      font-weight: 700;
      margin-right: 30px;
    }
    .styleOne{
      display: inline;
    }
    .checkStyle{
     display: flex;
     flex-wrap: wrap;
     width: 1100px;
     .el-checkbox{
       font-weight: 700;
       width:335px;
       display: flex;
       justify-content: space-between;
     }
    }

    .flex-item {
      display: flex;
      width: 1200px;
      margin-left: 20px;
      flex-wrap: wrap;
      
      .el-checkbox {
        margin: 30px 70px 5px 100px;
      }

      .el-input {
        margin: -10px auto 0px;
      }
    }
  }
  .dd {
    font-weight: 700;
  }
  .footer {
    display: flex;
    justify-content: center;

    .bg {
      background-color: rgba(0, 191, 191, 1);
      margin-left: 60px;
    }
  }
}

.item {
  margin: 4px;
}
</style>