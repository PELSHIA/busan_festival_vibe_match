<script setup>
const props = defineProps({
  festival: Object,
  vibe: String
})

const formatDate = (dateString) => {
  if (!dateString) return '정보 없음'
  return dateString.replace(/-/g, '.')
}
</script>

<template>
  <section class="rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 slide-up" style="animation-delay: 0.1s;">
    <div class="h-64 md:h-80 relative overflow-hidden bg-gray-900">
      <img
        :src="festival?.firstimage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200'"
        :alt="festival?.title || 'festival'"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-6">
        <div class="text-white">
          <p class="text-sm mb-1">🎭 축제공연행사 · {{ vibe }}</p>
          <h1 class="text-2xl md:text-3xl font-bold">{{ festival?.title || '추천 축제를 불러오는 중입니다.' }}</h1>
          <p class="text-sm text-gray-300 mt-2">{{ festival?.comment || '당신의 오늘의 부산 바이브에 맞는 축제를 찾고 있습니다.' }}</p>
        </div>
      </div>
    </div>

    <div class="p-6 md:p-8 bg-white">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <p class="text-xs text-gray-500 font-bold mb-1">위치</p>
          <p class="text-sm font-bold text-gray-900">📍 {{ festival?.addr1 || '부산' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-bold mb-1">행사 기간</p>
          <p class="text-sm font-bold text-gray-900">📅 {{ formatDate(festival?.startDate) }} ~ {{ formatDate(festival?.endDate) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-bold mb-1">연락처</p>
          <p class="text-sm font-bold text-gray-900">📞 {{ festival?.tel || '정보 없음' }}</p>
        </div>
      </div>

      <div class="flex gap-3">
        <button class="flex-1 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2">
          <i class="fas fa-thumbs-up"></i>
          방문 예정
        </button>
        <button class="flex-1 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2">
          <i class="fas fa-share-alt"></i>
          공유하기
        </button>
        <button class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
          <i class="fas fa-pen"></i>
          리뷰 쓰기
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>