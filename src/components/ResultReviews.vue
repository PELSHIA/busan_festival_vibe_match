<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  festival: Object,
  writeTrigger: Number
})

const STORAGE_KEY = 'festival-reviews'
const reviews = ref([])
const showWriteModal = ref(false)
const showDetailModal = ref(false)
const showActionModal = ref(false)
const selectedReview = ref(null)
const successMessage = ref('')
const hoveredReviewId = ref(null)
const activeReviewId = ref(null)
const actionMode = ref('edit')
const actionPassword = ref('')
const actionError = ref('')

const formData = ref({
  title: '',
  author: '',
  content: '',
  password: ''
})
const errors = ref({
  title: '',
  author: '',
  content: '',
  password: ''
})

const editForm = ref({
  title: '',
  author: '',
  content: ''
})
const editErrors = ref({
  title: '',
  author: '',
  content: ''
})

const loadReviews = () => {
  if (!props.festival?.contentid) return
  
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return

  try {
    const parsed = JSON.parse(saved)
    const allReviews = Array.isArray(parsed) ? parsed : []
    // festival.contentid와 일치하는 festivalId만 필터링
    reviews.value = allReviews.filter(review => review.festivalId === props.festival.contentid)
  } catch (error) {
    console.error('리뷰 저장소를 불러오지 못했습니다.', error)
    reviews.value = []
  }
}

