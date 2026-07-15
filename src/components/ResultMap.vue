<script setup>
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
      <h3 class="font-bold text-lg text-gray-900">📍 위치</h3>
      <button class="w-8 h-8 text-gray-400 hover:text-gray-600 transition">
        <i class="fas fa-external-link-alt"></i>
      </button>
    </div>

    <!-- Map -->
    <div class="flex-grow relative bg-gray-100 map-bg flex items-center justify-center overflow-hidden group">
      <div class="text-center z-10">
        <div class="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fas fa-map-pin"></i>
        </div>
        <p class="text-gray-700 font-bold mb-1">세계유산위원회 대한민국관(K-Heritage House)</p>
        <p class="text-gray-500 text-xs">부산광역시 해운대구 APEC로 55</p>
      </div>

      <button class="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg shadow-md text-gray-700 hover:bg-gray-50 transition text-sm font-bold hidden group-hover:block">
        <i class="fas fa-expand mr-1"></i>크게보기
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>