import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentUser = defineStore('currentUser', () => {
  const currentUser = ref<User>()
  function saveCurrentUser(user: User) {
    currentUser.value = user
  }

  function getCurrentUser() {
    return currentUser.value as User
  }

  return { currentUser, saveCurrentUser, getCurrentUser }
})
