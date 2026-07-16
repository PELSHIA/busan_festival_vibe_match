<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  festival: Object
})

const currentMonth = ref(new Date())

const parseDate = (dateString) => {
  if (!dateString) return null
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startDate = computed(() => parseDate(props.festival?.startDate))
const endDate = computed(() => parseDate(props.festival?.endDate))

watch(
  () => props.festival?.startDate,
  (newStartDate) => {
    if (newStartDate) {
      currentMonth.value = parseDate(newStartDate)
    }
  },
  { immediate: true }
)

const calendarDays = computed(() => {
  const base = currentMonth.value || new Date()
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
  const firstDay = new Date(base.getFullYear(), base.getMonth(), 1).getDay()
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
})

const eventDateKeys = computed(() => {
  if (!startDate.value || !endDate.value) return []

  const dates = []
  const current = new Date(startDate.value)

  while (current <= endDate.value) {
    dates.push(formatDateKey(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
})

const isEventDate = (day) => {
  if (!day || !currentMonth.value) return false

  const key = `${currentMonth.value.getFullYear()}-${String(currentMonth.value.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return eventDateKeys.value.includes(key)
}

const goPrevMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

const goNextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
    <div class="p-6 border-b border-gray-200 bg-gray-50">
      <h3 class="font-bold text-lg text-gray-900">📅 행사 일정</h3>
    </div>

    <div class="p-6 flex-grow flex flex-col overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-bold text-gray-900">
          {{ currentMonth.getFullYear() }}년 {{ currentMonth.getMonth() + 1 }}월
        </h4>

        <div class="flex gap-2">
          <button
            type="button"
            class="w-8 h-8 text-gray-500 hover:text-gray-900 transition"
            @click="goPrevMonth"
          >
            <i class="fas fa-chevron-left text-sm"></i>
          </button>

          <button
            type="button"
            class="w-8 h-8 text-gray-500 hover:text-gray-900 transition"
            @click="goNextMonth"
          >
            <i class="fas fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-2 mb-2 text-xs font-bold text-gray-500 text-center">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>

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
          {{ day ?? '' }}
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 font-bold mb-2">행사 기간</p>
        <p class="font-bold text-gray-900">
          {{ festival?.startDate?.replace(/-/g, '.') }} ~ {{ festival?.endDate?.replace(/-/g, '.') }}
        </p>
      </div>
    </div>
  </div>
</template>