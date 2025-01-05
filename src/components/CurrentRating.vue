<script lang="ts" setup>
import type { RatingChange } from '@/data';
import type { RenderMode } from '@/utils';
import { getRenderer } from '@/utils';
import { Chart } from '@antv/g2';
import { computed, onMounted, useTemplateRef } from 'vue';

const props = defineProps<{
  mode: RenderMode
  data: RatingChange[]
}>();

const container = useTemplateRef('container');
const data = computed(() => {
  const max = new Map<string, number>(), current = new Map<string, number>();
  for (const change of props.data) {
    current.set(change.handle, change.newRating);
    const lastMax = max.get(change.handle);
    if (lastMax === undefined || change.newRating > lastMax)
      max.set(change.handle, change.newRating);
  }
  const result: Array<{
    type: 'Current' | 'Historical Highest'
    handle: string
    rating: number
  }> = [];
  for (const [handle, rating] of current) {
    result.push({ type: 'Current', handle, rating });
    result.push({ type: 'Historical Highest', handle, rating: max.get(handle)! });
  }
  return result;
});

let chart: Chart | undefined;
function setupChart() {
  if (!container.value)
    return;
  if (!chart) {
    chart = new Chart({
      container: container.value,
      renderer: getRenderer(props.mode),
    });
    chart.options({
      autoFit: true,
      type: 'interval',
      encode: { x: 'handle', y: 'rating', color: 'type' },
      axis: { x: { title: 'Handle' }, y: { title: 'Rating' } },
      transform: [{ type: 'dodgeX' }],
      coordinate: { transform: [{ type: 'transpose' }] },
    });
  }
  chart.data(data.value);
  chart.render();
}

onMounted(setupChart);
</script>

<template>
  <div ref="container" />
</template>
