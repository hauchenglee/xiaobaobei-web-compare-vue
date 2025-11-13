<template>
    <div class="app">
        <router-view />
    </div>
</template>

<script setup>
// 移除 HomeView 的直接引入
// import HomeView from './views/HomeView.vue'
</script>

<style>
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: #f5f5f5;
    padding: 20px;
    min-height: 100vh;
}
</style>