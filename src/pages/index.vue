<script lang="ts" setup>
import codeforcesLogo from '@/assets/codeforces.png?url';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const handles = ref<string[]>(['']);
const disabled = computed(() => {
  return handles.value.length < 1 || handles.value.some(x => !x);
});

function compare() {
  router.push({
    path: '/compare',
    query: {
      handle: handles.value.filter(Boolean),
    },
  });
}
</script>

<template>
  <form>
    <InputGroup v-for="(_, i) in handles" :key="i">
      <InputGroupAddon>
        <img class="cf" :src="codeforcesLogo" alt="Codeforces">
      </InputGroupAddon>
      <InputText v-model="handles[i]" />
      <InputGroupAddon v-if="i > 0">
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
  <Button class="submit" label="Compare" severity="primary" :disabled @click="compare">
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

.cf {
  width: 1em;
}

.submit {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  width: 500px;
  align-self: center;
}
.submit:disabled {
  cursor: not-allowed;
}
</style>
