import { createRouter, createWebHistory } from 'vue-router'
import QuizView from '../views/QuizView.vue'
import ResultView from '../views/ResultView.vue'

const routes = [
  {
    path: '/',
    name: 'Quiz',
    component: QuizView
  },
  {
    path: '/result',
    name: 'Result',
    component: ResultView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router