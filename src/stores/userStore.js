// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import useLocalStorage from 'src/compositionFunctions/useLocalStorage'
// import useQuery from 'src/compositionFunctions/useHttpQuery'
// const { saveUserData, retrieveUserData } = useLocalStorage()
// // const { addNewUser, verifyUserCredentials } = useQuery()

// export const userStore = defineStore('user', () => {
//   const userToken = ref(retrieveUserData())

//   function checkUserRemainSignedIn() {
//     return userToken.value
//   }

//   async function signUpRequest(email, password, jobId) {
//     const response = await addNewUser(email, password, jobId)
//     if (response) {
//       userToken.value = response
//       if (remainSignedIn) { saveUserData(response) }
//       return true
//     }
//     return false
//   }

//   async function loginRequest(email, password, remainSignedIn) {
//     const response = await verifyUserCredentials(email, password)
//     if (response) {
//       userToken.value = response
//       if (remainSignedIn) { saveUserData(response) }
//       return true
//     }
//     return false
//   }

//   function logout() {
//     userToken.value = null
//     saveUserData(userToken.value)
//   }

//   function getUserRole() {
//     return userToken.value.role === 1
//   }

//   return { userToken, signUpRequest, loginRequest, logout, checkUserRemainSignedIn, getUserRole }
// })
