<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  currentStep: Number
})

const emit = defineEmits(['next', 'prev'])
const router = useRouter()

const selectedQ1 = ref(null)
const selectedQ2 = ref(null)

const selectAnswer = (qNum, value) => {
  if (qNum === 1) {
    selectedQ1.value = value
    setTimeout(() => {
      emit('next')
    }, 300)
  }
  if (qNum === 2) {
    selectedQ2.value = value
    setTimeout(() => {
      emit('next')
    }, 300)
  }
}

const handleNext = () => {
  emit('next')
}

const handlePrev = () => {
  emit('prev')
}
</script>

<template>
  <div class="relative h-[450px]">
    <!-- Intro Step -->
    <div v-if="currentStep === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center fade-in">
      <div class="text-5xl md:text-6xl mb-4">🌊</div>
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        내 안의
        <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">부산 바이브</span>찾기
      </h1>
      <p class="text-gray-500 text-lg mb-8 max-w-md">
        단 2개의 질문으로 오늘 당신에게<br>딱 맞는 부산 축제를 추천해 드립니다.
      </p>
      <button
        @click="handleNext"
        class="px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-500/50 transition-all"
      >
        테스트 시작하기
      </button>
    </div>

    <!-- Question 1 -->
    <div v-if="currentStep === 1" class="absolute inset-0 flex flex-col justify-center fade-in">
      <div class="mb-8">
        <span class="text-xs font-bold text-blue-500 tracking-wider">QUESTION 01</span>
        <h2 class="text-2xl font-bold text-gray-900 mt-3">
          오늘 나의 에너지 상태는 어떤가요?
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <!-- Option 1 -->
        <div
          @click="selectAnswer(1, 'energetic')"
          class="quiz-option p-6 border-2 border-gray-250 rounded-xl cursor-pointer bg-white hover:bg-gray-50 flex flex-col items-center text-center transition-all"
          :class="{ 'selected bg-blue-50 border-blue-500': selectedQ1 === 'energetic' }"
        >
          <div class="text-5xl mb-3">🔥</div>
          <p class="text-gray-900 font-bold text-sm">에너지 폭발!</p>
          <p class="text-gray-500 text-xs mt-2">집에 있으면 병남.<br>무조건 밖에서 뛰어놀아야 해!</p>
        </div>

        <!-- Option 2 -->
        <div
          @click="selectAnswer(1, 'emotional')"
          class="quiz-option p-6 border-2 border-gray-250 rounded-xl cursor-pointer bg-white hover:bg-gray-50 flex flex-col items-center text-center transition-all"
          :class="{ 'selected bg-blue-50 border-blue-500': selectedQ1 === 'emotional' }"
        >
          <div class="text-5xl mb-3">🎧</div>
          <p class="text-gray-900 font-bold text-sm">감성 충전 필요</p>
          <p class="text-gray-500 text-xs mt-2">복잡한 건 싫어.<br>여유롭게 분위기를 즐길래.</p>
        </div>
      </div>
    </div>

    <!-- Question 2 -->
    <div v-if="currentStep === 2" class="absolute inset-0 flex flex-col justify-center fade-in">
      <button @click="handlePrev" class="mb-6 text-gray-600 hover:text-gray-900 transition flex items-center text-sm">
        <i class="fas fa-arrow-left mr-2"></i>이전
      </button>

      <div class="mb-8">
        <span class="text-xs font-bold text-blue-500 tracking-wider">QUESTION 02</span>
        <h2 class="text-2xl font-bold text-gray-900 mt-3">
          이번 주말, 끌리는 테마는?
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <!-- Option 1 -->
        <div
          @click="selectAnswer(2, 'trendy')"
          class="quiz-option p-6 border-2 border-gray-250 rounded-xl cursor-pointer bg-white hover:bg-gray-50 flex flex-col items-center text-center transition-all"
          :class="{ 'selected bg-blue-50 border-blue-500': selectedQ2 === 'trendy' }"
        >
          <div class="text-5xl mb-3">✨</div>
          <p class="text-gray-900 font-bold text-sm">트렌디 & 화려함</p>
          <p class="text-gray-500 text-xs mt-2">인생샷 필수!<br>화려한 볼거리와 음악이 있는 곳.</p>
        </div>

        <!-- Option 2 -->
        <div
          @click="selectAnswer(2, 'local')"
          class="quiz-option p-6 border-2 border-gray-250 rounded-xl cursor-pointer bg-white hover:bg-gray-50 flex flex-col items-center text-center transition-all"
          :class="{ 'selected bg-blue-50 border-blue-500': selectedQ2 === 'local' }"
        >
          <div class="text-5xl mb-3">👥</div>
          <p class="text-gray-900 font-bold text-sm">로컬 & 사람냄새</p>
          <p class="text-gray-500 text-xs mt-2">맛있는 먹거리와 북적이는<br>전통/시장의 매력.</p>
        </div>
      </div>
    </div>

    <!-- Loading Step -->
    <div v-if="currentStep === 3" class="absolute inset-0 flex flex-col items-center justify-center text-center fade-in">
      <div class="mb-8">
        <div class="relative w-16 h-16 mx-auto">
          <svg class="w-16 h-16 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="color: #e5e7eb;"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="color: #3b82f6;"></path>
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        취향 분석 중...
      </h2>
      <p class="text-gray-500 text-sm max-w-sm">
        당신에게 딱 맞는 축제를 추천하기 위해 분석 중입니다.
      </p>
    </div>
  </div>
</template>

<style scoped>
.quiz-option {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-color: #d1d5db;
}

.quiz-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08);
}

.quiz-option.selected {
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.15);
}
</style>