<script setup>
import { ref } from 'vue'

const reviews = ref([])
const showWriteModal = ref(false)
const formData = ref({
  title: '',
  content: '',
  password: ''
})
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden slide-up" style="animation-delay: 0.3s;">
    <!-- Header -->
    <div class="px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50">
      <div>
        <h3 class="font-bold text-xl text-gray-900">💬 문광 끝팀 게시판</h3>
        <p class="text-sm text-gray-500 mt-1">이 축제에 다녀온 사람들의 생생한 후기</p>
      </div>
      <button
        @click="showWriteModal = true"
        class="mt-4 md:mt-0 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition flex items-center justify-center"
      >
        <i class="fas fa-pen mr-2"></i>
        글쓰기
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white">
      <!-- Table Header -->
      <div class="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
        <div class="col-span-2">작성자</div>
        <div class="col-span-6">제목</div>
        <div class="col-span-2">작성일</div>
        <div class="col-span-2">조회</div>
      </div>

      <!-- Reviews List -->
      <ul class="divide-y divide-gray-200">
        <li v-if="reviews.length === 0" class="py-20 flex flex-col items-center justify-center text-gray-400">
          <i class="fas fa-comments text-4xl mb-4 opacity-30"></i>
          <p class="font-semibold">아직 리뷰가 없습니다</p>
          <p class="text-sm mt-1">첫 번째 리뷰를 작성해보세요!</p>
        </li>

        <li
          v-for="(review, idx) in reviews"
          :key="idx"
          class="px-6 md:px-8 py-4 md:grid md:grid-cols-12 md:gap-4 hover:bg-gray-50 transition border-b border-gray-200"
        >
          <div class="font-medium text-gray-900 mb-2 md:mb-0 md:col-span-2 text-sm">{{ review.author }}</div>
          <div class="text-gray-700 text-sm mb-2 md:mb-0 md:col-span-6 font-semibold cursor-pointer hover:text-blue-600">{{ review.title }}</div>
          <div class="text-gray-500 text-xs mb-2 md:mb-0 md:col-span-2">{{ review.date }}</div>
          <div class="text-gray-500 text-xs md:col-span-2">{{ review.views }}</div>
        </li>
      </ul>
    </div>
  </section>

  <!-- Write Modal -->
  <div
    v-if="showWriteModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <!-- Modal Header -->
      <div class="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 class="font-bold text-lg text-gray-900">축제 리뷰 작성</h3>
        <button
          @click="showWriteModal = false"
          class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-8">
        <!-- 제목 -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-900 mb-2">제목</label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="멍댱 자리, 꿀팁 등"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
          />
        </div>

        <!-- 내용 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-bold text-gray-900">내용</label>
            <span class="text-xs text-gray-500">0 / 500</span>
          </div>
          <textarea
            v-model="formData.content"
            placeholder="생생한 후기를 남겨주세요!"
            rows="5"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm resize-none"
          ></textarea>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-8">
          <label class="block text-sm font-bold text-gray-900 mb-2">수정/삭제용 비밀번호</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="4자리를 입력해주세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
          />
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button
            @click="showWriteModal = false"
            class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button class="flex-1 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition">
            등록하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>