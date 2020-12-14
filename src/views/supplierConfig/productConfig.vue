<template>
  <div class="supplierConfig">
    <div class="bodyheader">
      <span class="title">&nbsp;商品配置</span>
      <div class="searchTab">
        <span>
          机构名称&nbsp;
          <el-input style="width: 200px;" size="mini" v-model="formline.orgName"></el-input>
        </span>
        <el-button size="mini" type="primary" @click="resetSeach" style="margin-left: 20px;">查询</el-button>
        <!-- <el-button size="mini" type="success">新增</el-button> -->
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}"
    >
      <el-table-column prop="orgName" label="机构名称" align="center"></el-table-column>
      <el-table-column prop="selectAllSupplier" label="所需类型" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.selectAllSupplier == true?'全部供应商':scope.row.selectAllSupplier == null?'':'部分供应商'}}</template>
      </el-table-column>
      <el-table-column prop="ruleStatus" label="状态" align="center">
        <template slot-scope="scope">{{scope.row.ruleStatus == 1?'启用':'禁用'}}</template>
      </el-table-column>
      <el-table-column prop="sass" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="updata(scope.row)">配置</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            @click="$router.push({path:'addSupplier',query:{id:scope.row.id,type:'watch'}})"
          >详情</el-button>--> 
        </template>
      </el-table-column>
    </el-table>
    <page-common url="organizationrulelist" @dataList="getDataList" :pages="formline" ref="page"></page-common>

    <el-dialog
      :title="!updateFlag ? '商品配置' : '商品配置修改'"
      :visible.sync="newProjects"
      class="addDialog"
    >
      <el-form :model="form" label-width="110px">
        <el-form-item label="机构名称" align="left">
          <el-input v-model="form.orgName" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属类型" align="left">
          <el-radio-group v-model="form.selectAllSupplier" @change="getSelectAllSupplier">
            <el-radio label="1">全部供应商</el-radio>
            <el-radio label="0">部分供应商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择供应商" align="left">
          <el-checkbox-group v-model="checkList" @change="handleCheckedMallChange">
            <div
              v-for="(item,index) in checkTable "
              :key="index"
              style="padding-left: 5px;display:inline-block"
            >
              <el-checkbox :label="item.id" :key="item.id" :disabled="isAllCheck">{{item.name}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="所需分类" align="left">
          <el-cascader :options="selecOption" :props="props" collapse-tags v-model="arr"></el-cascader>
        </el-form-item>
        <el-form-item label="状态" align="left">
          <el-radio v-model="form.ruleStatus" label="1">启动</el-radio>
          <el-radio v-model="form.ruleStatus" label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="newProjects = false">取 消</el-button>
          <el-button type="primary" @click="addMainSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: { pageCommon },
  data () {
    return {
      type: 1,
      arr: [],
      tableData: [],
      newSupplier: false,
      props: { multiple: true },
      formline: {
        orgName: '',
      },
      form: {
        orgId: '',
        orgName: '',
        parentOrgId: '',
        selectAllSupplier: true,
        parentOrgName: '',
        ruleStatus: '1', // 启用状态（0：禁用 1：启用）
        supplyName: '',
        contractName: '',
        status: ''
      },
      projectOption: [],
      orgName: [],
      selecOption: [],
      checkList: [],
      checkTable: [],
      updateFlag: false,
      newProjects: false,
      parentOrgId: '',
      parentOrgName: '',
      supplyIds: [],
      id: '',
      isAllCheck: false
    }
  },
  created () {

  },
  watch: {
    checkList () {
      // console.log(this.checkList)
    },
    newProjects () {
      if (this.newProjects == false) {
        this.form.orgId = ''
        this.form.orgName = ''
        this.parentOrgId = ''
        this.parentOrgName = ''
        this.form.selectAllSupplier = true
        this.checkTable = []
        this.checkList = []
        this.selecOption = []
        this.arr = []
        this.isAllCheck = false
      }
    },

  },
  mounted () { },
  methods: {
    getSelectAllSupplier (val) {
      console.log(val)
      this.isAllCheck = false
      if (val == 1) {
        this.checkList = []
        var selecOption = this.checkTable.map(item => {
          this.checkList.push(item.id)
        })
        this.isAllCheck = true
        this.checkList = this.checkList.map(Number)
      } else {

      }
    },
    handleCheckedMallChange (value) {
      console.log(value, '单选')
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.mallList.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.mallList.length;
    },
    updata (item) {
      this.form.orgId = item.orgId
      this.form.orgName = item.orgName
      // this.form.ruleStatus = item.ruleStatus
      this.parentOrgId = item.parentOrgId
      this.parentOrgName = item.parentOrgName
      this.id = item.id
      this.newProjects = true
      this.$ajax.organizationruleinfo({
        id: this.id == null ? '' : this.id
      }).then(res => {
        this.form.selectAllSupplier = res.rule.selectAllSupplier == true ? '1' : '0'

        this.checkTable = res.rule.allSupplier
        this.checkList = res.rule.supplyIds == null ? [] : res.rule.supplyIds.split(",")
        if (this.checkList.length > 0) {
          this.checkList = this.checkList.map(Number)
          if (this.checkList.length == this.checkTable.length) {
            this.isAllCheck = true
          }
        }
        this.selecOption = res.rule.levels.map(item => {
          return {
            value: item.id,
            label: item.name,
            children: item.levels.map(child => {
              return {
                value: child.id,
                label: child.name
              }
            })
          }
        })
        this.arr = res.rule.selectTypes
        console.log(this.supplyIds)
      })
    },

    addMainSubmit () {
      console.log(this.arr)
      var types = ''
      this.arr.map(item => {
        types += item[1] + ','
      })
      types = types.substring(0, types.length - 1)
      this.$ajax.organizationrulesave({
        id: this.id,
        orgId: this.form.orgId,
        orgName: this.form.orgName,
        parentOrgId: this.parentOrgId,
        parentOrgName: this.parentOrgName,
        types: types,
        ruleStatus: this.form.ruleStatus,
        supplyIds: this.checkList.join(',')
      }).then(res => {
        if (res.code == 0) {
          this.newProjects = false
          this.$refs.page.resetList()
        }
      })

    },
    // 搜索功能
    resetSeach () {
      this.$refs.page.resetList()
    },
    // 获取列表数据
    getDataList (res) {
      //   this.$ajax.organizationrulelist(this.form.orgName).then(res => {
      //     this.orgName = res.page.list.map(item => {
      //     })
      //   })
      this.tableData = res.page.list
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
