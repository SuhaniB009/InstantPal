import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // backend runs on 5000
})

export default api