<template>
  <div class="addSupplierProduct">
    <h4 class="title">商品管理</h4>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"

    >
      <el-form
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        label-width="150px"

      >
        <el-form-item label="商品名称" prop="itemName" style="margin-right: 50px;">
          <el-col>
            <el-input style="width: 200px; " v-model="ruleForm.itemName" placeholder="请输入商品名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商品编码" prop="itemCode">
          <el-col>
            <el-input
              v-model="ruleForm.itemCode"
              placeholder="请输入商品编码"
               :disabled="type > 0"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <el-form-item label="商品图片" prop="photo">
        <el-upload
          class="avatar-uploader"
          :action="$ajax.upload"
          :show-file-list="false"
          :beforeUpload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :headers="upDataToken"
         
        >
          <img v-if="ruleForm.photo" :src="ruleForm.photo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form :inline="true" :model="ruleForm" :rules="rules" label-width="150px">
        <el-form-item label="商品分类" prop="itemCode" style="margin-right: 50px;">
          <el-col>
            <el-cascader
              :props="props"
              v-model="ruleForm.cateList"
              :placeholder="cateListPlaceholder.join('/')"
             
            ></el-cascader>
          </el-col>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandName">
          <el-col>
            <el-input v-model="ruleForm.brandName" placeholder="请输入商品品牌"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="ruleForm" :rules="rules" label-width="150px">
        <el-form-item label="市场价" prop="markPrice" style="margin-right: 50px;">
          <el-col>
            <el-input
              style="width: 200px;"
              v-model="ruleForm.markPrice"
              placeholder="请输入市场价"

              @keyup.stop.native="ruleForm.markPrice= ruleForm.markPrice.replace(/[^\.\d]/g,'')"
              @change.stop.native="ruleForm.markPrice= ruleForm.markPrice.replace(/[^\.\d]/g,'')"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="供应价" prop="supplyPrice">
          <el-col>
            <el-input
              v-model="ruleForm.supplyPrice"
              placeholder="请输入供应价"

              @keyup.stop.native="ruleForm.supplyPrice= ruleForm.supplyPrice.replace(/[^\.\d]/g,'')"
              @change.stop.native="ruleForm.supplyPrice= ruleForm.supplyPrice.replace(/[^\.\d]/g,'')"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <el-form
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        label-width="150px"

      >
        <el-form-item label="商品类型" prop="stockNum" style="margin-right: 50px;">
          <el-col>
            <el-radio v-model="ruleForm.type" label="1" style="margin-right: 5px;">实物商品</el-radio>
            <!-- <el-radio :disabled="type > 0" v-model="ruleForm.type" label="2">虚拟商品</el-radio> -->
          </el-col>
        </el-form-item>
        <el-form-item label="库存数量" prop="stockNum">
          <el-col>
            <el-input

              v-model="ruleForm.stockNum"
              placeholder="请输入库存数量"
              @keyup.stop.native="ruleForm.stockNum= ruleForm.stockNum.replace(/[^\.\d]/g,'')"
              @change.stop.native="ruleForm.stockNum= ruleForm.stockNum.replace(/[^\.\d]/g,'')"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <el-form-item label="商品详情" prop="content">
        <el-col :span="60">
          <quill-editor
            v-model="ruleForm.content"
            ref="myQuillEditor"
            :options="editorOption"

          ></quill-editor>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="备注">
        <el-col>
          <el-input
            style="width: 535px;"
            v-model="ruleForm.remarks"
          ></el-input>
        </el-col>
      </el-form-item> -->
      <h4 class="title">商品限制信息</h4>
      <el-form-item label="可售地区限制类型" prop="content">
        <el-radio
          v-model="ruleForm.enableAreaType"
          label="0"
          style="margin-right: 5px;" :disabled="type > 0"
          @click.native="Destruction(false)"
        >不限制</el-radio>
        <el-radio
          v-model="ruleForm.enableAreaType"
          label="1"
          style="margin-right: 5px;"
          @click.native="Destruction()" :disabled="type > 0"
        >只有某省份可售</el-radio>
        <el-radio
          v-model="ruleForm.enableAreaType"
          label="2"
          style="margin-right: 5px;"
          @click.native="Destruction()" :disabled="type > 0"
        >只有某市可售</el-radio>
        <el-radio
          v-model="ruleForm.enableAreaType"
          label="3"
          style="margin-right: 5px;"
          @click.native="Destruction()" :disabled="type > 0"
        >只有某区可售</el-radio>
      </el-form-item>
      <el-form-item label="可售地区选择" v-if="infoListFlag" prop="content">
        <el-cascader
          :props="infoList"
          @change="table"
          v-model="ruleForm.districtList"
          :placeholder="districtListPlaceholder.join('/')"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-form
      :inline="true"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
      :disabled="type > 0"
    >
      <el-form-item label="退换货" prop="content">
        <el-radio v-model="ruleForm.refundStatus" label="1" style="margin-right: 5px;">支持7天退换货</el-radio>
        <el-radio v-model="ruleForm.refundStatus" label="0">不支持7天退换货</el-radio>
      </el-form-item>
    </el-form>
    <div class="btnDiv">
      <el-button type="primary" @click="submit(3)">保存</el-button>
      <el-button @click="$router.push('supplyProductConfig')">取消</el-button>
    </div>
    <el-upload
      :action="$ajax.upload"
      :headers="upDataToken"
      list-type="picture-card"
      :on-success="handleAvatarSuccessHide"
      :beforeUpload="beforeAvatarUpload"
      style="display:none;"
      id="elUpLoad"
    ></el-upload>
  </div>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['image']
]
export default {
  data () {
    return {
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('#elUpLoad input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      //   表单数据
      ruleForm: {
        itemName: '',
        itemCode: '',
        photo: '',
        cateList: [],
        districtList: [],
        enableAreaType: '0',
        brandName: '',
        type: '1',
        markPrice: '',
        supplyPrice: '',
        stockNum: '',
        content: '',
        refundStatus: '1'
      },
      ruleFormProp: {
        itemName: '请填写商品名称',
        itemCode: '请填写商品编码',
        photo: '请上传商品图片',
        // 占位
        brandName: '请填写商品品牌',
        markPrice: '请填写市场价',
        supplyPrice: '请填写供应价',
        stockNum: '请填写库存数量',
        content: '请填写商品详情'
      },
      //   表单数据校验规则
      rules: {
        itemName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        itemCode: [
          { required: true, message: '请输入商品编号', trigger: 'blur' }
        ],
        photo: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        brandName: [
          { required: true, message: '请输入商品品牌', trigger: 'blur' }
        ],
        markPrice: [
          { required: true, message: '请输入市场价', trigger: 'blur' }
        ],
        supplyPrice: [
          { required: true, message: '请输入供应价', trigger: 'blur' }
        ],
        stockNum: [
          { required: true, message: '请输入库存数量', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入商品详情', trigger: 'blur' }
        ]
      },
      upDataToken: {
        token: sessionStorage.getItem('token')
      },
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
      },
      infoList: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          let obj = {
            type: node.level + 1,
            parentId: node.level === 0 ? 0 : node.data.value
          }
          return this.$ajax.getDistrictInfoList(obj).then(res => {
            resolve(
              res.districtList.map(item => {
                return {
                  label: item.name,
                  value: item.districtId,
                  leaf: node.level === this.ruleForm.enableAreaType - 1
                }
              })
            )
          })
        }
      },
      infoListFlag: false, // 清空可选地址数据
      type: sessionStorage.getItem('type') || '',
      cateListPlaceholder: ['请选择'],
      districtListPlaceholder: ['请选择']
    }
  },
  created () {
    if (this.type > 0) {
      this.$ajax
        .getProductInfoByProductId({ id: this.$route.query.id })
        .then(res => {
          for (let k in this.ruleForm) {
            this.ruleForm[k] = res.product[k]
          }
          this.ruleForm.id = res.product.id
          this.ruleForm.enableAreaType += ''
          this.ruleForm.refundStatus += ''
          this.ruleForm.type += ''
          if (this.ruleForm.enableAreaType > 0) {
            this.infoListFlag = true
          }
          this.ruleForm.cateList = []
          this.ruleForm.districtList = []
          this.cateListPlaceholder = []
          this.districtListPlaceholder = []
          res.product.cateNameList.forEach(item => {
            for (let k in item) {
              if (k) {
                this.ruleForm.cateList.push(k)
                this.cateListPlaceholder.push(item[k])
              }
            }
          })
          res.product.districtNameList.forEach(item => {
            for (let k in item) {
              if (k) {
                this.ruleForm.districtList.push(k)
                this.districtListPlaceholder.push(item[k])
              }
            }
          })
          this.table()
        })
    }
  },
  destroyed () {
    sessionStorage.removeItem('type')
  },
  methods: {
    // 切换可选地址
    Destruction (num = true) {
      if (this.type > 0) return
      this.infoListFlag = false
      this.ruleForm.districtList = []
      this.$nextTick(() => {
        if (num) this.infoListFlag = true
      })
    },
    // 地区选择完后将交付于后台的数据写成length为3的数组
    table () {
      for (let i = this.ruleForm.districtList.length; i < 3; i++) {
        this.ruleForm.districtList.push('')
      }
    },
    // 表单提交
    submit () {
      for (let k in this.ruleForm) {
        if (!(this.ruleForm[k] + '').trim() && this.ruleFormProp[k]) { return this.$message.error(this.ruleFormProp[k]) }
      }
      if (!this.ruleForm.cateList.length) { return this.$message.error('请选择商品分类') }
      if (
        this.ruleForm.enableAreaType > 0 &&
        !this.ruleForm.districtList.length
      ) { return this.$message.error('请选择可售地区') }
      this.table()
      this.ruleForm.markPrice = parseFloat(this.ruleForm.markPrice).toFixed(2)
      this.ruleForm.supplyPrice = parseFloat(this.ruleForm.supplyPrice).toFixed(2)
      this.ruleForm.id = this.$route.query.id || ''
      this.$ajax.saveOrUpdateSupplyProduct(this.ruleForm).then(res => {
        this.$message.success('操作成功')
        this.$router.push('supplyProductConfig')
      })
    },
    // 控制图片上传大小不超过2M
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message({
          message: '上传图片大小不能超过 2MB!',
          type: 'error'
        })
      }
      return isLt2M
    },
    handleAvatarSuccess (res, file) {
      this.ruleForm.photo = res.url
    },
    // 商品详情上传图片
    handleAvatarSuccessHide (res, file) {
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code == 0) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
    }
  }
}
</script>

<style lang="scss">
.addSupplierProduct {
  padding-bottom: 50px;
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .btnDiv {
    margin-top: 20px;
    margin-left: 50px;
  }
}
</style>