const saveReviews = () => {
  if (!props.festival?.contentid) return
  
  // 1. 기존 로컬스토리지의 모든 리뷰 로드
  const saved = localStorage.getItem(STORAGE_KEY)
  const allReviews = saved ? JSON.parse(saved) : []
  
  // 2. 현재 축제가 아닌 리뷰들만 필터링 (다른 축제 리뷰 보존)
  const otherFestivals = allReviews.filter(review => review.festivalId !== props.festival.contentid)
  
  // 3. 현재 축제 리뷰 + 다른 축제 리뷰 합쳐서 저장
  const updated = [...reviews.value, ...otherFestivals]
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

const resetForm = () => {
  formData.value = {
    title: '',
    author: '',
    content: '',
    password: ''
  }
  errors.value = {
    title: '',
    author: '',
    content: '',
    password: ''
  }
}

const resetEditForm = () => {
  editForm.value = {
    title: '',
    author: '',
    content: ''
  }
  editErrors.value = {
    title: '',
    author: '',
    content: ''
  }
}

const openWriteModal = () => {
  successMessage.value = ''
  resetForm()
  showWriteModal.value = true
}

const closeWriteModal = () => {
  showWriteModal.value = false
  resetForm()
}

const validatePasswordInput = (password) => /^\d{4}$/.test(password)

const validateForm = () => {
  const nextErrors = {
    title: '',
    author: '',
    content: '',
    password: ''
  }

  if (!formData.value.title.trim()) {
    nextErrors.title = '제목을 입력해주세요.'
  } else if (formData.value.title.trim().length > 50) {
    nextErrors.title = '제목은 50자 이하로 입력해주세요.'
  }

  if (!formData.value.author.trim()) {
    nextErrors.author = '작성자를 입력해주세요.'
  }

  if (!formData.value.content.trim()) {
    nextErrors.content = '내용을 입력해주세요.'
  } else if (formData.value.content.trim().length > 500) {
    nextErrors.content = '내용은 500자 이하로 입력해주세요.'
  }

  if (!formData.value.password.trim()) {
    nextErrors.password = '비밀번호를 입력해주세요.'
  } else if (!validatePasswordInput(formData.value.password.trim())) {
    nextErrors.password = '비밀번호는 4자리 숫자로 입력해주세요.'
  }

  errors.value = nextErrors
  return !Object.values(nextErrors).some(Boolean)
}

const submitReview = () => {
  if (!validateForm()) return

  const review = {
    id: Date.now(),
    festivalId: props.festival.contentid,
    title: formData.value.title.trim(),
    author: formData.value.author.trim(),
    content: formData.value.content.trim(),
    password: formData.value.password.trim(),
    date: new Date().toLocaleDateString('ko-KR'),
    views: 0
  }

  reviews.value.unshift(review)
  saveReviews()
  successMessage.value = '저장되었습니다. 새 글이 게시판에 등록됐습니다.'
  closeWriteModal()
}

const openDetailModal = (review) => {
  const target = reviews.value.find((item) => item.id === review.id)
  if (!target) return

  target.views = (target.views || 0) + 1
  saveReviews()

  selectedReview.value = { ...target }
  showDetailModal.value = true
  activeReviewId.value = review.id
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedReview.value = null
  actionPassword.value = ''
  actionError.value = ''
  activeReviewId.value = null
}

const openEditModal = (review) => {
  selectedReview.value = review
  editForm.value = {
    title: review.title,
    author: review.author,
    content: review.content
  }
  editErrors.value = {
    title: '',
    author: '',
    content: ''
  }
  actionMode.value = 'edit'
  actionPassword.value = ''
  actionError.value = ''
  showActionModal.value = true
  activeReviewId.value = review.id
}

const openDeleteModal = (review) => {
  selectedReview.value = review
  actionMode.value = 'delete'
  actionPassword.value = ''
  actionError.value = ''
  showActionModal.value = true
  activeReviewId.value = review.id
}

const closeActionModal = () => {
  showActionModal.value = false
  actionPassword.value = ''
  actionError.value = ''
  resetEditForm()
  activeReviewId.value = null
}

const validateEditForm = () => {
  const nextErrors = {
    title: '',
    author: '',
    content: ''
  }

  if (!editForm.value.title.trim()) {
    nextErrors.title = '제목을 입력해주세요.'
  } else if (editForm.value.title.trim().length > 50) {
    nextErrors.title = '제목은 50자 이하로 입력해주세요.'
  }

  if (!editForm.value.author.trim()) {
    nextErrors.author = '작성자를 입력해주세요.'
  }

  if (!editForm.value.content.trim()) {
    nextErrors.content = '내용을 입력해주세요.'
  } else if (editForm.value.content.trim().length > 500) {
    nextErrors.content = '내용은 500자 이하로 입력해주세요.'
  }

  editErrors.value = nextErrors
  return !Object.values(nextErrors).some(Boolean)
}

const submitEditReview = () => {
  if (!selectedReview.value) return

  if (!validatePasswordInput(actionPassword.value)) {
    actionError.value = '4자리 숫자 비밀번호를 입력해주세요.'
    return
  }

  if (actionPassword.value !== selectedReview.value.password) {
    actionError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  if (!validateEditForm()) return

  const index = reviews.value.findIndex((item) => item.id === selectedReview.value.id)
  if (index === -1) return

  reviews.value[index] = {
    ...reviews.value[index],
    title: editForm.value.title.trim(),
    author: editForm.value.author.trim(),
    content: editForm.value.content.trim()
  }

  saveReviews()
  selectedReview.value = { ...reviews.value[index] }
  successMessage.value = '수정되었습니다.'
  
  // 수정/삭제 모달과 상세 모달을 모두 닫습니다.
  closeActionModal()
  closeDetailModal() 
}

const deleteReview = () => {
  if (!selectedReview.value) return

  if (!validatePasswordInput(actionPassword.value)) {
    actionError.value = '4자리 숫자 비밀번호를 입력해주세요.'
    return
  }

  if (actionPassword.value !== selectedReview.value.password) {
    actionError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  reviews.value = reviews.value.filter((item) => item.id !== selectedReview.value.id)
  saveReviews()
  successMessage.value = '삭제되었습니다.'
  
  // 수정/삭제 모달과 상세 모달을 모두 닫습니다.
  closeActionModal()
  closeDetailModal()
}

watch(() => props.festival?.contentid, (contentId) => {
  // contentId가 실제로 값이 있을 때만 로드
  if (contentId) {
    loadReviews()
  }
})

watch(() => props.writeTrigger, () => {
  openWriteModal()
})

onMounted(() => {
  // festival 데이터가 없으면 다시 확인
  if (props.festival?.contentid) {
    loadReviews()
  }
})
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden slide-up" style="animation-delay: 0.3s;">
    <div class="px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50">
      <div>
        <h3 class="font-bold text-xl text-gray-900">💬 로컬 꿀팁 게시판</h3>
        <p class="text-sm text-gray-500 mt-1">이 축제에 다녀온 사람들의 생생한 후기</p>
      </div>
      <button
        @click="openWriteModal"
        class="mt-4 md:mt-0 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition flex items-center justify-center"
      >
        <i class="fas fa-pen mr-2"></i>
        글쓰기
      </button>
    </div>

    <div v-if="successMessage" class="mx-8 mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {{ successMessage }}
    </div>

    <div class="bg-white">
      <div class="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
        <div class="col-span-2">작성자</div>
        <div class="col-span-6">제목</div>
        <div class="col-span-2">작성일</div>
        <div class="col-span-2">조회</div>
      </div>

      <ul class="divide-y divide-gray-200">
        <li v-if="reviews.length === 0" class="py-20 flex flex-col items-center justify-center text-gray-400">
          <i class="fas fa-comments text-4xl mb-4 opacity-30"></i>
          <p class="font-semibold">아직 리뷰가 없습니다</p>
          <p class="text-sm mt-1">첫 번째 리뷰를 작성해보세요!</p>
        </li>

        <li
          v-for="review in reviews"
          :key="review.id"
          class="px-6 md:px-8 py-4 transition border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
          @mouseenter="hoveredReviewId = review.id"
          @mouseleave="hoveredReviewId = null"
          @click="openDetailModal(review)"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div class="flex-1 md:grid md:grid-cols-12 md:gap-4">
              <div class="font-medium text-gray-900 mb-2 md:mb-0 md:col-span-2 text-sm">{{ review.author }}</div>
              <div class="text-gray-700 text-sm mb-2 md:mb-0 md:col-span-6 font-semibold">{{ review.title }}</div>
              <div class="text-gray-500 text-xs mb-2 md:mb-0 md:col-span-2">{{ review.date }}</div>
              <div class="text-gray-500 text-xs md:col-span-2">{{ review.views }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <div
    v-if="showWriteModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div class="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 class="font-bold text-lg text-gray-900">축제 리뷰 작성</h3>
        <button
          @click="closeWriteModal"
          class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="p-8">
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-900 mb-2">제목</label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="명당 자리, 꿀팁 등"
            class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
            :class="errors.title ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errors.title" class="mt-2 text-sm text-red-500">{{ errors.title }}</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-900 mb-2">작성자</label>
          <input
            v-model="formData.author"
            type="text"
            placeholder="닉네임을 입력해주세요"
            class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
            :class="errors.author ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errors.author" class="mt-2 text-sm text-red-500">{{ errors.author }}</p>
        </div>

        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-bold text-gray-900">내용</label>
            <span class="text-xs text-gray-500">{{ formData.content.length }} / 500</span>
          </div>
          <textarea
            v-model="formData.content"
            placeholder="생생한 후기를 작성해주세요"
            rows="5"
            class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm resize-none"
            :class="errors.content ? 'border-red-500' : 'border-gray-300'"
          ></textarea>
          <p v-if="errors.content" class="mt-2 text-sm text-red-500">{{ errors.content }}</p>
        </div>

        <div class="mb-8">
          <label class="block text-sm font-bold text-gray-900 mb-2">수정/삭제용 비밀번호</label>
          <input
            v-model="formData.password"
            type="password"
            inputmode="numeric"
            pattern="\\d*"
            maxlength="4"
            @input="formData.password = $event.target.value.replace(/\D/g, '').slice(0,4)"
            placeholder="4자리 숫자를 입력해주세요"
            class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
            :class="errors.password ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errors.password" class="mt-2 text-sm text-red-500">{{ errors.password }}</p>
        </div>

        <div class="flex gap-3">
          <button
            @click="closeWriteModal"
            class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            @click="submitReview"
            class="flex-1 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showDetailModal && selectedReview"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
      <div class="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <p class="text-sm text-gray-500">{{ selectedReview.date }}</p>
          <h3 class="font-bold text-lg text-gray-900">{{ selectedReview.title }}</h3>
        </div>
        <button
          @click="closeDetailModal"
          class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="p-8">
  <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-sm text-gray-500 mb-4">
    <span>작성자: {{ selectedReview.author }}</span>
    <span>조회 {{ selectedReview.views }}</span>
  </div>

  <div class="rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700 whitespace-pre-line">
    {{ selectedReview.content }}
  </div>

  <div class="mt-6 flex justify-end gap-3">
    <button
      @click.stop="openDeleteModal(selectedReview)"
      class="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
    >
      삭제
    </button>
    <button
      @click.stop="openEditModal(selectedReview)"
      class="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
    >
      수정
    </button>
  </div>
</div>
    </div>
  </div>

  <div
    v-if="showActionModal && selectedReview"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div class="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 class="font-bold text-lg text-gray-900">
          {{ actionMode === 'edit' ? '게시글 수정' : '게시글 삭제' }}
        </h3>
        <button
          @click="closeActionModal"
          class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="p-8">
        <div v-if="actionError" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ actionError }}
        </div>

        <div v-if="actionMode === 'edit'" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">제목</label>
            <input
              v-model="editForm.title"
              type="text"
              class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
              :class="editErrors.title ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="editErrors.title" class="mt-2 text-sm text-red-500">{{ editErrors.title }}</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">작성자</label>
            <input
              v-model="editForm.author"
              type="text"
              class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
              :class="editErrors.author ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="editErrors.author" class="mt-2 text-sm text-red-500">{{ editErrors.author }}</p>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-bold text-gray-900">내용</label>
              <span class="text-xs text-gray-500">{{ editForm.content.length }} / 500</span>
            </div>
            <textarea
              v-model="editForm.content"
              rows="5"
              class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm resize-none"
              :class="editErrors.content ? 'border-red-500' : 'border-gray-300'"
            ></textarea>
            <p v-if="editErrors.content" class="mt-2 text-sm text-red-500">{{ editErrors.content }}</p>
          </div>
        </div>

        <div v-else class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          정말로 삭제하시겠어요? 삭제된 글은 복구할 수 없습니다.
        </div>

        <div class="mt-6">
          <label class="block text-sm font-bold text-gray-900 mb-2">비밀번호 (4자리 숫자)</label>
          <input
            v-model="actionPassword"
            type="password"
            inputmode="numeric"
            pattern="\\d*"
            maxlength="4"
            @input="actionPassword = $event.target.value.replace(/\D/g, '').slice(0,4)"
            placeholder="4자리 숫자를 입력해주세요"
            class="w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
          />
        </div>

        <div class="mt-6 flex gap-3">
          <button
            @click="closeActionModal"
            class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            @click="actionMode === 'edit' ? submitEditReview() : deleteReview()"
            class="flex-1 py-3 text-white rounded-lg font-bold transition"
            :class="actionMode === 'edit' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'"
          >
            {{ actionMode === 'edit' ? '수정 완료' : '삭제하기' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>