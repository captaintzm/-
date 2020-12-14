<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>

      <el-form-item label="角色类型" v-if="!dataForm.id">
        <!-- <el-input v-model="ordername" placeholder="归属机构"></el-input> -->
        <el-select v-model="style" placeholder="请选择" class="el-selects" :style="{'width':'350px'}">
            <el-option
            v-for="item in option"
            :key="item.id"
            :label="item.siteName"
            :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox="">
        </el-tree>
        <!-- <div class="shouquan">
          <div class="shouquan-tab">
            <div class="ites ites-muk">模块</div>
            <div class="ites ites-ym">页面</div>
            <div class="ites ites-gn">权限功能点</div>
          </div>
          <div class="shouquan-conter">
            <div class="conter-one">人员管理</div>
            <div class="conter-tow">
              <div v-for="(item,index) in menuList" :key="index" class="itemsr">
                <div class="itemsr-name">
                  {{item.name}}
                </div>
                <div class="col-r">
                  <div v-for="(items,indexs) in item.children" :key="indexs" class="itemssan">
                    {{items.name}}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        style: 1,
        option: [
          {
            siteName: '公司员工',
            id: 1
          },
          {
            siteName: '线上供应商',
            id: 2
          }
        ],
        xitong: '系统设置',
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          orgId: '',
          remark: ''
        },
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },

      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/ybt-supply/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
          console.log(this.menuList)
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/ybt-supply/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName
                this.dataForm.remark = data.role.remark
                this.dataForm.orgId = data.role.orgId
                var idx = data.role.menuIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/ybt-supply/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'orgId': this.dataForm.orgId,
                'remark': this.dataForm.remark,
                'type': this.style,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shouquan-tab{
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    background-color: #ffffff;
    .ites{
      width: 30%;
      background-color: #ffffff;
      border: 1px solid #cccccc;
      box-sizing:border-box;
      text-align: center;
    }
    .ites-muk{
      width: 20%;
    }
    .ites-ym{
      width: 20%;
    }
    .ites-gn{
      width: 60%
    }
  }
  .shouquan-conter{
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    background-color: #ffffff;
    .conter-one{
      width: 20%;
      background-color: #ffffff;
      border: 1px solid #cccccc;
      box-sizing:border-box;
      text-align: center;
    }
    .conter-tow{
      width: 80%;
      background-color: #ffffff;
      border: 1px solid #bda4a4;
      box-sizing:border-box;
      text-align: center;
      .itemsr{
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        border-bottom: 1px solid #cccccc;

        .itemsr-name{
          padding: 5px;
          border-right: 1px solid #cccccc;
          width: 26.5%;

        }
        .col-r {
          width: 80%;
          text-align: left;
          .itemssan{
            padding: 5px;
            display: inline-block;
            text-align: center;
          }
        }

      }

    }
  }
</style>
