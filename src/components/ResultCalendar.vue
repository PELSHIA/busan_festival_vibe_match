<script setup>
import { ref, computed } from 'vue'

const currentMonth = ref(new Date(2026, 8)) // September 2026

const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

const calendarDays = computed(() => {
  const daysInMonth = getDaysInMonth(currentMonth.value)
  const firstDay = getFirstDayOfMonth(currentMonth.value)
  const days = []

  // 빈 칸
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
})

const eventDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

const isEventDate = (day) => day && eventDates.includes(day)
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 bg-gray-50">
      <h3 class="font-bold text-lg text-gray-900">📅 행사 일정</h3>
    </div>

    <!-- Calendar -->
    <div class="p-6 flex-grow flex flex-col overflow-y-auto">
      <!-- Month/Year Header -->
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-bold text-gray-900">{{ currentMonth.getFullYear() }}년 {{ currentMonth.getMonth() + 1 }}월</h4>
        <div class="flex gap-2">
          <button class="w-8 h-8 text-gray-500 hover:text-gray-900 transition">
            <i class="fas fa-chevron-left text-sm"></i>
          </button>
          <button class="w-8 h-8 text-gray-500 hover:text-gray-900 transition">
            <i class="fas fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-2 mb-2 text-xs font-bold text-gray-500 text-center">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-2 text-center text-sm mb-4">
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          class="py-2 rounded-full text-sm font-semibold transition-all"
          :class="{
            'text-gray-300': !day,
            'text-blue-600 bg-blue-100': isEventDate(day),
            'text-gray-900': day && !isEventDate(day)
          }"
        >
          {{ day }}
        </div>
      </div>

      <!-- Event Info -->
      <div class="pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 font-bold mb-2">행사 기간</p>
        <p class="font-bold text-gray-900">2026년 9월 1-15일 (15일간)</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>