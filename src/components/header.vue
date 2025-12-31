<template>
  <v-app-bar app>
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="!isLoggedIn" @click="login">Login</v-btn>
    <v-btn v-if="isLoggedIn" @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const isLoggedIn = ref(false) // Kullanıcının giriş yapıp yapmadığını kontrol ediyoruz

    const login = () => {
      isLoggedIn.value = true
    }

    const logout = () => {
      isLoggedIn.value = false
    }

    return { isLoggedIn, login, logout }
  },
}
</script>

<style scoped>
/* Buraya özelleştirilmiş stiller ekleyebilirsin */
</style>
