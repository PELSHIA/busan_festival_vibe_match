<script setup>
import { computed, ref } from 'vue'
import { applyFestivalShareMeta, buildFestivalShareUrl } from '../utils/festivalShare.mjs'

const props = defineProps({
  festival: Object,
  vibe: String
})

const shareMessage = ref('')
const showShareModal = ref(false)
const visitMessage = ref('')
const showVisitToast = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return '정보 없음'
  return dateString.replace(/-/g, '.')
}

const shareUrl = computed(() => buildFestivalShareUrl(props.festival, window.location.href))

const handleVisitPlan = () => {
  visitMessage.value = '방문 예정이 확인되었습니다.'
  showVisitToast.value = true
  window.setTimeout(() => {
    showVisitToast.value = false
  }, 1800)
}

const handleShare = async () => {
  applyFestivalShareMeta(props.festival, window.location.href)

  if (navigator.share) {
    try {
      await navigator.share({
        title: props.festival?.title || '부산 축제 바이브 매칭',
        text: `${props.festival?.title || '부산 축제'}를 추천받았어요.`,
        url: shareUrl.value
      })
      shareMessage.value = '공유가 완료되었습니다.'
      return
    } catch (error) {
      shareMessage.value = '공유를 취소했습니다.'
      return
    }
  }

  showShareModal.value = true
  shareMessage.value = '링크를 복사해서 SNS에 공유해보세요.'
}

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    shareMessage.value = '공유 링크가 복사되었습니다.'
  } catch (error) {
    shareMessage.value = '복사에 실패했습니다. 직접 링크를 복사해주세요.'
  }
}

const closeShareModal = () => {
  showShareModal.value = false
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
        <button
          @click="handleVisitPlan"
          class="flex-1 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2"
        >
          <i class="fas fa-thumbs-up"></i>
          방문 예정
        </button>
        <button
          @click="handleShare"
          class="flex-1 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2"
        >
          <i class="fas fa-share-alt"></i>
          공유하기
        </button>
        <button
          @click="$emit('open-review-write')"
          class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <i class="fas fa-pen"></i>
          리뷰 쓰기
        </button>
      </div>

      <div v-if="showVisitToast" class="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        {{ visitMessage }}
      </div>

      <div v-if="shareMessage" class="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        {{ shareMessage }}
      </div>
    </div>
  </section>

  <div
    v-if="showShareModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 class="font-bold text-lg text-gray-900">공유하기</h3>
        <button @click="closeShareModal" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div class="p-6 space-y-4">
        <p class="text-sm text-gray-600">카카오톡, 인스타그램, 메신저 등으로 공유할 수 있도록 링크를 준비했습니다.</p>
        <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm break-all text-gray-700">{{ shareUrl }}</div>
        <button @click="copyShareLink" class="w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 transition">
          링크 복사하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>