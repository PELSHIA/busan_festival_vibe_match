import test from 'node:test'
import assert from 'node:assert/strict'
import { findFestivalByContentId, pickQuestions, recommendFestival, resolveVibe } from './festivalRecommender.mjs'

test('pickQuestions returns three unique questions from the full pool', () => {
  const questions = pickQuestions(3)

  assert.equal(questions.length, 3)
  assert.equal(new Set(questions.map((question) => question.id)).size, 3)
  assert.ok(questions.every((question) => question.id))
})

test('resolveVibe uses the last answer when votes are split', () => {
  const vibe = resolveVibe(['PASSION', 'HEALING', 'LOCAL'])

  assert.equal(vibe, 'LOCAL')
})

test('recommendFestival returns a vibe-matched festival when candidates exist', () => {
  const festivals = [
    {
      title: 'Romantic Festival',
      vibe: 'ROMANTIC',
      startDate: '2026-01-01',
      endDate: '2026-12-31'
    },
    {
      title: 'Healing Festival',
      vibe: 'HEALING',
      startDate: '2026-01-01',
      endDate: '2026-12-31'
    }
  ]

  const recommendation = recommendFestival(festivals, ['ROMANTIC', 'ROMANTIC', 'ROMANTIC'], new Date('2026-07-15'))

  assert.equal(recommendation.title, 'Romantic Festival')
})

test('recommendFestival returns null when no vibe-specific candidates exist across all dates', () => {
  const festivals = [
    {
      title: 'Fallback Festival',
      vibe: 'HEALING',
      startDate: '2026-01-01',
      endDate: '2026-12-31'
    }
  ]

  const recommendation = recommendFestival(festivals, ['PASSION', 'PASSION', 'PASSION'], new Date('2026-07-15'))

  assert.equal(recommendation, null)
})

test('findFestivalByContentId returns the matching festival by contentid', () => {
  const festivals = [
    { contentid: '1001', title: 'Festival One' },
    { contentid: '1002', title: 'Festival Two' }
  ]

  const result = findFestivalByContentId(festivals, '1002')

  assert.equal(result.title, 'Festival Two')
})
