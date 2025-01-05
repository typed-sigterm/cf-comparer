<script lang="ts" setup>
import { GITHUB_URL } from '@/utils';

const build = (import.meta.env.COMMIT_REF ?? 'DEV').slice(0, 7);

const link = build !== 'DEV' && `${GITHUB_URL}/commit/${build}`;
</script>

<template>
  <footer>
    <p>
      Build
      <a v-if="link" :href="link" target="_blank">
        {{ build }}
      </a>
      <span v-else>{{ build }}</span>
    </p>
  </footer>
</template>

<style scoped>
footer {
  text-align: center;
  color: #94a3b8;
  font-family: "ui-monospace", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace";
  margin-bottom: 2px;
}
</style>
