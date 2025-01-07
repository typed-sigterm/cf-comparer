<script lang="ts" setup>
import codeforcesLogo from '@/assets/codeforces.png?url';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const handles = ref<string[]>(['']);
const disabled = computed(() => {
  return handles.value.length < 1 || handles.value.some(x => !x);
});
const isRedirecting = ref(false);

function compare(ev?: Event) {
  ev?.preventDefault();
  if (disabled.value)
    return;
  isRedirecting.value = true;
  router.push({
    path: '/compare',
    query: {
      handle: handles.value.filter(Boolean),
    },
  }).finally(() => isRedirecting.value = false);
}
</script>

<template>
  <form @submit="compare">
    <InputGroup v-for="(_, i) in handles" :key="i">
      <InputGroupAddon>
        <img class="cf-logo" :src="codeforcesLogo" alt="Codeforces">
      </InputGroupAddon>
      <InputText v-model="handles[i]" placeholder="handle" />
      <InputGroupAddon v-if="handles.length > 1">
        <Button severity="secondary" @click="handles.splice(i, 1)">
          <template #icon>
            <IconPrimeUserMinus />
          </template>
        </Button>
      </inputgroupaddon>
    </InputGroup>
    <Button label="Add" severity="secondary" @click="handles.push('')">
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
    :disabled
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
.submit:disabled {
  cursor: not-allowed;
}
</style>
