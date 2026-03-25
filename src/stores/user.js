// stores/user.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: localStorage.getItem('userId') || null,
    isAdmin: localStorage.getItem('isAdmin') === 'true' || false
  })

  function setUser(userData) {
    user.value.id = userData.id
    user.value.isAdmin = Boolean(userData.isAdmin)

    // Persist to localStorage
    localStorage.setItem('userId', userData.id)
    localStorage.setItem('isAdmin', userData.isAdmin)
  }

  function unsetUser() {
    user.value.id = null
    user.value.isAdmin = false
    localStorage.clear()
  }

  return { user, setUser, unsetUser }
})