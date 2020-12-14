<template>
  <div class="productGrab">
    <h4>批量添加SKU</h4>
    <div class="content">
      <el-tabs v-model="channel" type="card" class="tabs" @tab-click="changeTabs">
        <el-tab-pane label="京东" name="1">
          <el-input
            type="textarea"
            v-model="skus"
            :autosize="{ minRows: 16, maxRows: 16}"
            placeholder="每个SKU之间请用英文逗号隔开"
            class="textarea"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane label="苏宁" name="2">
          <el-input
            type="textarea"
            v-model="skus"
            :autosize="{ minRows: 16, maxRows: 16}"
            placeholder="每个SKU之间请用英文逗号隔开"
            class="textarea"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane label="严选" name="3">
          <el-input
            type="textarea"
            v-model="skus"
            :autosize="{ minRows: 16, maxRows: 16}"
            placeholder="每个SKU之间请用英文逗号隔开"
            class="textarea"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane label="齐心" name="4">
          <el-input
            type="textarea"
            v-model="skus"
            :autosize="{ minRows: 16, maxRows: 16}"
            placeholder="每个SKU之间请用英文逗号隔开"
            class="textarea"
          ></el-input>
        </el-tab-pane>
      </el-tabs>
      <p class="tips">
        <span>提示: 确认添加后才完成添加操作,否则无法导入</span>
        <el-button type="primary" @click="submit">确认添加</el-button>
      </p>
      <p class="totalBox" v-if="totalFlag">
        <i>总共导入: {{totalBox.totalCount}}</i>
        <i>导入成功: {{totalBox.successCount}}</i>
        <i>导入失败: {{totalBox.failCount}}</i>
        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
          :content="totalBox.failSkus.join(',')"
        >
          <el-button slot="reference" type="text" class="watchBtn">查看详情</el-button>
        </el-popover>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      channel: '1',
      skus: '',
      totalFlag: false,
      totalBox: {}
    }
  },
  methods: {
    changeTabs () {
      this.skus = ''
      this.totalBox = {}
      this.totalFlag = false
    },
    submit () {
      if (this.skus.split(',').length > 10) return this.$message.error('sku添加个数不能大于10条')
      this.$ajax
        .grabBySkus({ channel: Number(this.channel), skus: this.skus })
        .then(res => {
          this.totalBox = res.data
          this.totalFlag = true
        })
    }
  }
}
</script>
<style lang="scss">
.productGrab {
  .content {
    width: 600px;
  }
  h4 {
    border-left: 4px solid #019b69;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
    margin-bottom: 40px;
  }
  .tips {
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .totalBox {
    margin-top: 20px;
    line-height: 40px;
    .watchBtn {
      float: right;
    }
    i {
      margin-right: 50px;
    }
  }
}
</style>