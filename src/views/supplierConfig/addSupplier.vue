<template>
  <div class="addSupplier">
    <div class="information">
      <h4>供应商基本信息</h4>
      <p>
        <span>
          <i>*</i>供应商名称
        </span>
        <el-input
          style="width: 200px;"
          size="mini"
          v-model="form.supplyName"
          :disabled="watchFlag"
          placeholder="请输入供应商名称"
        ></el-input>
        <span>
          <i>*</i>简称
        </span>
        <el-input
          style="width: 200px;"
          size="mini"
          v-model="form.shortName"
          :disabled="watchFlag"
          placeholder="请输入简称"
        ></el-input>
      </p>
      <p>
        <span>
          <i>*</i>开户行
        </span>
        <el-input
          style="width: 200px;"
          size="mini"
          v-model="form.bankName"
          :disabled="watchFlag"
          placeholder="请输入开户行"
        ></el-input>
        <span>
          <i>*</i>银行账户
        </span>
        <el-input
          style="width: 200px;"
          size="mini"
          v-model="form.bankCard"
          :disabled="watchFlag"
          @keyup.stop.native="form.bankCard= form.bankCard.replace(/[^\d]/g,'')"
          @blur.stop="form.bankCard= form.bankCard.replace(/[^\d]/g,'')"
          placeholder="请输入银行账号"
        ></el-input>
      </p>
      <p>
        <span>
          <i>*</i>联系人
        </span>
        <el-input
          style="width: 200px;"
          size="mini"
          v-model="form.contractName"
          :disabled="watchFlag"
          placeholder="请输入联系人"
        ></el-input>
        <span>
          <i>*</i>联系电话
        </span>
        <el-input
          style="width: 200px;"
          size="mini"
          v-model="form.contractTel"
          :disabled="watchFlag"
          @keyup.stop.native="form.contractTel= form.contractTel.replace(/[^\.\d]/g,'')"
          @blur.stop="form.contractTel= form.contractTel.replace(/[^\d]/g,'')"
          placeholder="请输入联系电话"
        ></el-input>
      </p>
      <p>
        <span>备注</span>
        <el-input style="width: 200px;" size="mini" v-model="form.remarks" :disabled="watchFlag"></el-input>
      </p>
      <p>
        <span>资质证照</span>
        <el-upload
          :disabled="watchFlag"
          :action="$ajax.upload"
          list-type="picture-card"
          :headers="{token}"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          :file-list="fileList"
          style="display: inline-block;"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </p>
    </div>
    <div class="information">
      <h4>供应商账号信息</h4>
      <p>
        <input name="old-userName" type="text" style="display:none;" />
        <input name="old-pwd" type="password" style="display:none;" />
        <span>
          <i>*</i>管理员账号
        </span>
        <el-input
          style="width: 200px;"
          size="mini"
          v-model="form.username"
          :disabled="watchFlag"
          placeholder="请输入管理员账号"
        ></el-input>
        <span>
          <i>*</i>管理员密码
        </span>
        <el-input
          type="password"
          style="width: 200px;"
          size="mini"
          v-model="form.password"
          :disabled="watchFlag"
          placeholder="请输入管理员密码"
        ></el-input>
      </p>
      <p>
        <span>
          <i>*</i>账号有效期
        </span>
        <el-date-picker
            v-if="!$route.query.id"
            v-model="accountTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        <strong v-if="$route.query.id" style="display: inline-block;">
          {{form.beginTime}} - {{form.endTime}}
        </strong>
      </p>
    </div>
    <div class="footBtn" v-if="watchFlag">
      <el-button class="btn" @click="$router.replace('supplierConfig')">关闭</el-button>
    </div>
    <div class="footBtn" v-else>
      <el-button type="success" class="btn" @click="submit">确定</el-button>
      <el-button @click="$router.replace('/supplierConfig')">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: sessionStorage.getItem('token'),
      dialogImageUrl: '',
      accountTime: '',
      dialogVisible: false,
      disabled: false,
      form: {
        supplyName: '',
        shortName: '',
        bankName: '',
        bankCard: '',
        photo: [],
        contractName: '',
        contractTel: '',
        remarks: '',
        username: '',
        password: '',
        beginTime:'',
        endTime: '',
        beginTime: '',
        endTime: ''
      },
      formRule: {
        supplyName: '请输入供应商名称',
        shortName: '请输入供应商简称',
        bankName: '请输入开户行',
        bankCard: '请输入银行账户',
        contractName: '请输入联系人',
        contractTel: '请输入联系电话',
        username: '请输入管理员账号',
        password: '请输入管理员密码',

      },
      submitFlag: false,
      watchFlag: false,
      fileList: [],
      oldPassword: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      this.$route.meta.title = ''
      this.$ajax.getSupplierInfoById({ id: this.$route.query.id }).then(res => {
        this.fileList = res.supplySupplier.photo.map(item => {
          return {
            name: item.imageName,
            url: item.imageIndex
          }
        })
        for (let k in this.form) {
          if (res.supplySupplier[k]) {
            this.form[k] = res.supplySupplier[k]
          }
        }
        this.oldPassword = res.supplySupplier.password
        this.form.password = '********'
      })
      this.watchFlag =
        this.$route.query.id && this.$route.query.type === 'watch'
    }
  },
  mounted() {},
  methods: {
    uploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$message.error('图片上传失败')
        setTimeout(() => {
          fileList.pop()
        }, 500)
      } else {
        this.form.photo = fileList.map(item => {
          return {
            imageName: item.name,
            imageIndex: item.response ? item.response.url : item.url
          }
        })
      }
    },
    submit() {
      for (let k in this.form) {
        if (k === 'photo') continue
        if (!this.form[k].trim() && this.formRule[k]) {
          return this.$message.error(this.formRule[k])
        }
      }
      let reg = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      if (!reg.test(this.form.contractTel)) return this.$message.error('请输入正确的手机号')
      if (this.submitFlag) return this.$message.error('请勿重复提交')
      if( !this.accountTime && this.watchFlag ) return this.$message.error('请选择账号有效期')
      if (this.$route.query.id) this.form.id = this.$route.query.id
      if (this.form.password === '********') {
        this.form.password = this.oldPassword
      }
      if(!this.$route.query.id) {
         this.form.beginTime = this.formatDate( this.accountTime[0],'-','YMDHMS') 
      this.form.endTime = this.formatDate( this.accountTime[1],'-','YMDHMS') 
      }
      this.submitFlag = true
      this.$ajax
        .saveOrUpdateSupplierInfo(this.form)
        .then(res => {
          this.$message.success(
            `${this.$route.query.id ? '修改' : '新增'}供应商成功`
          )
          this.$router.replace('/supplierConfig')
          this.submitFlag = false
        })
        .catch(res => {
          this.submitFlag = false
        })
    },
    handleRemove(file, res) {
      this.fileList = res
      this.form.photo = this.fileList.map(item => {
        return {
          imageName: item.name,
          imageIndex: item.url
        }
      })
    }
  }
}
</script>

<style lang="scss">
.addSupplier {
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .information {
    p {
      margin-bottom: 15px;
      > span {
        width: 100px;
        text-align: right;
        margin-right: 5px;
        display: inline-block;
        i {
          color: red;
        }
      }
    }
  }
  .footBtn {
    margin-top: 50px;
    margin-left: 20px;
    .btn {
      margin-right: 20px;
    }
  }
}
</style>
