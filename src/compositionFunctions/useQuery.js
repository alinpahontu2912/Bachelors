import { EurostatData } from 'src/models/EurostatData'
import { axiosInstance } from '../boot/axios'
import { UserJob } from 'src/models/UserJob'
import { User } from 'src/models/User'
import { Requests } from 'src/models/Requests'
import useLocalStorage from './useLocalStorage'
import { Feedback } from 'src/models/Feedback'
const { retrieveUserData } = useLocalStorage()
const endpoint = 'http://localhost:7051/api'

axiosInstance.interceptors.request.use(function (config) {
  const userToken = retrieveUserData()
  if (userToken) {
    config.headers.Authorization = 'Bearer ' + userToken
  }
  return config
})

function createUserJobQuery() {
  const target = new URL(endpoint + '/userjobs')
  const params = new URLSearchParams()
  target.search = params.toString()
  return target.href
}

function createUserCredentialsQuery(email, password) {
  const target = new URL(endpoint + '/users')
  const params = new URLSearchParams()
  params.set('user', email)
  params.set('pswd', password)
  target.search = params.toString()
  return target.href
}

function createPasswordChangeQuery(userId, oldPassword, newPassword) {
  const target = new URL(endpoint + '/users/changePassword')
  const params = new URLSearchParams()
  params.set('user', userId)
  params.set('oldpsswd', oldPassword)
  params.set('newpsswd', newPassword)
  target.search = params.toString()
  return target.href
}

function createGetRequestQuery(sort, status) {
    const target = new URL(endpoint + '/allrequests')
  const params = new URLSearchParams()
  params.set('status', status)
  params.set('sort', sort)
  target.search = params.toString()
  return target.href
}

export default function() {

  async function createUser(email, password, job) {
    const newUser = new User(email, password, job, new Date())
    try {
      const response = await axiosInstance.post(endpoint + '/users/add/', newUser)
      return response.data
    } catch (error) {
      return null
    }
  }

  async function attemptLogIn(email, password) {
    try {
      const response = await axiosInstance.get(createUserCredentialsQuery(email, password))
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function refreshUserToken(){
    try {
      const response = await axiosInstance.get(endpoint + '/refresh')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function changePasswordRequest(userId, oldPassword, newPassword){
    try {
      const response = await axiosInstance.put(createPasswordChangeQuery(userId, oldPassword, newPassword))
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function sendFeedback(userId, value) {
    const newFeedback = new Feedback(userId, new Date(), value)
    try {
      const response = await axiosInstance.post(endpoint + '/users/feedback', newFeedback)
      return response.data
    } catch (error) {
      return null
    }
  }

  async function createRequest(userId, value) {
    const newRequest = new Requests(userId, new Date(), value)
    try {
      const response = await axiosInstance.post(endpoint + '/users/requests', newRequest)
      return response.data
    } catch (error) {
      return null
    }
  }

  async function getAllRequests(sort, status) {
    try {
      const response = await axiosInstance.get(createGetRequestQuery(sort, status))
      return response.data
    } catch (error) {
      return null
    }
  }

  async function getUserJobs() {
    const response = await axiosInstance.get(createUserJobQuery())
    const data = response.data
    const jobs = []
    for (let i = 0; i < data.length; i++) {
      jobs.push(new UserJob(...Object.values(data[i])))
    }
    return jobs
  }

  async function testData() {
     const target = new URL('http://localhost:7051/api/lfsdata')
    const params = new URLSearchParams()
    params.set('sex', 'T')
    params.set('age', '1')
    params.append('countryCode', 'RO')
    params.append('countryCode', 'BG')
    target.search = params.toString()
    console.log(target.search)
    const response = await axiosInstance.get(target.href)
    const data = response.data
    const eurodata = []
    for (let i = 0; i < data.length; i++) {
      eurodata.push(new EurostatData(...Object.values(data[i])))
    }
    return eurodata
  }

  return {
    getUserJobs,
    testData,
    attemptLogIn,
    createUser,
    refreshUserToken,
    changePasswordRequest,
    sendFeedback,
    createRequest,
    getAllRequests
  }
}
