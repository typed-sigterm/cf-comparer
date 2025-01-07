<script lang="ts" setup>
import logo from '@/assets/logo.svg?url';
import { GITHUB_URL } from '@/utils';
import { RouterLink } from 'vue-router';

const build = (import.meta.env.COMMIT_REF ?? 'DEV').slice(0, 7);
const link = build !== 'DEV' && `${GITHUB_URL}/commit/${build}`;
</script>

<template>
  <header>
    <RouterLink class="left" to="/">
      <img class="logo" :src="logo">
      <h1>CF Comparer</h1>
    </RouterLink>
    <div class="right">
      <p class="build">
        Build
        <a v-if="link" :href="link" target="_blank">
          {{ build }}
        </a>
        <span v-else>{{ build }}</span>
      </p>
      <a :href="GITHUB_URL" target="_blank">
        <IconPrimeGithub />
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
  margin-right: 16px;
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
  font-size: 32px;
  vertical-align: bottom;
}

.build {
  color: #94a3b8;
  font-family: "ui-monospace", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace";
  margin-right: 12px;
}
</style>
