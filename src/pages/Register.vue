<template>
	<div class="d-flex justify-content-center align-items-center vh-100">
    <form @submit.prevent="registerUser" class="container" style="max-width: 400px;">
        <h1 class="my-5 text-center">Register</h1>

        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input 
                type="email" 
                class="form-control" 
                id="email"
                placeholder="Enter email" 
                required
                v-model="email"
            />
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
                type="password" 
                class="form-control" 
                id="password"
                placeholder="Password" 
                required
                v-model="password"
            />
        </div>

        <button 
            :disabled="!isActive" 
            type="submit" 
            class="btn" 
            :class="isActive ? 'btn-primary' : 'btn-danger'"
        >
            Register
        </button>
    </form>
</div>           
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

const isActive = computed(() => email.value.trim() !== '' && password.value.trim() !== '');

async function registerUser() {
    if (!isActive.value) {
        notyf.error("Please fill in all fields.");
        return;
    }

    try {
        const response = await axios.post('https://mte-server.onrender.com/register', {
            email: email.value,
            password: password.value,
            isAdmin: false
        });

        console.log("REGISTER RESPONSE:", response.data);

        // Always proceed if status is 2xx
        if (response.status >= 200 && response.status < 300) {
            notyf.success("Registration successful! You can now log in.");
            email.value = '';
            password.value = '';
            router.push('/login'); // Redirect to login page
        }

    } catch (error) {
        console.error("REGISTER ERROR:", error.response?.data || error);

        if (error.response) {
            const status = error.response.status;
            if (status === 409) {
                notyf.error("Email already registered. Use a different email.");
            } else if (status === 400) {
                notyf.error("Invalid input. Please check your email and password.");
            } else {
                notyf.error("Registration failed. Please try again.");
            }
        } else {
            notyf.error("Network error. Please try again later.");
        }
    }
}

// Redirect logged-in users away from register page
onMounted(() => {
    if (userStore.user && userStore.user.id) {
        router.push('/posts'); 
    }
});
</script>

<style scoped>
</style>