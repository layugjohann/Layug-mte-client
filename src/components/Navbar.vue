<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm">
    <div class="container">
      <router-link class="navbar-brand text-dark" to="/">My Blog</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">

          <!-- Posts Link -->
          <li class="nav-item">
            <router-link class="nav-link text-dark" to="/posts">Posts</router-link>
          </li>

          <!-- If user is not logged in -->
          <template v-if="!userStore.user.id">
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/register">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/login">Login</router-link>
            </li>
          </template>

          <!-- If user is logged in -->
          <template v-else>
            <li class="nav-item">
              <a class="nav-link text-dark" href="#" @click.prevent="logout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const userStore = useUserStore();
const router = useRouter();
const notyf = new Notyf();

// Logout without confirm
function logout() {
  localStorage.removeItem('token');
  userStore.unsetUser();
  notyf.success('Logged out successfully!');
  router.push('/login');
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>