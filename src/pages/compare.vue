<script lang="ts" setup>
import type { RatingChange } from '@/data';
import RatingHistory from '@/components/RatingHistory.vue';
import { fetchRatingChanges } from '@/data';
import { downloadCanvas } from '@/utils';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const cache = computed(() => route.query.cache !== 'false');
const handles = computed(() => {
  const x = route.query.handle;
  if (typeof x === 'string' && x)
    return [x];
  if (Array.isArray(x))
    return x.filter(Boolean) as string[];
  return [];
});

const data = ref<RatingChange[]>([]);
const tasks: Promise<unknown>[] = ([]);
const isLoading = ref(false);

watch(handles, async (handles) => {
  isLoading.value = true;
  data.value.length = tasks.length = 0;
  for (const handle of handles) {
    tasks.push(
      fetchRatingChanges(handle, 3, cache.value).then(c => data.value.push(...c)),
    );
  }
  await Promise.all(tasks);
  isLoading.value = false;
}, { immediate: true });

const chartContainer = useTemplateRef('chartContainer');
const isDownloading = ref(false);
async function saveAsImage() {
  if (!chartContainer.value)
    return;
  isDownloading.value = true;
  try {
    const mod = await import('html2canvas');
    const canvas = await mod.default(chartContainer.value);
    await downloadCanvas(canvas, 'codeforces-rating.png');
  } catch (e) {
    console.error(e);
  }
  isDownloading.value = false;
}

function retry() {
  router.replace({
    ...route,
    query: {
      ...route.query,
      cache: 'false',
    },
  });
}
</script>

<template>
  <div v-if="isLoading" class="loading-wrapper">
    <ProgressSpinner class="spin" stroke-width="4" />
    <p>
      Chart is cooking...
    </p>
  </div>
  <template v-else>
    <div class="operations">
      <Button
        label="Save image"
        severity="contrast"
        :loading="isDownloading"
        @click="saveAsImage"
      >
        <template #icon>
          <IconPrimeDownload />
        </template>
      </Button>
      <Button label="Retry without cache" severity="secondary" @click="retry">
        <template #icon>
          <IconPrimeRefresh />
        </template>
      </Button>
    </div>
    <Divider />
    <div ref="chartContainer">
      <RatingHistory :data />
      <Divider />
      <CurrentRating :data />
    </div>
  </template>
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

.operations {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
