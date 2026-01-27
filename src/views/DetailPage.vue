<template>
  <section class="page">
    <h1 class="title">Detay</h1>
    <p class="subtitle">id: {{ id }}</p>

    <div v-if="loading" class="state">Yükleniyor…</div>
    <div v-else-if="error" class="state error">Hata: {{ error }}</div>
    <pre v-else class="pre">{{ JSON.stringify(detail, null, 2) }}</pre>
  </section>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {getDetail} from '@/core/api/adverts.service'

const route = useRoute()
const id = computed(() => String(route.params.id || ''))

const loading = ref(false)
const error = ref(null)
const detail = ref(null)

async function load() {
  if (!id.value) return
  loading.value = true
  error.value = null

  try {
    detail.value = await getDetail(id.value)
  } catch (e) {
    error.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(id, load)
</script>


