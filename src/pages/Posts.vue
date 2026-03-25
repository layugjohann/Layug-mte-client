<template>
  <div class="container my-5">

    <!-- CREATE POST FORM -->
    <div class="card mb-4 p-4 shadow-sm">
      <h2 class="mb-3 text-center">Create a Post</h2>
      <form @submit.prevent="createPost">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Title"
              v-model="newPost.title"
              required
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Author"
              v-model="newPost.author"
              required
            />
          </div>
          <div class="col-12 col-md-4">
            <button type="submit" class="btn btn-primary w-100">Post</button>
          </div>
        </div>
        <div class="mt-3">
          <textarea
            class="form-control"
            placeholder="Content"
            rows="3"
            v-model="newPost.content"
            required
          ></textarea>
        </div>
      </form>
    </div>

    <!-- SEARCH POSTS -->
    <div class="input-group mb-4">
      <input
        type="text"
        class="form-control"
        placeholder="Search posts..."
        v-model="searchTerm"
      />
      <button class="btn btn-primary" @click="searchPosts">Search</button>
    </div>

    <!-- POSTS FEED -->
    <div v-if="filteredPosts.length">
      <div
        class="card mb-3 p-3 shadow-sm"
        v-for="post in filteredPosts"
        :key="post._id"
      >
        <h4>{{ post.title }}</h4>
        <p>{{ post.content }}</p>
        <small>Author: {{ post.author }}</small>
        <div class="mt-2" v-if="userStore.user.isAdmin">
          <button
            class="btn btn-danger btn-sm"
            @click="deletePost(post._id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="text-center">No posts found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Notyf } from 'notyf';
import { useUserStore } from '@/stores/user';
import 'notyf/notyf.min.css';

const notyf = new Notyf();
const userStore = useUserStore();

// POSTS STATE
const posts = ref([]);
const filteredPosts = ref([]);
const newPost = ref({ title: '', content: '', author: '' });
const searchTerm = ref('');

// FETCH ALL POSTS
async function getAllPosts() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://mte-server.onrender.com/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });

    posts.value = Array.isArray(response.data.posts) ? response.data.posts : [];
    filteredPosts.value = posts.value.slice();
  } catch (err) {
    console.error(err);
    notyf.error('Failed to fetch posts.');
  }
}

// CREATE POST
async function createPost() {
  if (!newPost.value.title || !newPost.value.content || !newPost.value.author) {
    notyf.error('Please fill all fields.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'https://mte-server.onrender.com/create',
      newPost.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data && response.data.post) {
      posts.value.unshift(response.data.post);
      filteredPosts.value = posts.value.slice();
    }

    newPost.value = { title: '', content: '', author: '' };
    notyf.success('Post created!');
  } catch (err) {
    console.error(err);
    notyf.error('Failed to create post.');
  }
}

// DELETE POST (ADMIN ONLY)
async function deletePost(postId) {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`https://mte-server.onrender.com/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    posts.value = posts.value.filter(p => p._id !== postId);
    filteredPosts.value = filteredPosts.value.filter(p => p._id !== postId);

    notyf.success('Post deleted!');
  } catch (err) {
    console.error(err);
    notyf.error('Failed to delete post.');
  }
}

// SEARCH POSTS WITH BUTTON
function searchPosts() {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) {
    filteredPosts.value = posts.value.slice();
    return;
  }

  filteredPosts.value = posts.value.filter(
    p =>
      p.title.toLowerCase().includes(term) ||
      p.content.toLowerCase().includes(term) ||
      p.author.toLowerCase().includes(term)
  );
}

// INITIALIZE FEED
onMounted(() => {
  getAllPosts();
});
</script>

<style scoped>
/* Make form and feed responsive */
textarea {
  resize: none;
}
@media (min-width: 768px) {
  form .row.g-3 > .col-md-4 {
    display: flex;
    flex-direction: column;
  }
}
.card {
  border-radius: 10px;
}
</style>