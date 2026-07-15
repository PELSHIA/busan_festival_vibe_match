<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import QuizStep from '../components/QuizStep.vue'

const router = useRouter()
const currentStep = ref(0)

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

watch(currentStep, (newStep) => {
  if (newStep === 3) {
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
          :style="{ width: currentStep === 0 ? '0%' : currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }"
        ></div>
      </div>

      <!-- Quiz Content -->
      <div class="p-8 md:p-12 relative min-h-[450px]">
        <QuizStep 
          :current-step="currentStep"
          @next="nextStep"
          @prev="prevStep"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>