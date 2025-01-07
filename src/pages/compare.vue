<script lang="ts" setup>
import type { RatingChange } from '@/data';
import codeforcesLogo from '@/assets/codeforces.png?url';
import Error from '@/components/Error.vue';
import RatingHistory from '@/components/RatingHistory.vue';
import { fetchRatingChanges } from '@/data';
import { downloadCanvas } from '@/utils';
import { useToast } from 'primevue/usetoast';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();

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
const status = ref<'normal' | 'loading' | 'error'>('loading');

watch(handles, async (handles) => {
  status.value = 'loading';
  data.value.length = tasks.length = 0;
  for (const handle of handles) {
    tasks.push(
      fetchRatingChanges(handle, 3, cache.value).then(c => data.value.push(...c)),
    );
  }
  try {
    await Promise.all(tasks);
    status.value = 'normal';
  } catch (e) {
    console.error(e);
    status.value = 'error';
  }
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
    toast.add({
      severity: 'error',
      summary: 'Failed to save image',
      detail: 'Please check F12 console for more information.',
    });
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

const now = new Date();
</script>

<template>
  <Error
    v-if="!handles.length"
    title="400 Bad Request"
    details="Please specify at least one handle in the query parameters."
  />

  <template v-else-if="status === 'normal'">
    <div class="operations">
      <Button
        label="Save image"
        severity="success"
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
      <h2>
        <img :src="codeforcesLogo">
        Codeforces Rating Comparison
      </h2>
      <RatingHistory :data />
      <CurrentRating :data />
      <p class="footnote">
        Generated at {{ now.toLocaleString() }}
        <br>
        by CF Comparer
      </p>
    </div>
  </template>

  <div v-else-if="status === 'loading'" class="loading-wrapper">
    <ProgressSpinner class="spin" stroke-width="4" />
    <p>
      Chart is cooking...
    </p>
  </div>

  <Error
    v-else
    title="Failed to fetch data"
    details="Please check F12 console for more information."
  />
</template>

<style scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
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

h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  gap: 12px;
  margin-bottom: 4px;
}

h2 img {
  height: 1em;
}

.footnote {
  color: var(--p-button-secondary-color);
  text-align: right;
  font-family: "ui-monospace", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace";
  margin-right: 16px;
  margin-bottom: 8px;
}
</style>
