import { LocalStorage } from 'quasar'
const LOCAL_STORAGE_KEY = {
  USER_TOKEN: 'authenticaton_token',
}

export default function () {
  function saveUserData(auth_token) {
    try {
      LocalStorage.set(LOCAL_STORAGE_KEY.USER_TOKEN, auth_token)
    } catch (e) {
      console.log('Could not save data on local storage')
    }
  }

  function retrieveUserData() {
    return LocalStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) || null
  }

  return {
    saveUserData,
    retrieveUserData
  }
}
