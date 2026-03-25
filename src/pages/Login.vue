<template>
  <form @submit.prevent="authenticate" class="container mt-5" style="max-width: 400px;">
    <h1 class="my-5 text-center">Login</h1>

    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input
        type="email"
        id="email"
        class="form-control"
        placeholder="Enter email"
        v-model="email"
        required
      />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        type="password"
        id="password"
        class="form-control"
        placeholder="Enter password"
        v-model="password"
        required
      />
    </div>

    <button
      type="submit"
      class="btn"
      :class="isActive ? 'btn-primary' : 'btn-danger'"
      :disabled="!isActive"
    >
      Log In
    </button>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');

// Enable button only if both fields are filled
const isActive = computed(() => email.value.trim() !== '' && password.value.trim() !== '');

async function authenticate() {
  if (!isActive.value) {
    notyf.error('Please fill in all fields.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:4000/users/login', {
      email: email.value,
      password: password.value
    });

    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      await retrieveUserDetails(response.data.access);

      email.value = '';
      password.value = '';
      notyf.success('Login successful!');
    } else {
      notyf.error('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error(error);

    if (error.response) {
      const status = error.response.status;
      if (status === 401) notyf.error('Incorrect password. Please try again.');
      else if (status === 404) notyf.error('User not registered. Please sign up first.');
      else notyf.error('Login failed. Please check your credentials.');
    } else {
      notyf.error('Network error. Please try again later.');
    }
  }
}

async function retrieveUserDetails(token) {
  try {
    const response = await axios.get('http://localhost:4000/users/details', {
      headers: { Authorization: `Bearer ${token}` }
    });

    userStore.setUser({
      id: response.data.user._id,
      isAdmin: response.data.user.isAdmin
    });

    router.push('/posts');
  } catch (error) {
    console.error('Failed to retrieve user details:', error);
    notyf.error('Could not fetch user details.');
  }
}

onMounted(() => {
  if (userStore.user.id) router.push('/posts');
});
</script>