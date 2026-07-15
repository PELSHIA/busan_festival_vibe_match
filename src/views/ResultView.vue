<script setup>
import { useRouter } from 'vue-router'
import ResultHeader from '../components/ResultHeader.vue'
import ResultMap from '../components/ResultMap.vue'
import ResultCalendar from '../components/ResultCalendar.vue'
import ResultReviews from '../components/ResultReviews.vue'

const router = useRouter()

const resetQuiz = () => {
  router.push('/')
}
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
    <ResultHeader />

    <!-- 2. Map & Calendar Side-by-Side -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 slide-up" style="animation-delay: 0.2s;">
      <ResultMap />
      <ResultCalendar />
    </section>

    <!-- 3. Community Reviews -->
    <ResultReviews />
  </div>
</template>

<style scoped>
</style>