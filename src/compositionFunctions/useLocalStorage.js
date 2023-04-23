import { LocalStorage } from 'quasar'
const LOCAL_STORAGE_KEY = {
  USER_TOKEN: 'authenticaton_token',
  LAST_SIGNED_IN: 'last_signed_in_date'
}

export default function () {
  function saveUserData(auth_token) {
    try {
      LocalStorage.set(LOCAL_STORAGE_KEY.USER_TOKEN, auth_token)
    } catch (e) {
      console.log('Could not save data on local storage')
    }
  }

  function deleteUserData(){
    try {
      LocalStorage.remove(LOCAL_STORAGE_KEY.USER_TOKEN)
    } catch (e) {
      console.log('Could not save data on local storage')
    }
  }

  function retrieveUserData() {
    return LocalStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) || null
  }

  function saveLastSignInData(date) {
     try {
      LocalStorage.set(LOCAL_STORAGE_KEY.LAST_SIGNED_IN, date)
    } catch (e) {
      console.log('Could not save data on local storage')
    }
  }

  return {
    saveUserData,
    retrieveUserData,
    saveLastSignInData,
    deleteUserData
  }
}
