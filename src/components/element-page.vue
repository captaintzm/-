<template>
  <div class="page">
    <div class="block" style="margin-top: 20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.page"
        :page-sizes="[10, 20, 50]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pages: {
      type: Object,
      default: () => ({})
    },
    url: {
      type: String,
      default: ''
    },
    // 页面加载自动触发接口 需行为触发需传递false
    createdFlag: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  created () {
    // 默认页面加载自动触发接口
    this.createdFlag && this.getDataList()
  },
  methods: {
    // 暴露重置页码重新获取数据方法
    resetList () {
      this.page['page'] = 1
      this.getDataList()
    },
    getDataList () {
      let obj = {}
      this.$ajax[this.url](Object.assign(obj, this.page, this.pages)).then(res => {
        this.total = res.page.totalCount
        this.$emit('dataList', res)
      })
    },
    handleSizeChange (val) {
      this.page['limit'] = val
      this.page['page'] = 1
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page['page'] = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
.page{
  .block{
    padding: 10px 0;
  }
}
</style>
