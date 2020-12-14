<template>
  <div class="supplierProductPriceLog">
    <span class="title">&nbsp;商品改价记录</span>
    <div class="search">
      <el-form :inline="true" :model="pages" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="pages.itemName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="商品编号">
          <el-input v-model="pages.itemCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="原供应价">
          <el-input v-model="pages.preSupplyPrice" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="现供应价">
          <el-input v-model="pages.sufSupplyPrice" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="修改人">
          <el-input v-model="pages.createName" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
          <el-button type="warning" @click="pages = {},onSubmit()" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'rgb(245, 247, 250)',color:'rgb(51, 51, 51);'}" style="width: 100%">
      <el-table-column prop="itemName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="itemCode" label="商品编码" align="center"></el-table-column>
      <el-table-column prop="sufMarkPrice" label="市场价" align="center"></el-table-column>
      <el-table-column prop="preSupplyPrice" label="原供应价" align="center"></el-table-column>
      <el-table-column prop="sufSupplyPrice" label="现供应价" align="center"></el-table-column>
      <el-table-column prop="stockNum" label="库存" align="center"></el-table-column>
      <el-table-column prop="createName" label="修改人" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
    </el-table>
    <page-common url="getSupplierProductPriceLogList" @dataList="getDataList" ref="page" :pages="pages"></page-common>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: { pageCommon },
  data () {
    return {
      pages: {},
      tableData: []
    }
  },
  mounted () {},
  methods: {
    onSubmit () {
      this.$nextTick(() => {
        this.$refs.page.resetList()
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
.supplierProductPriceLog{
    .title {
    display: inline-block;
    margin-bottom: 30px;
    margin-right: 5px;
    font-size: 18px;
    border-left: 3px solid #17b3a3;
  }
}

</style>
