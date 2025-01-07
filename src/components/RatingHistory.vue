<script lang="ts" setup>
import type { Rank, RatingChange } from '@/data';
import { inferRank } from '@/data';
import { Chart } from '@antv/g2';
import { computed, onMounted, useTemplateRef } from 'vue';

const props = defineProps<{
  data: RatingChange[]
}>();

const container = useTemplateRef('container');
const data = computed(() => {
  const result: Array<{
    handle: string
    date: Date
    rating: number
    rank: Rank
  }> = [];
  const offset = new Date().getTimezoneOffset() * 60;
  for (const change of Object.values(props.data)) {
    result.push({
      handle: change.handle,
      date: new Date((change.ratingUpdateTimeSeconds - offset) * 1000),
      rating: change.newRating,
      rank: inferRank(change.newRating)!,
    });
  }
  return result;
});

let chart: Chart | undefined;
function setupChart() {
  if (!container.value)
    return;
  if (chart)
    chart.destroy();
  chart = new Chart({ container: container.value });
  chart.options({
    autoFit: true,
    type: 'view',
    encode: { x: 'date', y: 'rating', color: 'handle' },
    scale: {
      x: { palette: 'accent' },
      y: { nice: true },
    },
    axis: { x: { title: 'Date' }, y: { title: 'Rating' } },
    children: [
      { type: 'line' },
      { type: 'point', encode: { shape: 'point' }, tooltip: false },
    ],
  });
  chart.data(data.value);
  chart.render();
}

onMounted(setupChart);
</script>

<template>
  <div ref="container" />
</template>
