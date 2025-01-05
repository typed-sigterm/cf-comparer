<script lang="ts" setup>
import type { RatingChange } from '@/data';
import RatingHistory from '@/components/RatingHistory.vue';
import { fetchRatingChanges } from '@/data';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const handles = computed(() => {
  const x = useRoute().query.handle;
  if (typeof x === 'string' && x)
    return [x];
  if (Array.isArray(x))
    return x.filter(Boolean) as string[];
  return [];
});
const mode = computed(() => useRoute().query.mode === 'svg' ? 'svg' : 'canvas');

const data = ref<RatingChange[]>([]);
const tasks: Promise<unknown>[] = [];
const isLoading = ref(false);

watch(handles, async (handles) => {
  isLoading.value = true;
  tasks.length = 0;
  for (const handle of handles) {
    tasks.push(
      fetchRatingChanges(handle, 3).then(c => data.value.push(...c)),
    );
  }
  await Promise.all(tasks);
  isLoading.value = false;
}, { immediate: true });
</script>

<template>
  <div v-if="isLoading" class="loading-wrapper">
    <ProgressSpinner class="spin" stroke-width="4" />
    <p>
      Chart is cooking...
    </p>
  </div>
  <div v-else class="chart-wrapper">
    <RatingHistory :mode :data />
    <Divider />
    <CurrentRating :mode :data />
  </div>
</template>

<style scoped>
.loading-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-bottom: 28px;
}

.spin {
  width: 50px;
  height: 50px;
  margin-bottom: 8px;
}
</style>
