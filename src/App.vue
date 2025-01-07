<script lang="ts" setup>
import Header from './components/Header.vue';
</script>

<template>
  <Header />
  <main class="m-5">
    <RouterView />
  </main>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  color: unset;
  text-decoration: unset;
}

::-webkit-scrollbar {
  display: none;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Inter var", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
</style>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 20px 40px 0 40px;
}
</style>
