<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps({
  festival: Object
})

const mapContainer = ref(null)
const mapInstance = ref(null)
const markerInstance = ref(null)
const mapError = ref('')
let scriptPromise = null

const hasCoordinates = computed(() => {
  const mapx = Number(props.festival?.mapx)
  const mapy = Number(props.festival?.mapy)
  return Number.isFinite(mapx) && Number.isFinite(mapy)
})

const kakaoMapUrl = computed(() => {
  if (!hasCoordinates.value) return ''

  const mapx = Number(props.festival.mapx)
  const mapy = Number(props.festival.mapy)
  const title = encodeURIComponent(props.festival?.title || '부산 축제')

  return `https://map.kakao.com/link/map/${title},${mapy},${mapx}`
})

const openKakaoMap = () => {
  if (!kakaoMapUrl.value) return
  window.open(kakaoMapUrl.value, '_blank', 'noopener,noreferrer')
}

const getApiKey = () => {
  const envKey = (import.meta.env.VITE_KAKAO_MAP_API_KEY || import.meta.env.KAKAO_MAP_API_KEY || '').trim()
  return envKey || 'f1c7025ea1dbdf67bbb3fa3c5ba07ba0'
}

const loadKakaoMap = () => {
  if (window.kakao?.maps) {
    return Promise.resolve()
  }

  if (scriptPromise) {
    return scriptPromise
  }

  const apiKey = getApiKey()

  if (!apiKey) {
    mapError.value = '카카오 지도 API 키를 불러올 수 없습니다.'
    return Promise.resolve()
  }

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      mapError.value = '카카오 지도 SDK가 차단되어 직접 연결로 확인합니다.'
      resolve()
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

const renderMap = async () => {
  if (!mapContainer.value || !hasCoordinates.value) {
    mapError.value = ''
    return
  }

  try {
    await loadKakaoMap()

    if (!window.kakao?.maps) {
      mapError.value = '카카오 지도를 불러오지 못했습니다.'
      return
    }

    await new Promise((resolve) => {
      window.kakao.maps.load(() => resolve())
    })

    const mapx = Number(props.festival.mapx)
    const mapy = Number(props.festival.mapy)
    const position = new window.kakao.maps.LatLng(mapy, mapx)

    if (!mapInstance.value) {
      mapInstance.value = new window.kakao.maps.Map(mapContainer.value, {
        center: position,
        level: 3
      })
    } else {
      mapInstance.value.setCenter(position)
    }

    if (!markerInstance.value) {
      markerInstance.value = new window.kakao.maps.Marker({
        position
      })
      markerInstance.value.setMap(mapInstance.value)
    } else {
      markerInstance.value.setPosition(position)
      markerInstance.value.setMap(mapInstance.value)
    }

    mapInstance.value.relayout()
    mapError.value = ''
  } catch (error) {
    console.error(error)
    mapError.value = '카카오 지도 SDK가 차단되어 직접 연결로 확인합니다.'
  }
}

onMounted(() => {
  nextTick(() => {
    renderMap()
  })
})

watch(
  () => [props.festival?.contentid, props.festival?.mapx, props.festival?.mapy],
  () => {
    nextTick(() => {
      renderMap()
    })
  }
)
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
    <div class="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
      <h3 class="font-bold text-lg text-gray-900">📍 위치</h3>
      <button class="w-8 h-8 text-gray-400 hover:text-gray-600 transition">
        <i class="fas fa-external-link-alt"></i>
      </button>
    </div>

    <div class="flex-grow relative bg-gray-100 overflow-hidden">
      <div v-if="!hasCoordinates || mapError" class="absolute inset-0 flex items-center justify-center z-10 px-6 bg-gray-100">
        <div class="text-center">
          <div class="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-map-pin"></i>
          </div>
          <p class="text-gray-700 font-bold mb-1">{{ festival?.title || '추천 축제' }}</p>
          <p class="text-gray-500 text-xs">{{ mapError || festival?.addr1 || '부산' }}</p>
          <button
            v-if="kakaoMapUrl"
            class="mt-3 inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            @click="openKakaoMap"
          >
            <i class="fas fa-external-link-alt mr-2"></i>
            카카오맵에서 보기
          </button>
        </div>
      </div>

      <div v-else ref="mapContainer" class="w-full h-full"></div>
    </div>
  </div>
</template>

<style scoped>
</style>