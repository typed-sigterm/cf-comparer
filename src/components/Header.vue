<script lang="ts" setup>
import logo from '@/assets/logo.svg?url';
import { RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <RouterLink class="left" to="/">
      <img class="logo" :src="logo">
      <h1>CF Comparer</h1>
    </RouterLink>
    <div class="right">
      <a href="https://github.com/typed-sigterm/cf-comparer" target="_blank">
        <IconMdiGithub />
      </a>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
}

header > div {
  display: flex;
  align-items: center;
}
.left {
  display: flex;
  margin-left: 20px;
}
.right {
  margin-right: 20px;
}

.logo {
  height: 100%;
  margin-right: 8px;
}

h1 {
  align-content: center;
  font-size: 28px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
}

.right svg {
  font-size: 28px;
  vertical-align: bottom;
}
</style>
