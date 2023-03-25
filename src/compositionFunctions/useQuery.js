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

  return {
    getUserJobs
  }
}
