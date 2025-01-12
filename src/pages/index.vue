<script lang="ts" setup>
import type { Rank } from '@/data';
import codeforcesLogo from '@/assets/codeforces.png?url';
import { fetchRatingChanges, HANDLE_FORMAT, inferRank } from '@/data';
import { watchDebounced } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRedirecting = ref(false);

const input = ref<Array<{
  handle: string
  status?: 'empty' | 'loading' | 'error' | 'success'
  rank?: Rank
  error?: string
}>>([{ handle: '' }]);
const isLoading = computed(() => input.value.some(t => t.status === 'loading'));
const isDisabled = computed(() => {
  return input.value.length < 1 || input.value.some(t => t.status !== 'success');
});

function compare(ev?: Event) {
  ev?.preventDefault();
  if (isDisabled.value)
    return;
  isRedirecting.value = true;
  router.push({
    path: '/compare',
    query: {
      handle: input.value.map(t => t.handle),
    },
  }).finally(() => isRedirecting.value = false);
}

function syncRank(i: number) {
  if (!HANDLE_FORMAT.test(input.value[i].handle)) {
    input.value[i].status = 'error';
    return;
  }
  input.value[i].status = 'loading';
  return fetchRatingChanges(input.value[i].handle, 3)
    .then((r) => {
      input.value[i].rank = inferRank(r.at(-1)!.newRating);
      input.value[i].status = 'success';
      input.value[i].error = undefined;
    })
    .catch((e) => {
      console.error(e);
      input.value[i].rank = undefined;
      input.value[i].status = 'error';
      input.value[i].error = String(e);
    });
}
</script>

<template>
  <form @submit="compare">
    <InputGroup
      v-for="(item, i) in input"
      :key="i"
      :title="item.rank ? `${item.rank} ${item.handle}` : item.error"
    >
      <InputGroupAddon>
        <IconLineMdLoadingLoop v-if="item.status === 'loading'" />
        <IconPrimeExclamationCircle
          v-else-if="item.status === 'error'"
          style="color: var(--p-button-danger-background)"
        />
        <img v-else class="cf-logo" :src="codeforcesLogo" alt="Codeforces">
      </InputGroupAddon>
      <InputText
        v-model="item.handle"
        class="rank"
        :data-rank="item.rank"
        placeholder="handle"
        autocorrect="false"
        :invalid="item.status === 'empty' || item.status === 'error'"
        @input="item.rank = undefined"
        @change="syncRank(i)"
        @blur="input[i].rank || syncRank(i)"
      />
      <InputGroupAddon v-if="input.length > 1">
        <Button severity="secondary" :disabled="isLoading" @click="input.splice(i, 1)">
          <template #icon>
            <IconPrimeUserMinus />
          </template>
        </Button>
      </InputGroupAddon>
    </InputGroup>
    <Button label="Add" severity="secondary" @click="input.push({ handle: '' })">
      <template #icon>
        <IconPrimeUserPlus />
      </template>
    </Button>
  </form>
  <Button
    class="submit"
    label="Compare"
    severity="primary"
    :loading="isRedirecting"
    :disabled="isDisabled"
    @click="compare"
  >
    <template #icon>
      <IconPrimeSend />
    </template>
  </Button>
</template>

<style scoped>
form {
  width: 500px;
  align-self: center;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.cf-logo {
  width: 1em;
  user-select: none;
}

.submit {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  width: 500px;
  align-self: center;
}

.rank[data-rank="Newbie"] { color: #808080; }
.rank[data-rank="Pupil"] { color: #008000; }
.rank[data-rank="Specialist"] { color: #03a89e; }
.rank[data-rank="Expert"] { color: #0000ff; }
.rank[data-rank="Candidate Master"] { color: #aa00aa; }
.rank[data-rank="Master"] { color: #ff8c00; }
.rank[data-rank="International Master"] { color: #ff8c00; }
.rank[data-rank="Grandmaster"] { color: #ff0000; }
.rank[data-rank="International Grandmaster"] { color: #ff0000; }
.rank[data-rank="Legendary Grandmaster"] { color: #ff0000; font-weight: bold; }
.rank[data-rank="Tourist"] { color: #000; font-weight: bold; }
</style>
