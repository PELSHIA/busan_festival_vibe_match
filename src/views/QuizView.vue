<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import QuizStep from '../components/QuizStep.vue'
import festivalData from '../../public/data/부산_축제공연행사.json'
import { recommendFestival, resolveVibe } from '../utils/festivalRecommender.mjs'

const router = useRouter()
const currentStep = ref(0)
const selectedVibes = ref([])
const STORAGE_KEY = 'selectedFestivalContentId'

const resetQuizState = () => {
  currentStep.value = 0
  selectedVibes.value = []
  sessionStorage.removeItem('quizResult')
}

resetQuizState()

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleAnswer = ({ value }) => {
  selectedVibes.value.push(value)
}

const progressPercent = computed(() => {
  if (currentStep.value === 0) return 0
  if (currentStep.value === 1) return 25
  if (currentStep.value === 2) return 50
  if (currentStep.value === 3) return 75
  return 100
})

const saveRecommendedFestival = (votes) => {
  const vibe = resolveVibe(votes)
  const festival = recommendFestival(festivalData.items, votes)

  if (festival?.contentid) {
    window.sessionStorage.setItem(STORAGE_KEY, String(festival.contentid))
  } else {
    window.sessionStorage.removeItem(STORAGE_KEY)
  }

  return { vibe, festival }
}

watch(currentStep, (newStep) => {
  if (newStep === 4) {
    const payload = JSON.stringify(selectedVibes.value)
    sessionStorage.setItem('quizResult', payload)
    saveRecommendedFestival(selectedVibes.value)

    setTimeout(() => {
      router.push('/result')
    }, 1500)
  }
})
</script>

<template>
  <div class="flex-grow flex items-center justify-center p-4 relative overflow-hidden min-h-screen">
    <!-- Decorative background elements -->
    <div class="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="animation-delay: 0s;"></div>
    <div class="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="animation-delay: 2s;"></div>

    <div class="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white relative z-10">
      <!-- Progress Bar -->
      <div class="h-2 bg-gray-100 w-full relative">
        <div 
          class="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <!-- Quiz Content -->
      <div class="p-8 md:p-12 relative min-h-[450px]">
        <QuizStep 
          :current-step="currentStep"
          @next="nextStep"
          @prev="prevStep"
          @answer="handleAnswer"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>