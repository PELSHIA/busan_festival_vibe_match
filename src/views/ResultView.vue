<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ResultHeader from '../components/ResultHeader.vue'
import ResultMap from '../components/ResultMap.vue'
import ResultCalendar from '../components/ResultCalendar.vue'
import ResultReviews from '../components/ResultReviews.vue'
import festivalData from '../../public/data/부산_축제공연행사.json'
import { findFestivalByContentId } from '../utils/festivalRecommender.mjs'

const router = useRouter()
const selectedFestival = ref(null)
const selectedVibe = ref('')
const STORAGE_KEY = 'selectedFestivalContentId'

const loadResult = () => {
  const storedContentId = window.sessionStorage.getItem(STORAGE_KEY)

  if (!storedContentId) {
    router.replace('/')
    return
  }

  const festival = findFestivalByContentId(festivalData.items, storedContentId)
  selectedFestival.value = festival

  if (!festival) {
    window.sessionStorage.removeItem(STORAGE_KEY)
    router.replace('/')
    return
  }

  selectedVibe.value = festival.vibe || 'PASSION'
}

onMounted(() => {
  loadResult()
})

const resetQuiz = () => {
  sessionStorage.removeItem('quizResult')
  window.sessionStorage.removeItem(STORAGE_KEY)
  router.push('/')
}

const resultTitle = computed(() => selectedFestival.value?.title || '오늘의 부산 축제')
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
    <!-- Back Button -->
    <button
      @click="resetQuiz"
      class="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition font-medium text-sm"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      다시 테스트하기
    </button>

    <!-- 1. Festival Header -->
    <ResultHeader :festival="selectedFestival" :vibe="selectedVibe" />

    <!-- 2. Map & Calendar Side-by-Side -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 slide-up" style="animation-delay: 0.2s;">
      <ResultMap :festival="selectedFestival" />
      <ResultCalendar :festival="selectedFestival" />
    </section>

    <!-- 3. Community Reviews -->
    <ResultReviews />
  </div>
</template>

<style scoped>
</style>