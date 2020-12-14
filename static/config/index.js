/**
 * 开发环境
 */
;
(function () {
  window.SITE_CONFIG = {}
  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = '/'
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.50.40:8081/ybt-supply/';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.50.68:8081/ybt-supply/';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
