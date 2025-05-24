// 这个api是为了上传反馈的

import http from '../utils/http'
export const postFeedback = (type, content, phoneNumber) => {
  return http.post('/user/my/feedback',
    { type, content, phoneNumber }
  )
}
