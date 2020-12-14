import httpRequest from '@/utils/httpRequest'
import {
  Message,
  Loading
} from 'element-ui'

// get请求
const getUserInfo = data => get('/ybt-supply/sys/user/info', false) // 获取用户菜单数据
// post请求
const upload = '/ybt-supply/sys/oss/upload' // 上传图片
const getList = data => post('/ybt-supply/cate/supplycatelable/getList', {}) // 获取一二级分类下拉框
const login = data => post('/ybt-supply/sys/login', data, 'data', false) // 登录
const logout = data => post('/ybt-supply/sys/logout', data) // 登出
const password = data => post('/ybt-supply/sys/password', data) // 修改密码
const save = data => post('/ybt-supply/supplyProjectOrganizationRule/save', data) // 新增项目
const list = data => post('/ybt-supply/supplyProjectOrganizationRule/list', data) // 项目列表
const info = data => post('/ybt-supply/supplyProjectOrganizationRule/info', data, 'params') // 查看项目配置
const update = data => post('/ybt-supply/supplyProjectOrganizationRule/update', data) // 修改项目配置
const enable = data => post('/ybt-supply/supplyProjectOrganizationRule/enable', data, 'params') // 修改项目配置
const firstEnable = data => post('/ybt-supply/cate/supplycatelable/enable', data, 'params') // 修改项目配置
const getCateLevelList = data => post('/ybt-supply/cate/supplycatelable/getCateLevelList', data) // 修改项目配置
const saveOrUpdateSupplierInfo = data => post('/ybt-supply/supplySupplier/saveOrUpdateSupplierInfo', data) // 修改项目配置
const supplySupplierList = data => post('/ybt-supply/supplySupplier/list', data) // 修改项目配置
const getSupplierInfoById = data => post('/ybt-supply/supplySupplier/getSupplierInfoById', data) // 根据id查看供应商信息
const addLevel = data => post('/ybt-supply/cate/supplycatelable/addLevel', data) // 新增商品分类
const updateCate = data => post('/ybt-supply/cate/supplycatelable/updateCate', data) // 修改商品分类
const deleteCate = data => post('/ybt-supply/cate/supplycatelable/deleteCate', data) // 删除商品分类
const getCateLableList = data => post('/ybt-supply/cate/supplycatelable/getCateLableList', data) // 获取一级分类
const supplycatelable = data => post('/ybt-supply/cate/supplycatelable/list', data) // 获取一级分类分页列表
const getLevelList = data => post('/ybt-supply/cate/supplycatelable/getLevelList', data) // 根据一级分类获取二级分类
const getCatelList = data => post('/ybt-supply/cate/supplycatelable/getCatelList', data) // 根据二级分类获取三级分类
const ruleList = data => post('/ybt-supply/supplyProjectOrganizationRule/ruleList', data) // 项目配置列表
const dictRuleList = data => post('/ybt-supply/supplyProjectOrganizationRule/dictRuleList', data) // 新增项目名和机构名下拉列表
const addConfig = data => post('/ybt-supply/supplyProjectOrganizationRule/addConfig', data) // 新增项目配置
const updateConfig = data => post('/ybt-supply/supplyProjectOrganizationRule/updateConfig', data) // 修改项目配置
const enableConfig = data => post('/ybt-supply/supplyProjectOrganizationRule/enableConfig', data, 'params') // 禁用启用项目配置
const getSupplierPostList = data => post('/ybt-supply/supplySupplier/getSupplierPostList', data) // 获取项目配置表格内容
const getUnConfigPostSupplierList = data => post('/ybt-supply/supplySupplier/getUnConfigPostSupplierList', {}) // 新增供应商运费配置时，获取供应商信息
const saveOrUpdateSupplierPost = data => post('/ybt-supply/supplySupplier/saveOrUpdateSupplierPost', data) // 新增供应商运费配置
const querySupplyProductPageList = data => post('/ybt-supply/supplySupplier/querySupplyProductPageList', data)
const saveOrUpdateSupplyProduct = data => post('/ybt-supply/supplySupplier/saveOrUpdateSupplyProduct', data) // 新增供应商商品
const getDistrictInfoList = data => post('/ybt-supply/district/getDistrictInfoList', data) // 获取联动地址
const approveSupplyProductInfo = data => post('/ybt-supply/supplySupplier/approveSupplyProductInfo', data) // 批量审核上架接口
const refuseSupplyProductInfo = data => post('/ybt-supply/supplySupplier/refuseSupplyProductInfo', data) // 批量审核上架接口
const updateSupplyProductStatus = data => post('/ybt-supply/supplySupplier/updateSupplyProductStatus', data) // 批量上下架
const updateSupplyProductPrice = data => post('/ybt-supply/supplySupplier/updateSupplyProductPrice', data) // 商品改价
const getProductInfoByProductId = data => post('/ybt-supply/supplySupplier/getProductInfoByProductId', data) // 根据商品ID获取商品信息
const getSupplierProductPriceLogList = data => post('/ybt-supply/supplySupplier/getSupplierProductPriceLogList', data) // 商品改价日志
const allSourceSupply = data => post('/ybt-supply/supplyProjectOrganizationRule/allSourceSupply', {}) // 查询供应商列表
const getLablelListBySource = data => post('/ybt-supply/generator/supplychannelclassification/getLablelListBySource', data) // 根据渠道获取一级分类(京东、苏宁、严选)
const getLevelListBySource = data => post('/ybt-supply/generator/supplychannelclassification/getLevelListBySource', data) // 根据一级分类id和渠道查找所有二级分类(京东、苏宁、严选)
const getCatelListBySource = data => post('/ybt-supply/generator/supplychannelclassification/getCatelListBySource', data) // 根据二级分类id和渠道查找所有三级分类(京东、苏宁、严选)
const saveChannelRelation = data => post('/ybt-supply/generator/supplychannelclassification/saveChannelRelation', data) // 根据二级分类id和渠道查找所有三级分类(京东、苏宁、严选)
const queryJsonJd = data => post('/ybt-supply/generator/supplychannelclassification/queryJsonJd', data) // 查询京东json文件
const queryJsonSn = data => post('/ybt-supply/generator/supplychannelclassification/queryJsonSn', data) // 查询苏宁json文件
const queryJsonYx = data => post('/ybt-supply/generator/supplychannelclassification/queryJsonYx', data) // 查询严选json文件
const queryJsonXM = data => post('/ybt-supply/generator/supplychannelclassification/queryJsonXM', data, 'params') // 查询小米json文件
const queryJsonVirtual = data => post('/ybt-supply/generator/supplychannelclassification/queryJsonVirtual', data) // 查询虚拟商品json文件
const grabBySkus = data => post('/ybt-supply/supply/supplyproduct/grabBySkus', data, 'params') // 查询虚拟商品json文件
const organizationrulelist = data => post('/ybt-supply/supply/organizationrule/list', data, 'params') // 查询三级机构列表
const organizationruleinfo = data => post('/ybt-supply/supply/organizationrule/info', data, 'params') // 查询三级机构列表
const organizationrulesave = data => post('/ybt-supply/supply/organizationrule/save', data, 'params') // 查询三级机构列表
const allChannelSupply = data  => post('/ybt-supply/supplyProjectOrganizationRule/allChannelSupply', data, 'params') // 查询供应商二级列表
const $api = {
  login,
  getUserInfo,
  logout,
  password,
  save,
  list,
  update,
  info,
  enable,
  getCateLevelList,
  saveOrUpdateSupplierInfo,
  supplySupplierList,
  getSupplierInfoById,
  upload,
  getCateLableList,
  getLevelList,
  getCatelList,
  addLevel,
  updateCate,
  deleteCate,
  ruleList,
  dictRuleList,
  getList,
  addConfig,
  updateConfig,
  enableConfig,
  supplycatelable,
  firstEnable,
  getSupplierPostList,
  getUnConfigPostSupplierList,
  saveOrUpdateSupplierPost,
  querySupplyProductPageList,
  getDistrictInfoList,
  saveOrUpdateSupplyProduct,
  approveSupplyProductInfo,
  getProductInfoByProductId,
  updateSupplyProductStatus,
  updateSupplyProductPrice,
  getSupplierProductPriceLogList,
  allSourceSupply,
  refuseSupplyProductInfo,
  getLablelListBySource,
  getLevelListBySource,
  getCatelListBySource,
  saveChannelRelation,
  queryJsonJd,
  queryJsonSn,
  queryJsonYx,
  queryJsonVirtual,
  grabBySkus,
  organizationrulelist,
  organizationruleinfo,
  organizationrulesave,
  queryJsonXM,
  allChannelSupply
}
// 封装post请求
function post(url, data, paramsForm = 'data', loading = true) {
  let loadingFlag = null
  if (loading) {
    loadingFlag = Loading.service({
      fullscreen: true
    })
  }
  let obj = {
    url: httpRequest.adornUrl(url),
    method: 'post'
  }
  obj[paramsForm] = httpRequest.adornData(data)
  return httpRequest(obj).then(res => {
    setTimeout(() => {
      loading && loadingFlag.close()
    }, 200)
    return new Promise((resolve, reject) => {
      if (res && res.data.code === 0) {
        resolve(res.data)
      } else {
        reject(res)
        Message({
          type: 'error',
          message: res.data.msg
        })
      }
    })
  })
}

// 封装get请求
function get(url, data = {}) {
  let loadingFlag = Loading.service({
    fullscreen: true
  })
  return httpRequest({
    url: httpRequest.adornUrl(url),
    method: 'get',
    params: httpRequest.adornParams(data)
  }).then(res => {
    return new Promise((resolve, reject) => {
      loadingFlag.close()
      if (res && res.data.code === 0) {
        resolve(res.data)
      } else {
        reject(res)
        Message({
          type: 'error',
          message: res.data.msg
        })
      }
    })
  })
}
export default $api