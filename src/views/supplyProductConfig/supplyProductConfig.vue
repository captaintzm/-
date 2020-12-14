<template>
  <div class="supplyProductConfig">
    <span class="title">&nbsp;商品管理列表</span>
    <el-button size="mini" type="success" @click="$router.push('addSupplierProduct'); $route.meta.title='新增商品'" v-if="$qx('supplysupplier:product:save')">新增</el-button>
    <div style="margin-bottom: 20px;">
      <el-button @click="updateSupplyProductStatus(ids,4,true)" size="mini" type="primary">批量下架</el-button>
      <el-button
        @click="approveSupplyProductInfo(ids,true)"
        v-if="$qx('supplysupplier:product:approve')"
        size="mini"
        type="primary"
      >批量审核</el-button>
    </div>
    <div class="search">
      <el-form :inline="true" :model="pages" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="pages.itemName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="pages.itemCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="itemCode" style="margin-right: 50px;">
            <el-cascader
              :props="props"
              v-model="pages.cateList"
              size="mini"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="上下架状态">
          <el-select v-model="pages.operStatus" size="mini">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="0"></el-option>
            <el-option label="上架" value="3"></el-option>
            <el-option label="下架" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退换货类型">
          <el-select v-model="pages.refundStatus" size="mini">
            <el-option label="全部" value=""></el-option>
            <el-option label="支持退换货" value="1"></el-option>
            <el-option label="不持支退换货" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
          <el-button type="warning" @click="pages = {},onSubmit()" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" stripe :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="itemName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="itemCode" label="商品编码" align="center"></el-table-column>
      <el-table-column prop="itemName" label="商品图片" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.photo" target="_blank"><img :src="scope.row.photo" style="display:inline-block; width: 80px; height: 80px;"></a>
        </template>
      </el-table-column>
      <el-table-column prop="markPrice" label="市场价" align="center"></el-table-column>
      <el-table-column prop="supplyPrice" label="供应价" align="center"></el-table-column>
      <el-table-column prop="stockNum" label="库存" align="center"></el-table-column>
      <el-table-column prop="auditTimes" label="审核次数" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.operStatus == 0 ? '待审核' : scope.row.operStatus == 5 ? '审核未通过' : scope.row.operStatus == 3 ? '上架' : '下架'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <!-- 运营人员权限 -->
          <div v-if="$qx('supplysupplier:product:approve')">
            <el-button
              type="text"
              size
              @click="approveSupplyProductInfo([scope.row])"
              v-if="scope.row.operStatus == 0 "
            >审核</el-button>
            <el-button type="text" size @click="watchDetail(scope.row.id,1)">详情</el-button>
          </div>
          <!-- 供应商权限 -->
          <div v-else>
            <el-button
              v-if="scope.row.operStatus == 3"
              type="text"
              size
              @click="updateSupplyProductStatus([scope.row],4)"
            >下架</el-button>
            <el-button
              v-if="scope.row.operStatus == 4"
              type="text"
              size
              @click="updateSupplyProductStatus([scope.row],3)"
            >上架</el-button>
            <el-button
              v-if="scope.row.operStatus != 3"
              type="text"
              size
              @click="updateSupplyProductPrice(scope.row.id)"
            >改价</el-button>
            <el-button
              v-if="scope.row.operStatus != 3"
              type="text"
              size
              @click="watchDetail(scope.row.id,2)"
            >修改</el-button>
            <el-button type="text" size @click="watchDetail(scope.row.id,1)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <page-common url="querySupplyProductPageList" @dataList="getDataList" ref="page" :pages="pages"></page-common>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: { pageCommon },
  data () {
    return {
      tableData: [],
      ids: [],
      pages: {},
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
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
              ? { cateLable: node.data.value }
              : { cateLevel: node.data.value }
          return this.$ajax[url](obj).then(res => {
            resolve(
              // eslint-disable-next-line no-eval
              eval(node.level === 0 ? 'res.lableList' : 'res.page.list').map(
                item => {
                  return {
                    label: node.level === 0 ? item.lableName : item.name,
                    value: item.id,
                    leaf: node.level === 2
                  }
                }
              )
            )
          })
        }
      }
    }
  },
  watch: {
    newProjects (n, v) {
      if (!n) {
        this.form.cat_name = ''
        this.form.status = '1'
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 搜索功能
    onSubmit () {
      this.$nextTick(() => {
        this.$refs.page.resetList()
      })
    },
    // 改价
    updateSupplyProductPrice (id) {
      this.$prompt('请输入供应价', '修改供应价', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          // 占位
          var reg = /^((0|[1-9])\d*)(\.\d+)?$/
          if (!reg.test(value)) return this.$message.error('改价失败:请输入正确的价格')
          this.$ajax
            .updateSupplyProductPrice({ id, supplyPrice: value })
            .then(res => {
              this.$message.success('修改供应价成功')
              this.$refs.page.resetList()
            })
        })
        .catch(res => {})
    },
    // 上下架接口
    updateSupplyProductStatus (idArr, operStatus, all = false) {
      let ids = idArr
        .filter(item => item.operStatus == (operStatus == 3 ? 4 : 3))
        .map(item => item.id)
      if (!ids.length) {
        return this.$message.error(
          `请选择需要${operStatus == 4 ? '下' : '上'}架的商品`
        )
      }
      this.$confirm(
        `确定${all ? '批量' : ''}${
          operStatus == 3 ? '上' : '下'
        }架所选商品吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$ajax.updateSupplyProductStatus({ ids, operStatus }).then(res => {
          this.$message.success(`${all ? '批量' : ''}${
          operStatus == 3 ? '上' : '下'
        }架成功`)
          this.$refs.page.resetList()
        })
      })
    },
    // 审核接口
    approveSupplyProductInfo (idArr, all = false) {
      // all为true是批量审核操作
      console.log(idArr)
      let ids = idArr.filter(item => item.operStatus == 0).map(item => item.id)
      if (!ids.length) return this.$message.error('请选择需要审核的商品')
      this.$confirm(`确定${all ? '批量' : ''}审核通过所选商品吗？`, '提示', {
        confirmButtonText: '通过',
        cancelButtonText: '不通过',
        type: 'warning'
      }).then(() => {
        this.$ajax.approveSupplyProductInfo({ ids }).then(res => {
          this.$message.success(`${all ? '批量' : ''}审核成功`)
          this.$refs.page.resetList()
        })
      }).catch(() => {
        this.$ajax.refuseSupplyProductInfo({ ids }).then(res => {
          this.$message.success(`${all ? '批量' : ''}审核成功`)
          this.$refs.page.resetList()
        })
      })
    },
    // 关闭弹窗
    closeDialog () {
      this.newProjects = false
    },
    // 获取数据
    getDataList (res) {
      for (let index = 0; index < res.page.list.length; index++) {
        const element = res.page.list[index]
        element.markPrice = parseFloat(element.markPrice).toFixed(2)
        element.supplyPrice = parseFloat(element.supplyPrice).toFixed(2)
      }
      this.tableData = res.page.list
    },
    // 全选反选
    handleSelectionChange (val) {
      this.ids = val
    },
    watchDetail (id, type) {
      // type 1 查看详情 2 修改
      this.$router.push({ name: 'addSupplierProduct', query: { id } })
      this.$route.meta.title = '商品详情'
      sessionStorage.setItem('type', type)
    }
  }
}
</script>

<style lang="scss">
.supplyProductConfig {
  .title {
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 30px;
    font-size: 18px;
    border-left: 3px solid #17b3a3;
  }
  .dialog-footer {
    text-align: center;
  }
  .addDialog {
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
      .label {
        display: inline-block;
        margin-right: 10px;
      }
      padding-left: 25%;
      margin-bottom: 20px;
      i {
        display: inline-block;
        margin-right: 5px;
        color: red;
      }
    }
  }
}
</style>
