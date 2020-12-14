<template>
  <div class="site-wrapper">
    <div class="login clearfix">
      <div class="loginInfo">
        <div class="loginr">
          <h1></h1>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="userName">
              用户名
              <el-input v-model="dataForm.userName"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              密&nbsp;&nbsp;码
              <el-input v-model="dataForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="dataForm.checked">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <vue-particles
      style="height: 100%;"
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        userName: '',
        password: '',
        uuid: '',
        captcha: '',
        checked: false
      },
      dataRule: {
        userName: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      captchaPath: ''
    }
  },
  methods: {
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$ajax.login({username: this.dataForm.userName,
            password: this.dataForm.password,
            uuid: this.dataForm.uuid,
            captcha: this.dataForm.captcha}
          ).then(data => {
            this.$cookie.set('token', data.token)
            sessionStorage.setItem('token', data.token)
            localStorage.setItem('token', data.token)
            localStorage.setItem('siteUserInfo', JSON.stringify(data))
            this.$router.replace({ name: data.url })
            localStorage.setItem('token', data.token)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  .loginInfo {
    // width: 360px;
    height: 440px;
    margin: 0 auto;
    font-size: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(50%, -50%);
    z-index: 99999;

    .loginr {
      background: #ffffff;
      height: 440px;
      overflow: hidden;
      display: inline-block;
      width: 410px;
      padding: 0 70px;
      h1 {
        width: 211px;
        height: 40px;
        margin: 0 auto;
        margin-top: 30px;
        background: url(./img/logo.png) no-repeat center top;
        background-size: 100%;
        margin-bottom: 27px;
      }
      /deep/ .el-form-item {
        margin-bottom: 14px;
        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: rgba(68, 134, 244, 1);
          border-color: rgba(68, 134, 244, 1);
        }
        input:focus {
          border-color: rgba(68, 134, 244, 1);
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: rgba(68, 134, 244, 1);
        }
        .el-button--primary {
          margin-top: 10px;
          width: 270px;
          height: 48px;
          background: rgba(68, 134, 244, 1);
          box-shadow: 0px 4px 18px 0px rgba(0, 118, 255, 0.31);
          border-radius: 24px;
          font-size: 16px;
          color: #ffffff;
          text-align: center;
          display: inline-block;
        }
        .el-checkbox__input.is-focus .el-checkbox__inner {
          border-color: rgba(68, 134, 244, 1);
        }
      }
    }
  }
  #container {
    height: 400px;
  }
}
.site-wrapper {
  background: url(./img/bg.png) no-repeat center top;
  background-size: cover;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.login-captcha {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
