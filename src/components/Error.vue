<script lang="ts" setup>
defineProps<{
  title?: string
  details?: string
}>();
</script>

<template>
  <div class="error">
    <IconPrimeTimesCircle />
    <h2 v-if="title">
      {{ title }}
    </h2>
    <p v-if="details">
      {{ details }}
    </p>
  </div>
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.error {
  gap: 4px;
}

.error svg {
  font-size: 56px;
}
</style>
