<template>
  <div class="configuration">
    <span class="title">&nbsp;项目配置</span>
    <el-button
      size="mini"
      type="success"
      @click="goto()"
      style="margin-bottom:30px;"
      v-if="$qx('supplyprojectorganizationrule:saveConfig')"
    >新增</el-button>
    <div class="searchTab" style="margin-bottom: 30px;">
      <span>
        项目名称&nbsp;
        <el-input style="width: 200px;" size="mini" v-model="pages.projectName"></el-input>
      </span>
      <span>
        分销比例%&nbsp;
        <el-input
          style="width: 150px;"
          size="mini"
          v-model="pages.addPriceRule"
          @keyup.stop.native="pages.addPriceRule= pages.addPriceRule.replace(/[^\d]/g,'')"
          @blur="pages.addPriceRule= pages.addPriceRule.replace(/[^\d]/g,'')"
        ></el-input>
      </span>
      <span>
        机构名称&nbsp;
        <el-input style="width: 150px;" size="mini" v-model="pages.orgName"></el-input>
      </span>
      <span>
        <span>机构ID&nbsp;</span>
        <el-input style="width: 150px;" size="mini" v-model="pages.orgId"></el-input>
      </span>
      <el-button size="mini" type="primary" style="margin-left: 20px;" @click="searchList">查询</el-button>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}"
      style="width: 100%"
    >
      <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
      <el-table-column prop="id" label="项目ID" align="center"></el-table-column>
      <el-table-column prop="orgName" label="所属机构名称" align="center"></el-table-column>
      <el-table-column prop="orgId" label="机构ID" align="center"></el-table-column>
      <!-- <el-table-column prop="addPriceRule" label="加价比例(%)" align="center"></el-table-column> -->
      <el-table-column prop="lowestPrice" label="最低价" align="center"></el-table-column>
      <el-table-column prop="highestPrice" label="最高价" align="center"></el-table-column>
      <el-table-column prop="ruleStatus" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.ruleStatus == 0" style="color:#f56c6c;">禁用</span>
          <span v-else style="color:#67c23a;">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="info(scope.row,2);" v-if="$qx('supplyprojectorganizationrule:updateConfig')">修改</el-button>
          <el-button type="text" @click="info(scope.row,3);">查看</el-button>
          <el-button
            v-if="$qx('supplyprojectorganizationrule:enable')"
            type="text"
            @click="enable(scope.row)"
          >{{scope.row.ruleStatus != 0 ? '禁用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-common url="ruleList" @dataList="getDataList" ref="page" :pages="pages"></page-common>
    <el-dialog
      :title="type == 1 ? '新增项目配置' : type == 2 ? '修改项目配置' : '查看项目配置'"
      :visible.sync="newProjects"
      width="50%"
      class="addDialog"
      :close-on-click-modal="false"
    >
      <span class="label">项目名称</span>
      <el-select
        v-model="selectForm.projectName"
        placeholder="请选择"
        @change="orgNameList(selectForm.projectName)"
        size="mini"
        :disabled="type != 1"
      >
        <el-option
          v-for="item in projectOption"
          :key="item.projectName"
          :label="item.projectName"
          :value="item.projectName"
        ></el-option>
      </el-select>
      <span v-if="orgName.length > 0">
        <span class="label">所属机构名称</span>
        <el-select v-model="selectForm.orgName" placeholder="请选择" size="mini" :disabled="type != 1">
          <el-option
            v-for="item in orgName"
            :key="item.orgName"
            :label="item.orgName"
            :value="item.orgName"
          ></el-option>
        </el-select>
      </span>
      <br />
      <br />
      <div style="display: flex;">
        <span class="label">供应商</span>
        <el-checkbox-group v-model="checkList" :disabled="type > 2" style="flex:1;">
          <div v-for="(item,index) in checkTable " :key="index" style="padding-left: 5px;">
            <el-checkbox
              :label="item.supplyName"
              :value="item.id"
              style="width: 150px;"
              @click.native.stop="checked(item)"
            ></el-checkbox>
            <el-input
              style="width: 50%; margin-bottom: 10px;"
              size="mini"
              v-model="item.content"
              :disabled="item.disabled"
              :placeholder="`请输入${item.supplyName}的加价比例(%)`"
              maxlength="5"
              @keyup.stop.native="item.content= item.content.replace(/[^\-?\d]/g,'')"
              @change.stop.native="item.content= item.content.replace(/[^\-?\d]/g,'')"
            ></el-input>
          </div>
        </el-checkbox-group>
      </div>
      <p>
        <span class="label">价格区间</span>
        <el-input
          @keyup.stop.native="form.lowestPrice= form.lowestPrice.replace(/[^\.\d]/g,'')"
          @blur.stop.native="form.lowestPrice= form.lowestPrice.replace(/[^\.\d]/g,'')"
          size="mini"
          maxlength="8"
          placeholder="请输入最低价"
          style="width:150px;"
          v-model="form.lowestPrice"
          :disabled="type == 3"
        ></el-input>&nbsp;-&nbsp;
        <el-input
          @keyup.stop.native="form.highestPrice= form.highestPrice.replace(/[^\.\d]/g,'')"
          size="mini"
          maxlength="8"
          placeholder="请输入最高价"
          style="width:150px;"
          v-model="form.highestPrice"
          :disabled="type == 3"
        ></el-input>
      </p>
      <p>
        <span class="label">商品分类</span>
        <el-cascader :options="selecOption" :props="props" collapse-tags v-model="arr"></el-cascader>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">{{type == 3? '关闭' : '取消'}}</el-button>
        <el-button @click="submit()" v-if="type != 3">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: { pageCommon },
  data () {
    return {
      arr: [],
      pages: {
        projectName: '',
        orgName: '',
        orgId: '',
        addPriceRule: ''
      },
      props: { multiple: true },
      // 表格数据
      tableData: [],
      newProjects: false,
      // 项目机构下拉框
      selectForm: {
        projectName: '',
        orgName: ''
      },
      // 提交表单
      form: {
        id: '',
        premiumRate: {}, // 商品渠道
        lowestPrice: '',
        highestPrice: '',
        types: ''
      },
      projectOption: [],
      orgName: [],
      selecOption: [],
      checkList: [],
      checkTable: [],
      type: '', // 根据type判断1新增，2修改，3查看
      fistClick: true // 判断是否第一次点击
    }
  },
  watch: {
    newProjects (n, v) {
      if (!n) {
        this.closeDialog()
        this.orgName = []
        this.checkList = []
        this.checkTable = []
      }
    }
  },
  created () {
    this.dictRuleList()
    this.getList()
  },
  mounted () {},
  methods: {
    goto(){
      this.$router.push({
        path:'create',
        query:{
          type:1
        }
        })
      this.$route.meta.title='新增项目配置'
    },
    getCheckTable (callback) {
      this.$ajax.allSourceSupply().then(res => {
        this.checkTable = res.supplierList.map(item => {
          return {
            id: item.id,
            supplyName: item.supplyName,
            disabled: true,
            content: ''
          }
        })
        callback && callback()
      })
    },
    checked (item) {
      if (this.type > 2) return
      if (this.fistClick) {
        this.fistClick = false
        item.disabled = !item.disabled
        if (item.disabled) item.content = ''
        setTimeout(() => {
          this.fistClick = true
        }, 0)
      }
    },
    // 搜索查询
    searchList () {
      this.$refs.page.resetList()
    },
    // 禁用启用项目配置
    enable (row) {
      row.ruleStatus = Number(row.ruleStatus)
      this.$confirm(
        `确定${!Number(row.ruleStatus) ? '启' : '禁'}用当前项目配置吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$ajax
          .enableConfig({ id: row.id, ruleStatus: Number(!row.ruleStatus) })
          .then(res => {
            this.$message.success((!row.ruleStatus ? '启' : '禁') + '用成功')
            row.ruleStatus = !row.ruleStatus
          })
      })
    },
    // 查看项目配置
    info (val, type) {
      if(val.ruleStatus!=0)
      return this.$message.error('启用中的项目不可做修改')
      this.$router.push({
          path:'create',
          query:{
            type:type,
            id:val.id,
          }
      })

      if(type == 1){
        this.$route.meta.title='新增项目配置'
      }else if(type == 2){
        this.$route.meta.title='修改项目配置'
         
      }else if(type == 3){
        this.$route.meta.title='查看项目配置'
      }else{
      }
      // if (status == 1) return this.$message.error('启用中的项目不可做修改')
      // this.type = type
      // this.$ajax.info({ id }).then(res => {
      //   this.newProjects = true
      //   this.arr = res.map.arr
      //   this.selectForm.projectName = res.map.rule.projectName
      //   this.orgName = [{ orgName: res.map.rule.orgName }]
      //   this.selectForm.orgName = res.map.rule.orgName
      //   this.form.lowestPrice = res.map.rule.lowestPrice
      //   this.form.id = res.map.rule.id
      //   this.form.highestPrice = res.map.rule.highestPrice
      //   this.getCheckTable(() => {
      //     this.checkTable.forEach(item => {
      //       for (let k in res.map.rule.premiumRate) {
      //         if (item.id == k) {
      //           item.content = res.map.rule.premiumRate[k]
      //           item.disabled = false
      //           this.checkList.push(item.supplyName)
      //         }
      //       }
      //     })
      //   })
      // })
    },
    // 表单提交
    submit () {
      if (!this.selectForm.projectName) {
        return this.$message.error('请选择项目名')
      }
      if (!this.selectForm.orgName) return this.$message.error('请选择所属机构')
      if (this.form.lowestPrice != '0' && !this.form.lowestPrice) {
        return this.$message.error('请输入最低价')
      }
      if (!this.form.highestPrice) return this.$message.error('请输入最高价')
      if (!this.checkList.length) return this.$message.error('请选择供应商')
      this.checkList.forEach(item => {
        this.checkTable.forEach(value => {
          if (value.supplyName === item) { this.form.premiumRate[value.id] = value.content }
        })
      })
      
      for (let k in this.form.premiumRate) {
        if (!(this.form.premiumRate[k] + '') || !/^\-?\d*$/.test(this.form.premiumRate[k])) return this.$message.error('请正确输入所选供应商的加价比例')
      }
      if (!this.arr.length) return this.$message.error('请选择商品分类')
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
          this.closeDialog()
          this.$refs.page.resetList()
        }
      )
    },
    // 关闭dialog弹窗
    closeDialog () {
      this.newProjects = false
      this.$initObj(this.form)
      this.form.premiumRate = {}
      this.$initObj(this.selectForm)
      this.arr = []
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
    // 获取组织机构下拉数据
    orgNameList () {
      this.selectForm.orgName = ''
      this.orgName = []
      this.$ajax.dictRuleList(this.selectForm).then(res => {
        this.orgName = res.list.map(item => {
          return {
            orgName: item.orgName
          }
        })
        this.selectForm.orgName = this.orgName[0].orgName
      })
    },
    // 获取下拉项目选择数据
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
    // 获取列表数据
    getDataList (res) {
      this.tableData = res.page.list
    }
  }
}
</script>

<style lang="scss">
.configuration {
  .title {
    display: inline-block;
    margin-right: 5px;
    font-size: 18px;
    border-left: 3px solid #17b3a3;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
  .addDialog {
    .el-dialog__header {
      background-color: #93e395;
      text-align: center;
      .el-dialog__title {
        color: #fff;
        font-size: 22px;
        font-weight: 500;
      }
    }
    p {
      margin-top: 20px;
    }
    .label {
      display: inline-block;
      margin-right: 5px;
      text-align: right;
      vertical-align: middle;
      width: 100px;
      i {
        display: inline-block;
        margin-right: 5px;
        color: red;
      }
    }
    .dialog-footer {
      text-align: center;
    }
  }
}
</style>
