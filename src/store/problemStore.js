import { defineStore } from 'pinia'
import { ref } from 'vue'
import { problemAPI } from '@/api/problem'
import { userAPI } from '@/api/user'

export const useProblemStore = defineStore('problem', () => {
  const problem = ref(null)
  const author = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function loadProblem(problemId) {
    try {
      isLoading.value = true
      error.value = null
      
      const data = await problemAPI.getById(problemId)
      if (data) {
        problem.value = data
        
        // 작성자 정보 로딩
        if (data.uid) {
          const userData = await userAPI.getOne(data.uid)
          author.value = userData
        }
      }
    } catch (err) {
      error.value = "문제 로딩 실패: " + err.message
      console.error("문제 로딩 실패:", err)
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    problem.value = null
    author.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    problem,
    author,
    isLoading,
    error,
    loadProblem,
    reset
  }
})