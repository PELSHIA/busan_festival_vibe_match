const QUESTION_POOL = [
  {
    id: 'Q1',
    question: '오늘 당신의 에너지 상태는?',
    options: [
      { label: '에너지 200%! 밖으로!', value: 'PASSION' },
      { label: '조용히 쉬고 싶어', value: 'HEALING' }
    ]
  },
  {
    id: 'Q2',
    question: '이번 주말 누구와 함께 떠나나요?',
    options: [
      { label: '왁자지껄한 친구들과', value: 'LOCAL' },
      { label: '사랑하는 사람과 단둘이', value: 'ROMANTIC' }
    ]
  },
  {
    id: 'Q3',
    question: '나의 여행 스타일을 고른다면?',
    options: [
      { label: '축제/액티비티 체험', value: 'PASSION' },
      { label: '자연/산책/전시 관람', value: 'HEALING' }
    ]
  },
  {
    id: 'Q4',
    question: '부산의 밤 어떤 분위기를 원해?',
    options: [
      { label: '야경/드론쇼/선셋', value: 'ROMANTIC' },
      { label: '시장/포차/먹거리', value: 'LOCAL' }
    ]
  },
  {
    id: 'Q5',
    question: '내가 가장 선호하는 휴식 방식은?',
    options: [
      { label: '여유로운 카페/도서관', value: 'HEALING' },
      { label: '밤새 페스티벌/파티', value: 'PASSION' }
    ]
  },
  {
    id: 'Q6',
    question: '여행지에서의 인생샷은 어디서?',
    options: [
      { label: '화려한 빛축제 속', value: 'ROMANTIC' },
      { label: '사람 냄새 나는 시장 골목', value: 'LOCAL' }
    ]
  },
  {
    id: 'Q7',
    question: '나는 어떤 여행을 기억할까?',
    options: [
      { label: '심장이 뛰는 강렬한 추억', value: 'PASSION' },
      { label: '마음이 편안해지는 여유', value: 'HEALING' }
    ]
  },
  {
    id: 'Q8',
    question: '나의 주말 “최애” 활동은?',
    options: [
      { label: '맛집 탐방/로컬 구경', value: 'LOCAL' },
      { label: '전시/공연/포토존', value: 'ROMANTIC' }
    ]
  }
]

export const pickQuestions = (count = 3) => {
  const pool = [...QUESTION_POOL]
  const safeCount = Math.min(count, pool.length)

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]]
  }

  return pool.slice(0, safeCount)
}

export const resolveVibe = (votes) => {
  if (!votes || votes.length === 0) return null

  if (votes.length === 1) return votes[0]

  const counts = votes.reduce((acc, vote) => {
    acc[vote] = (acc[vote] || 0) + 1
    return acc
  }, {})

  const highestCount = Math.max(...Object.values(counts))
  const topVibes = Object.entries(counts)
    .filter(([, count]) => count === highestCount)
    .map(([vibe]) => vibe)

  if (topVibes.length === 1) {
    return topVibes[0]
  }

  return votes[votes.length - 1]
}

export const getEligibleFestivals = (festivals, vibe, referenceDate = new Date()) => {
  const targetDate = new Date(referenceDate)
  const today = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())

  const normalizedVibe = vibe ? String(vibe).toUpperCase() : null

  const allVibeMatched = festivals.filter((festival) => {
    if (!normalizedVibe) return true
    return String(festival.vibe).toUpperCase() === normalizedVibe
  })

  const activeVibeMatched = allVibeMatched.filter((festival) => {
    if (!festival.startDate || !festival.endDate) return false

    const start = new Date(`${festival.startDate}T00:00:00`)
    const end = new Date(`${festival.endDate}T23:59:59`)

    return start <= today && end >= today
  })

  if (activeVibeMatched.length > 0) {
    return activeVibeMatched
  }

  return allVibeMatched
}

export const findFestivalByContentId = (festivals, contentId) => {
  if (!contentId) return null

  return festivals.find((festival) => String(festival.contentid) === String(contentId)) || null
}

export const recommendFestival = (festivals, vibes, referenceDate = new Date()) => {
  const finalVibe = resolveVibe(vibes)
  const candidates = getEligibleFestivals(festivals, finalVibe, referenceDate)

  if (candidates.length === 0) {
    return null
  }

  const shuffled = [...candidates]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }

  return shuffled[0]
}
