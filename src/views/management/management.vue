<template>
  <div class="management">
    <h4 class="crumbs">
      当前分类:
      <span
        v-for="(item,index) in Crumbs"
        :key="index"
      >{{item}}{{index+1 == Crumbs.length ? '' : '>'}}</span>
    </h4>
    <div class="content">
      <el-tree
        :props="props"
        class="tree"
        @node-click="handleNodeClick"
        style="width: 200px; height: 730px;overflow-y:auto; "
        lazy
        :load="loadNode"
        :expand-on-click-node="false"
        ref="tree"
      ></el-tree>
      <div style="width: 900px;margin-left:80px;">
        <span class="title">&nbsp;分类管理</span>
        <el-button size="mini" type="success" @click="add" style="margin-bottom: 20px;">新增</el-button>
        <el-table
          :data="tableData"
          :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}"
        >
          <el-table-column prop="id" label="编号" align="left"></el-table-column>
          <el-table-column prop="name" label="分类名称" align="left"></el-table-column>
          <el-table-column prop="name" label="渠道分类" align="left" width="200px" v-if="index === 2">
            <template slot-scope="scope">
              <p v-if="scope.row.jdStr" style="text-align: left;">
                京东:
                <span>{{scope.row.jdStr && scope.row.jdStr}}</span>
              </p>
              <p v-if="scope.row.snStr" style="text-align: left;">
                苏宁:
                <span>{{scope.row.snStr && scope.row.snStr}}</span>
              </p>
              <p v-if="scope.row.yxStr" style="text-align: left;">
                严选:
                <span>{{scope.row.yxStr && scope.row.yxStr}}</span>
              </p>
              <p v-if="scope.row.xmStr" style="text-align: left;">
                小米:
                <span>{{scope.row.xmStr && scope.row.xmStr}}</span>
              </p>
              <p v-if="scope.row.virtualStr" style="text-align: left;">
                虚拟商品:
                <span>{{scope.row.virtualStr && scope.row.virtualStr}}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="pname" label="上级分类" align="left"></el-table-column>
          <el-table-column prop="sass" label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="text" @click="modifyScope(scope.row)">修改</el-button>
              <el-button type="text" @click="deleteScope(scope.row)">删除</el-button>
              <el-button
                type="text"
                @click="relationFc(scope.row)"
                v-if="scope.row.isRelevance == 1"
              >关联分类</el-button>
            </template>
          </el-table-column>
        </el-table>
        <page-common
          :url="url"
          @dataList="getDataList"
          :createdFlag="false"
          ref="page"
          :pages="lableName"
        ></page-common>
      </div>
    </div>
    <el-dialog
      :title="(addorupdateFlag ? '新增' : '修改') + '商品分类'"
      :visible.sync="newProjects"
      class="addDialog"
    >
      <p>
        <span>
          <i>*</i>父分类
        </span>
        <el-input v-model="form.pname" autocomplete="off" style="width: 50%;" disabled></el-input>
      </p>
      <p>
        <span>
          <i>*</i>分类名称
        </span>
        <el-input v-model="form.cat_name" autocomplete="off" style="width: 50%;"></el-input>
      </p>
      <p>
        <span>排序</span>
        <el-input v-model="form.sort" autocomplete="off" style="width: 50%;"></el-input>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="newProjects = false,form.cat_name = '',form.sort = '',updateFlag = false"
        >取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="关联渠道分类" :visible.sync="relationDialog" class="relationDialog" width="40%">
      <el-tabs type="card">
        <el-tab-pane label="京东">
          <p>提示:运营人员须选择渠道的三级分类和平台标准分类进行关联!</p>
          <el-cascader  :props="{ multiple: true}" collapse-tags :options="arr1List" v-model="arr1" style="margin-top: 20px;"></el-cascader>
        </el-tab-pane>
        <el-tab-pane label="苏宁">
          <p>提示:运营人员须选择渠道的三级分类和平台标准分类进行关联!</p>
          <el-cascader :props="{ multiple: true}" collapse-tags :options="arr3List" v-model="arr3" style="margin-top: 20px;"></el-cascader>
        </el-tab-pane>
        <el-tab-pane label="严选">
          <p>提示:运营人员须选择渠道的三级分类和平台标准分类进行关联!</p>
          <el-cascader :props="{ multiple: true}" collapse-tags :options="arr4List" v-model="arr4" style="margin-top: 20px;"></el-cascader>
        </el-tab-pane>
        <el-tab-pane label="虚拟商品">
          <p>提示:运营人员须选择渠道的三级分类和平台标准分类进行关联!</p>
          <el-cascader :props="{ multiple: true}" collapse-tags :options="arr7List" v-model="arr7" style="margin-top: 20px;"></el-cascader>
        </el-tab-pane>
        <el-tab-pane label="小米优选">
          <p>提示:运营人员须选择渠道的三级分类和平台标准分类进行关联!</p>
          <el-cascader :props="{ multiple: true}" collapse-tags :options="arr10List" v-model="arr10" style="margin-top: 20px;"></el-cascader>
        </el-tab-pane>
      </el-tabs>
      <div class="btnDiv" style="margin-top: 40px;">
        <el-button @click="relationDialogClose">取 消</el-button>
        <el-button type="primary" @click="relationSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  name: 'management',
  components: { pageCommon },
  data () {
    return {
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      count: 1,
      tableData: [],
      // 新增项目
      newProjects: false,
      // 关联分类
      relationDialog: false,
      form: {
        pname: '',
        type: '',
        cat_name: '',
        sort: '',
        cat_pid: ''
      },
      page: 1,
      limit: 10,
      total: 0,
      url: '',
      lableName: {},
      Crumbs: [],
      updateFlag: false,
      // 新增为true,修改为false
      addorupdateFlag: null,
      rowId: '',
      fc: '',
      labelData: [],
      upDateId: '',
      // 1京东 3苏宁 4严选
      arr1: [],
      arr3: [],
      arr4: [],
      arr7: [],
      arr10: [],
      arr1List: [],
      arr3List: [],
      arr4List: [],
      arr7List: [],
      arr10List: [],
      relationId: '', // 标准分类（记录关联）
      index: '' // 当前点击分类
    }
  },
  created () {
    this.queryJsonJd()
    this.queryJsonSn()
    this.queryJsonYx()
    this.queryJsonVirtual()
    this.queryJsonXM()
  },
  methods: {
    queryJsonJd () {
      this.$ajax.queryJsonJd().then(res => {
        this.arr1List = JSON.parse(res.json)
      })
    },
    queryJsonVirtual () {
      this.$ajax.queryJsonVirtual().then(res => {
        console.log(res)
        this.arr7List = JSON.parse(res.json)
      })
    },
    queryJsonSn () {
      this.$ajax.queryJsonSn().then(res => {
        this.arr3List = JSON.parse(res.json)
      })
    },
    queryJsonYx () {
      this.$ajax.queryJsonYx().then(res => {
        this.arr4List = JSON.parse(res.json)
      })
    },
    queryJsonXM () {
      this.$ajax.queryJsonXM().then(res => {
        this.arr10List = JSON.parse(res.json)
      })
    },
    // 点击关联分类事件
    relationFc (row) {
      console.log(row)
      this.arr1 = row.jdArr
      this.arr3 = row.snArr
      this.arr4 = row.yxArr
      this.arr7 = row.virtualArr
      this.arr10 = row.arr10List
      this.relationId = row.id
      this.relationDialog = true
    },
    relationDialogClose () {
      this.arr1 = []
      this.arr3 = []
      this.arr4 = []
      this.arr7 = []
      this.arr10 = []
      this.relationDialog = false
    },
    // 提交渠道分类
    relationSubmit () {
      let jdArr = this.arr1
      let snArr = this.arr3
      let yxArr = this.arr4
      let virtualArr = this.arr7
      let xmArr = this.arr10 === undefined ? [] : this.arr10
      this.$ajax
        .saveChannelRelation({ jdArr, snArr, yxArr, virtualArr, id: this.relationId, xmArr })
        .then(res => {
          this.$message.success('操作成功')
          this.relationDialogClose()
          this.$refs.page.resetList()
        })
    },
    // 删除分类
    deleteScope (row) {
      this.$confirm(`确定删除当前分类吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax
          .deleteCate({ type: this.form.type, ids: row.id })
          .then(res => {
            this.$message.success('删除成功')
            this.$refs.page.resetList()
            this.labelData.childNodes.forEach((item, index, arr) => {
              if (item.data.id === row.id) {
                arr.splice(index, 1)
              }
            })
          })
      })
    },
    // 表单提交
    submit () {
      let obj = JSON.parse(JSON.stringify(this.form))
      if (!this.addorupdateFlag) obj.id = this.rowId
      if (this.form.cat_name === '') {
        return this.$message.error('请填写分类名称')
      }
      this.$ajax[this.addorupdateFlag ? 'addLevel' : 'updateCate'](obj).then(
        res => {
          this.$message.success(`${this.addorupdateFlag ? '新增' : '修改'}成功`)
          if (this.addorupdateFlag) {
            this.$refs.tree.append(
              { name: this.form.cat_name, id: res.id, children: [] },
              this.labelData
            )
            this.labelData.childNodes.unshift(this.labelData.childNodes.pop())
          } else {
            this.labelData.childNodes.forEach((item, index, arr) => {
              if (item.data.id === this.rowId) {
                item.data.name = this.form.cat_name
              }
            })
          }
          this.form.cat_name = ''
          this.form.sort = ''
          this.$refs.page.resetList()
          this.newProjects = false
        }
      )
    },
    // 修改分类
    modifyScope (row) {
      this.rowId = row.id
      this.addorupdateFlag = false
      this.form.cat_name = row.name
      this.form.sort = row.sort
      this.newProjects = true
    },
    // 新增分类
    add () {
      this.addorupdateFlag = true
      if (this.form.pname === '') return this.$message.error('请先选择父分类')
      this.newProjects = true
    },
    getDataList (val) {
      this.tableData = val.page.list
    },
    handleNodeClick (node, data) {
      if (data.level === 3) return
      this.labelData = data
      this.index = data.level
      switch (data.level) {
        case 1:
          this.Crumbs = [data.data.name]
          break
        case 2:
          this.Crumbs = [data.parent.data.name, data.data.name]
          break
      }
      this.form.cat_pid = data.data.id
      this.form.pname = data.data.name
      this.form.type = data.level + 1
      this.lableName = {}
      this.url = data.level === 1 ? 'getLevelList' : 'getCatelList'
      this.lableName[data.level === 1 ? 'cateLable' : 'cateLevel'] =
        data.data.id
      setTimeout(() => {
        this.$refs.page.resetList()
      }, 100)
    },
    loadNode (node, resolve) {
      let url =
        node.level === 0
          ? 'getCateLableList'
          : node.level === 1
          ? 'getLevelList'
          : 'getCatelList'
      let obj =
        node.level === 0
          ? {}
          : node.level === 1
          ? { cateLable: node.data.id }
          : { cateLevel: node.data.id }
      return this.$ajax[url](obj).then(res => {
        resolve(
          // eslint-disable-next-line no-eval
          eval(node.level === 0 ? 'res.lableList' : 'res.page.list').map(
            item => {
              return {
                name: node.level === 0 ? item.lableName : item.name,
                id: item.id,
                leaf: node.level === 2
              }
            }
          )
        )
      })
    }
  }
}
</script>

<style lang="scss">
.management {
  .title {
    display: inline-block;
    margin-right: 5px;
    font-size: 18px;
    border-left: 3px solid #17b3a3;
  }
  .crumbs {
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 16px;
    font-weight: 600;
  }
  .content {
    display: flex;
  }
  .relationDialog {
    .el-dialog__header {
      background-color: #93e395;
      text-align: center;
      .el-dialog__title {
        color: #fff;
        font-size: 22px;
        font-weight: 500;
      }
    }
    p{
        color: #f56c6c;
        font-weight: 600;
        font-size: 15px;
      }
  }
  .addDialog {
    text-align: center;
    .el-dialog__header {
      background-color: #93e395;
      .el-dialog__title {
        color: #fff;
        font-size: 22px;
        font-weight: 500;
      }
    }
    p {
      margin-bottom: 20px;
      span {
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
    }
    .dialog-footer {
      text-align: center;
    }
  }
}
</style>
