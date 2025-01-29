import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { problemAPI } from "@/api/problem";
import { useToast } from "primevue/usetoast";

const emptyProblem = {
  title: "",
  question: "",
  answer: "",
  explanation: "",
  origin_source: "",
  problem_type: "",
  category: [],
  image_src: "",
  option_one: "",
  option_two: "",
  option_three: "",
  option_four: "",
  shared: false,
};

export const useProblemUpdateStore = defineStore("problemUpdate", () => {
  const toast = useToast();
  const isLoading = ref(false);
  const originalProblem = ref(null);
  const editedProblem = ref({ ...emptyProblem });

  const hasChanges = computed(() => {
    if (!originalProblem.value) return false;

    return Object.keys(emptyProblem).some((key) => {
      if (key === "category") {
        // 카테고리는 배열이므로 별도 처리
        return (
          JSON.stringify(editedProblem.value[key]) !==
          JSON.stringify(originalProblem.value[key])
        );
      }
      return editedProblem.value[key] !== originalProblem.value[key];
    });
  });

  // 문제 데이터 초기 로드
  const loadProblem = async (problemId) => {
    try {
      isLoading.value = true;
      const data = await problemAPI.getById(problemId);
      if (data) {
        originalProblem.value = { ...data };
        editedProblem.value = { ...data };
      }
    } catch (error) {
      console.error("문제 로딩 실패:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 개별 필드 업데이트
  function updateField(field, value) {
    if (field in editedProblem.value) {
      editedProblem.value[field] = value;
    } else {
      console.warn(`Unknown field: ${field}`);
    }
  }

  // 여러 필드 동시 업데이트
  function updateFields(updates) {
    Object.entries(updates).forEach(([field, value]) => {
      if (field in editedProblem.value) {
        editedProblem.value[field] = value;
      }
    });
  }

  // 수정사항 저장
  async function saveProblem() {
    try {
      isLoading.value = true;
      // author 필드 제거 및 필요한 필드만 추출
      const {
        id,
        title,
        question,
        answer,
        explanation,
        origin_source,
        problem_type,
        category,
        option_one,
        option_two,
        option_three,
        option_four,
        shared,
      } = editedProblem.value;

      const updateData = {
        title,
        question,
        answer,
        explanation,
        origin_source,
        problem_type,
        category_id: category?.id,
        option_one,
        option_two,
        option_three,
        option_four,
        shared,
      };

      const data = await problemAPI.update(id, updateData);
      if (data) {
        toast.add({
          severity: "success",
          summary: "수정 완료",
          detail: "문제가 성공적으로 수정되었습니다.",
          life: 3000,
        });
        return true;
      }
    } catch (error) {
      console.error("문제 수정 실패:", error);
      toast.add({
        severity: "error",
        summary: "수정 실패",
        detail: "문제 수정 중 오류가 발생했습니다.",
        life: 3000,
      });
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  // 수정사항 취소
  function cancelEdit() {
    if (originalProblem.value) {
      editedProblem.value = { ...originalProblem.value };
    } else {
      editedProblem.value = { ...emptyProblem };
    }
  }

  // store 초기화
  function resetStore() {
    isLoading.value = false;
    originalProblem.value = null;
    editedProblem.value = { ...emptyProblem };
  }

  return {
    isLoading,
    editedProblem,
    hasChanges,
    loadProblem,
    updateField,
    updateFields,
    saveProblem,
    cancelEdit,
    resetStore,
  };
});
