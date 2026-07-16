<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  festival: Object
})

console.log(props.festival)

const open = ref(false)
const input = ref('')
const messages = ref([])

const loading = ref(false)
const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY || ''

// festival이 변경될 때 초기 메시지 업데이트
watch(() => props.festival?.title, (title) => {
  if (title) {
    messages.value = [
      { role: 'assistant', content: `안녕하십니꺼! ${title}에 대해 물어보이소.` }
    ]
  }
})

const systemIntro = computed(() => {
  if (!props.festival?.title) {
    return '당신은 부산 축제 안내 챗봇이야. 말을 부산 사투리로 해야 해. 존댓말은 부드럽게 쓰고, "그라믄", "아이구", "캡짱", "카이", "머라카노" 같은 표현을 자연스럽게 섞어서 답해라.'
  }
  return `당신은 부산 축제 안내 챗봇이야. 말을 부산 사투리로 해야 해. 존댓말은 부드럽게 쓰고, "그라믄", "아이구", "캡짱", "카이", "머라카노" 같은 표현을 자연스럽게 섞어서 답해라. 축제: ${props.festival.title} - ${props.festival.comment || ''}`
})

function toggle() { open.value = !open.value }

async function sendMessage() {
  const text = input.value.trim()
  if (!text) return

  // 1) 사용자 메시지 추가
  messages.value.push({ role: 'user', content: text })

  // 2) 즉시 입력 초기화 (요청 전 바로 비움)
  input.value = ''

  // 3) 로딩 표시용 플레이스홀더(assistant) 추가
  loading.value = true
  const loadingIndex = messages.value.push({ role: 'assistant', content: '', loading: true }) - 1

  try {
    const payload = {
      model: 'gpt-5-mini',
      messages: [{ role: 'system', content: systemIntro.value }, ...messages.value.map(m => ({ role: m.role, content: m.content }))]
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    })

    const textBody = await res.text()
    if (!res.ok) {
      // 로딩 플레이스홀더를 에러 메시지로 대체
      messages.value[loadingIndex] = { role: 'assistant', content: `API 오류: ${res.status} ${textBody}` }
    } else {
      const data = JSON.parse(textBody)
      const reply = data.choices?.[0]?.message?.content || '응답이 없습니다.'
      messages.value[loadingIndex] = { role: 'assistant', content: reply }
    }
  } catch (e) {
    messages.value[loadingIndex] = { role: 'assistant', content: `통신 오류: ${e.message}` }
  } finally {
    loading.value = false
    // 스크롤을 맨 아래로
    setTimeout(() => {
      const el = document.querySelector('.chat-body')
      if (el) el.scrollTop = el.scrollHeight
    }, 70)
  }
}
</script>

<template>
  <button
  v-if="!open"
  @click="toggle"
  class="fixed right-5 bottom-5 bg-blue-600 text-white rounded-full p-4 shadow-xl z-40 hover:bg-blue-700 transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95">
  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 3C7 3 3 6 3 10c0 1.6.7 3.1 1.9 4.3L5 20l5.7-1.9C12.9 19.5 14.4 20 16 20c5 0 9-3 9-7s-4-10-13-10z" fill="currentColor"/></svg>
</button>

  <transition name="chat-window">
  <div
    v-if="open"
    class="fixed right-5 bottom-5 w-80 max-h-[520px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
  >
    <div class="flex items-center justify-between px-4 py-3 bg-[#0f1724] text-white">
      <div class="flex items-center gap-3">
        <div class="bg-white/10 rounded-full w-9 h-9 flex items-center justify-center">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3C7 3 3 6 3 10c0 1.6.7 3.1 1.9 4.3L5 20l5.7-1.9C12.9 19.5 14.4 20 16 20c5 0 9-3 9-7s-4-10-13-10z" fill="white"/></svg>
        </div>
        <div class="text-sm">
          <div class="font-medium">부산 토박이 AI 챗봇</div>
          <div class="text-xs text-gray-200">안녕하십니꺼! 뭐든 물어보이소.</div>
        </div>
      </div>
      <button @click="toggle" class="text-gray-300 hover:text-white">✕</button>
    </div>

    <div class="chat-body p-3 overflow-auto flex-1 space-y-3">
      <div v-for="(m,i) in messages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
        <!-- Assistant 메시지 (로딩 상태 표시 포함) -->
        <div v-if="m.role === 'assistant'" class="max-w-[85%] bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
          <template v-if="m.loading">
            <div class="typing-dots"><span></span><span></span><span></span></div>
          </template>
          <template v-else>
            <div class="text-sm whitespace-pre-wrap">{{ m.content }}</div>
          </template>
        </div>

        <!-- User 메시지 -->
        <div v-else class="max-w-[85%] bg-blue-600 text-white px-3 py-2 rounded-lg">
          <div class="text-sm">{{ m.content }}</div>
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="px-3 py-3 border-t flex items-center gap-2 bg-white">
      <input
        v-model="input"
        :placeholder="loading ? '응답 대기 중...' : '궁금한 점을 입력하세요...'"
        :disabled="loading"
        class="flex-1 px-3 py-2 border rounded-full text-sm"
      />
      <button type="submit" :disabled="loading || !input.trim()" class="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50">
        <svg v-if="!loading" class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 11l18-8-8 18-2-7-8-3z" fill="currentColor"/></svg>
        <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </form>
  </div>
</transition>
</template>

<style scoped>
.chat-body::-webkit-scrollbar { width: 8px; }
.chat-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 8px; }

/* typing dots */
.typing-dots {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  height: 1rem;
}
.typing-dots span {
  width: 6px;
  height: 6px;
  background: #6b7280;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.2;
  animation: blink 1s infinite;
}
.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.15s; }
.typing-dots span:nth-child(3) { animation-delay: 0.3s; }
@keyframes blink {
  0% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-4px); }
  100% { opacity: 0.2; transform: translateY(0); }
}

.chat-window-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.chat-window-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.chat-window-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.chat-window-enter-active,
.chat-window-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
</style>