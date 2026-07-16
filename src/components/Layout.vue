<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const resetQuiz = () => {
  router.push('/')
}

const goToCommunity = () => {
  const storedContentId = typeof window !== 'undefined' ? window.sessionStorage.getItem('selectedFestivalContentId') : null

  if (!storedContentId) {
    router.replace('/')
    return
  }

  router.push('/result')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Navigation -->
    <nav class="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex items-center cursor-pointer group" @click="resetQuiz">
            <i class="fas fa-compass text-blue-500 mr-2 text-xl"></i>
            <span class="text-lg font-bold text-gray-900">Busan</span>
            <span class="text-lg font-bold text-blue-500 ml-1">Vibe Match</span>
          </div>
          
          <!-- Navigation Links (hidden on mobile) -->
          <div class="hidden md:flex space-x-8">
            <a href="/" class="text-gray-600 hover:text-gray-900 font-medium text-sm transition">
              Vibe 테스트
            </a>
            <a
              href="/result"
              class="text-gray-600 hover:text-gray-900 font-medium text-sm transition"
              @click.prevent="goToCommunity"
            >
              축제 커뮤니티
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 py-8 mt-16">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p class="text-sm text-gray-500">&copy; 2026 LocalHub - 부산 축제 Vibe-Match</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>