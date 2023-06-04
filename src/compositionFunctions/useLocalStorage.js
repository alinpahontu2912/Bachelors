import { LocalStorage } from 'quasar'
import { SessionStorage } from 'quasar'
const LOCAL_STORAGE_KEY = {
  USER_TOKEN: 'authenticaton_token',
  LAST_SIGNED_IN: 'last_signed_in_date'
}

export default function () {
  function saveUserData(auth_token, remainSignedIn) {
    if (remainSignedIn) {
    try {
      SessionStorage.set(LOCAL_STORAGE_KEY.USER_TOKEN, auth_token)
    } catch (e) {
      console.log('Could not save data on local storage')
    }
    }
    try {
      LocalStorage.set(LOCAL_STORAGE_KEY.USER_TOKEN, auth_token)
    } catch (e) {
      console.log('Could not save data on local storage')
    }
  }

  function deleteUserData(){
    try {
      LocalStorage.clear()
      SessionStorage.clear()
    } catch (e) {
      console.log('Could not save data on local storage')
    }
  }

  function retrieveUserData() {
    return LocalStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) || SessionStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN)
  }

  return {
    saveUserData,
    retrieveUserData,
    deleteUserData
  }
}
