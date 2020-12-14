/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

export function checkToPrice(price) {
  if (price !== '') {
    var eg = /^((0|[1-9])\d*)(\.\d+)?$/
    if (eg.test(price) && price !== '') {
      price = parseFloat(price).toFixed(2)
    } else {
      price = ''
    }
    return price
  }
}

export function formatDate (date, code, type) {
  let time = new Date(date)
  let Year = time.getFullYear()
  let Month = time.getMonth() + 1 > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
  let Day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
  let Hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
  let Minute = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
  let Seconds = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()

  if (code === 'cn') {
    if (type === 'YMDHMS') {
      return `${Year}年${Month}月${Day}日 ${Hour}:${Minute}:${Seconds}`
    }
    return `${Year}年${Month}月${Day}日`
  } else {
    if (type === 'YMDHMS') {
      return `${Year}${code}${Month}${code}${Day} ${Hour}:${Minute}:${Seconds}`
    }
    return `${Year}${code}${Month}${code}${Day}`
  }
}