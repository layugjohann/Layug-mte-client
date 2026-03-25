<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';


const userStore = useUserStore();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return; // user not logged in

  try {
    // Validate token and fetch user details
    const response = await axios.get('http://localhost:4000/users/details', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.user && response.data.user._id) {
      userStore.setUser({
        id: response.data.user._id,
        isAdmin: response.data.user.isAdmin
      });
    } else {
      userStore.unsetUser();
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    userStore.unsetUser();
  }
});
</script>

<template>
  <Navbar />
  <RouterView />
</template>
<style>
  /* Adjust for fixed navbar height */
body {
  padding-top: 70px; /* 70px matches typical navbar height */
}
</style>
