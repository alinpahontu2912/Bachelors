import { defineStore } from 'pinia'
import { ref } from 'vue'
import jwt_decode from "jwt-decode";
import useLocalStorage from 'src/compositionFunctions/useLocalStorage'
import useQuery from 'src/compositionFunctions/useQuery'
const { saveUserData, retrieveUserData, deleteUserData } = useLocalStorage()
const { createUser, attemptLogIn, refreshUserToken, changePasswordRequest } = useQuery()

export const userStore = defineStore('user', () => {
  const userToken = ref(retrieveUserData())

  async function checkUserAlreadySignedIn() {
  //   if (userToken.value){
  //     console.log(userToken.value)
  //   const decoded = jwt_decode(userToken.value);
  //   if (Date(decoded.expiry) < new Date()) {
  //     const response = await refreshUserToken()
  //     if (response) {
  //       userToken.value = response
  //       saveUserData(response)
  //     }
  //   }
  // }
  //   return userToken.value
return false;
}

  async function signUpRequest(email, password, jobId, remainSignedIn) {
    const response = await createUser(email, password, jobId)
    if (response) {
      userToken.value = response
      if (remainSignedIn) { saveUserData(response) }
      return true
    }
    return false
  }

  async function loginRequest(email, password, remainSignedIn) {
    const response = await attemptLogIn(email, password)
    if (response) {
      userToken.value = response
      if (remainSignedIn) { saveUserData(response) }
      return true
    }
    return false
  }

  async function updatePassword(oldPassword, newPassword){
    const decoded = jwt_decode(userToken.value);
    const userId = decoded.userId;
    const data = await changePasswordRequest(userId, oldPassword, newPassword)
    if (data) {
      saveUserData(data)
      userToken.value = data
      return true
    }
    return false
  }

  function logout() {
    userToken.value = null
    deleteUserData()
  }

  function isUserAuth() {
    return !!userToken.value
  }

  function isUserAdmin() {
    if (userToken.value) {
      const decoded = jwt_decode(userToken.value);
      return decoded.permissions.includes(1)
    }
    return false
  }

  function getAccountInfo() {
    const decoded = jwt_decode(userToken.value);
    console.log(decoded)
    const canDownload = decoded.permissions.includes(2)
    return {email: decoded.email, joinedOn: new Date(decoded.expiry).toDateString(), canDownload: canDownload ? 'YES' : 'NO' }
  }

  function getUserId() {
    const decoded = jwt_decode(userToken.value);
    return decoded.userId
  }

  return { userToken, signUpRequest, loginRequest, logout, checkUserAlreadySignedIn, isUserAuth, isUserAdmin, getAccountInfo, updatePassword, getUserId }
})
