// 防抖节流函数

export const debounce = (fn, delay = 500) => {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export const throttle = (fn, delay = 200) => {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall < delay) return
    lastCall = now
    fn.apply(this, args)
  }
}


