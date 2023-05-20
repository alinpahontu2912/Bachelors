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

function createGetRequestQuery(sort, status, page) {
    const target = new URL(endpoint + '/allrequests')
  const params = new URLSearchParams()
  params.set('status', status)
  params.set('sort', sort)
  params.set('page', page)
  target.search = params.toString()
  return target.href
}

function createGetMessagesQuery(sort, status, page) {
  const target = new URL(endpoint + '/contact')
  const params = new URLSearchParams()
  params.set('status', status)
  params.set('sort', sort)
  params.set('page', page)
  target.search = params.toString()
  return target.href
}

function createReplyMessageQuery(messageId) {
  const target = new URL(endpoint + '/contact/' + messageId)
  const params = new URLSearchParams()
  target.search = params.toString()
  return target.href
}


function createGetAnnouncementQuery(sort, type, page) {
  const target = new URL(endpoint + '/announcements')
  const params = new URLSearchParams()
  params.set('type', type)
  params.set('sort', sort)
  params.set('page', page)
  target.search = params.toString()
  return target.href
}

function createEuropeanDataQuery(startTime, endTime, sex, age, education, chartType){
  const target = new URL(endpoint + '/lfsdata')
  const params = new URLSearchParams()
  params.set('sex', sex)
  params.set('age', age)
  params.set('education', education)
  params.set('chartType', chartType)
  params.set('startTime', startTime)
  params.set('endTime', endTime)
  target.search = params.toString()
  return target.href
}

function createSolveRequestQuery(requestId, statusId){
  const target = new URL(endpoint + '/solveRequest/' + requestId)
  const params = new URLSearchParams()
  params.set('status', statusId)
  target.search = params.toString()
  return target.href
}

function createRegionalDataQuery(startTime, endTime, sex, residency, chartType){
  const target = new URL(endpoint + '/regionalData/RO')
  const params = new URLSearchParams()
  params.set('sex', sex)
  params.set('residency', residency)
  params.set('chartType',chartType)
  params.set('startTime', startTime)
  params.set('endTime', endTime)
  target.search = params.toString()
  return target.href
}

function createGetAvailableTimeQuery(setName) {
  const target = new URL(endpoint + '/time')
  const params = new URLSearchParams()
  params.set('setName', setName)
  target.search = params.toString()
  return target.href
}


export default function() {

  async function getCountryNames() {
    try {
      const response = await axiosInstance.get(endpoint + '/countries')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function getAdminStats(){
    try {
      const response = await axiosInstance.get(endpoint + '/userStats')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function getNewUserStats(){
    try {
      const response = await axiosInstance.get(endpoint + '/newUsersStats')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function getAvailableTime(setName) {
    try {
      const response = await axiosInstance.get(createGetAvailableTimeQuery(setName))
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function getEuropeanData(startTime, endTime, sex, age, education, chartType){
    try {
      const response = await axiosInstance.get(createEuropeanDataQuery(startTime == null ? '' : startTime, endTime == null ? '' : endTime, sex == null ? '' : sex, age , education, chartType))
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

  async function getRegionalData(startTime, endTime, sex, residency, chartType){
    try {
      const response = await axiosInstance.get(createRegionalDataQuery(startTime == null ? '' : startTime, endTime == null ? '' : endTime, sex == null ? '' : sex, residency, chartType))
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      return null
    }
  }

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
      const response = await axiosInstance.get(endpoint + '/users/refresh')
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

  async function getAllRequests(index, sort, type, done, container) {
    const response = await axiosInstance.get(createGetRequestQuery(sort, type, index))
    const data = response.data
    for (let i = 0; i < data.length; i++) {
      container.push({ id: data[i].id, issuer: data[i].issuer, requestTime: new Date(data[i].requestTime).toDateString(), motivation: data[i].motivation, status: data[i].status, email: data[i].issuerNavigation.email })
    }
    done()
    return data.length
  }

  async function getAllMessages(index, sort, type, done, container) {
    const response = await axiosInstance.get(createGetMessagesQuery(sort, type, index))
    const data = response.data
    for (let i = 0; i < data.length; i++) {
      container.push({ id: data[i].id, requestTime: new Date(data[i].creationTime).toDateString(), value: data[i].value, status: data[i].reply, email: data[i].user.email })
    }
    done()
    return data.length
  }

   async function getAllAnnouncements(index, sort, status, done, container) {
    const response = await axiosInstance.get(createGetAnnouncementQuery(sort, status, index))
    const data = response.data
    for (let i = 0; i < data.length; i++) {
      container.push({ id: data[i].id, type: data[i].typeNavigation.type, creationTime: new Date(data[i].creationTime).toDateString(), value: data[i].value, title: data[i].title })
    }
    done()
    return data.length
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


  async function solveRequest(requestId, statusId) {
    try {
      const response = await axiosInstance.put(createSolveRequestQuery(requestId, statusId))
      const data = response.data
    } catch (error) {
      return null
    }
  }

  async function sendMessage(messageId, value) {
    try {
      const response = await axiosInstance.post(createReplyMessageQuery(messageId), {
        value
      })
      const data = response.data
    } catch (error) {
      return null
    }
  }

  return {
    getUserJobs,
    attemptLogIn,
    createUser,
    refreshUserToken,
    changePasswordRequest,
    sendFeedback,
    createRequest,
    getAllRequests,
    getAllAnnouncements,
    getEuropeanData,
    getRegionalData,
    getAdminStats,
    getNewUserStats,
    getAvailableTime,
    solveRequest,
    getAllMessages,
    createGetMessagesQuery,
    sendMessage,
    getCountryNames
  }
}
