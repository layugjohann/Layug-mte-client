import {createRouter, createWebHistory} from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Posts from "../pages/Posts.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/register",
			name: "register",
			component: Register
		},
		{
			path: "/login",
			name: "login",
			component: Login
		},
		{
			path: "/posts",
			name: "posts",
			component: Posts
		}
	]
})

export default router