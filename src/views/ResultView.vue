<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ResultHeader from '../components/ResultHeader.vue'
import ResultMap from '../components/ResultMap.vue'
import ResultCalendar from '../components/ResultCalendar.vue'
import ResultReviews from '../components/ResultReviews.vue'
import festivalData from '../../public/data/부산_축제공연행사.json'
import { findFestivalByContentId } from '../utils/festivalRecommender.mjs'
import ChatWidget from '../components/ChatWidget.vue'

const router = useRouter()
const route = useRoute()
const selectedFestival = ref(null)
const selectedVibe = ref('')
const reviewWriteTrigger = ref(0)
const STORAGE_KEY = 'selectedFestivalContentId'

const loadResult = () => {
  const festivalParam = route?.query?.festival || new URL(window.location.href).searchParams.get('festival')
  const storedContentId = festivalParam || window.sessionStorage.getItem(STORAGE_KEY)

  if (!storedContentId) {
    router.replace('/')
    return
  }

  // 쿼리로 들어온 경우 세션에 저장해서 후속 동작이 동일하게 동작하도록 함
  if (festivalParam) {
    window.sessionStorage.setItem(STORAGE_KEY, festivalParam)
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

const openReviewWrite = () => {
  reviewWriteTrigger.value += 1
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
    <!-- Back Button -->
    <ChatWidget :festival="selectedFestival" />
    <button
      @click="resetQuiz"
      class="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition font-medium text-sm"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      다시 테스트하기
    </button>

    <!-- 1. Festival Header -->
    <ResultHeader :festival="selectedFestival" :vibe="selectedVibe" @open-review-write="openReviewWrite" />

    <!-- 2. Map & Calendar Side-by-Side -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 slide-up" style="animation-delay: 0.2s;">
      <ResultMap :festival="selectedFestival" />
      <ResultCalendar :festival="selectedFestival" />
    </section>

    <!-- 3. Community Reviews -->
    <ResultReviews :festival="selectedFestival" :write-trigger="reviewWriteTrigger" />
  </div>
</template>

<style scoped>
</style>