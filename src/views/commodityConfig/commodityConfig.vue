<template>
  <div class="commodityConfig">
    <el-button size="mini" type="success" style="margin-bottom:30px;">新增</el-button>
    <el-button size="mini" type="success" style="margin-bottom:30px;">批量下架</el-button>
    <el-button size="mini" type="success" style="margin-bottom:30px;">批量审核</el-button>
    <div class="searchTab">
      <span>
        商品名称&nbsp;
        <el-input style="width: 200px;" size="mini"></el-input>
      </span>
      <span>
        商品编码&nbsp;
        <el-input style="width: 150px;" size="mini"></el-input>
      </span>
      <span>
        商品分类&nbsp;
        <el-cascader :props="props" size="mini"></el-cascader>
      </span>
      <span>
        状态&nbsp;
        <el-input style="width: 150px;" size="mini"></el-input>
      </span>
      <span>
        运费类型&nbsp;
        <el-select v-model="value" placeholder="请选择" size="mini">
          <el-option
            v-for="item in [{value:'',label:'全部'},{value:'all',label:'全国包邮'},{value:'all1',label:'非偏远地区包邮，偏远地区根据实际情况收取运费'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <span>
        退换货类型&nbsp;
        <el-select v-model="value" placeholder="请选择" size="mini">
          <el-option

            v-for="item in [{value:'',label:'全部'},{value:'all',label:'全国包邮'},{value:'all1',label:'非偏远地区包邮，偏远地区根据实际情况收取运费'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <el-button size="mini" type="primary" style="margin-left: 20px;">查询</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
    </el-table>
    <page-common url="querySupplyProductPageList" @dataList="getDataList"></page-common>
  </div>
</template>

<script>
import pageCommon from '../../components/element-page'
export default {
  components: { pageCommon },
  data () {
    return {
      value: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          if (node.level === 0) {
            return this.$ajax.getCateLableList().then(res => {
              resolve(
                res.lableList.map(item => {
                  return {
                    label: item.lableName,
                    value: item.id
                  }
                })
              )
            })
          }
          if (node.level === 1) {
            return this.$ajax
              .getLevelList({ cateLable: node.data.value })
              .then(res => {
                resolve(
                  res.page.list.map(item => {
                    return {
                      label: item.name,
                      value: item.id
                    }
                  })
                )
              })
          }
          if (node.level === 2) {
            return this.$ajax
              .getCatelList({ cateLevel: node.data.value })
              .then(res => {
                resolve(
                  res.page.list.map(item => {
                    return {
                      label: item.name,
                      value: item.id,
                      leaf: true
                    }
                  })
                )
              })
          }
        }
      }
    }
  },
  created () {
  },
  mounted () {},
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getDataList (res) {
      console.log(res)
    }
  }
}
</script>

<style lang="scss">
</style>
