import axios from 'axios'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
const baseURL = `${process.env.VUE_APP_API_URL}api/`

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
export const axiosHelper = axios.create({
  baseURL,
  headers: {
    withCredentials: true,
    Accept: 'application/json'
  }
})

const onRequest = (config) => {
  config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`
  if ((
    config.method === 'post' ||
    config.method === 'put' ||
    config.method === 'delete') &&
    !Cookies.get('XSRF-TOKEN')) {
    axiosHelper.get('sanctum/csrf-cookie')
  }
  return config
}

axiosHelper.interceptors.request.use(onRequest, null)

export default axiosHelper

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})
