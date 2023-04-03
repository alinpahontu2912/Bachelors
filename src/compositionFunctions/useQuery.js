import { EurostatData } from 'src/models/EurostatData'
import { axiosInstance } from '../boot/axios'
import { UserJob } from 'src/models/UserJob'
const endpoint = 'http://localhost:7051/api'

function createUserJobQuery() {
  const target = new URL(' http://localhost:7051/api/userjobs')
  const params = new URLSearchParams()
  target.search = params.toString()
  return target.href
}


export default function() {
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
    params.set('countryCode', 'RO')
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
    testData
  }
}
