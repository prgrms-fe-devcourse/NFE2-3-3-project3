import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { problemAPI } from "@/api/problem";
import { useToast } from "primevue/usetoast";

const MAX_LENGTH = {
  TITLE: 20,
  SOURCE: 20,
  CATEGORY: 20,
};

const emptyProblem = {
  title: "",
  question: "",
  answer: "",
  explanation: "",
  origin_source: "",
  problem_type: "",
  category: null,
  image_src: "",
  option_one: "",
  option_two: "",
  option_three: "",
  option_four: "",
  shared: false,
};

const validateField = (field, value) => {
  // 빈 문자열 체크 - 문자열인 경우에만 trim 적용
  if (typeof value === "string") {
    if (!value || value.trim() === "") {
      return {
        isValid: false,
        message: `${field}을(를) 입력해주세요.`,
      };
    }
  } else if (!value) {
    // 문자열이 아닌 경우
    return {
      isValid: false,
      message: `${field}을(를) 입력해주세요.`,
    };
  }

  // 길이 제한 체크
  switch (field) {
    case "title":
      if (typeof value === "string" && value.length > MAX_LENGTH.TITLE) {
        return {
          isValid: false,
          message: `제목은 ${MAX_LENGTH.TITLE}자를 초과할 수 없습니다.`,
        };
      }
      break;
    case "origin_source":
      if (typeof value === "string" && value.length > MAX_LENGTH.SOURCE) {
        return {
          isValid: false,
          message: `출처는 ${MAX_LENGTH.SOURCE}자를 초과할 수 없습니다.`,
        };
      }
      break;
    case "category":
      if (value?.name && value.name.length > MAX_LENGTH.CATEGORY) {
        return {
          isValid: false,
          message: `카테고리명은 ${MAX_LENGTH.CATEGORY}자를 초과할 수 없습니다.`,
        };
      }
      break;
  }

  return { isValid: true };
};

export const useProblemUpdateStore = defineStore("problemUpdate", () => {
  const toast = useToast();
  const isLoading = ref(false);
  const originalProblem = ref(null);
  const editedProblem = ref({ ...emptyProblem });
  const validationErrors = ref({});

  const hasChanges = computed(() => {
    if (!originalProblem.value) return false;

    return Object.keys(emptyProblem).some((key) => {
      if (key === "category") {
        return (
          JSON.stringify(editedProblem.value[key]) !==
          JSON.stringify(originalProblem.value[key])
        );
      }
      return editedProblem.value[key] !== originalProblem.value[key];
    });
  });

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
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  function updateField(field, value) {
    if (field in editedProblem.value) {
      // 유효성 검사 수행
      const validation = validateField(field, value);
      if (!validation.isValid) {
        validationErrors.value[field] = validation.message;
        toast.add({
          severity: "error",
          summary: "입력 오류",
          detail: validation.message,
          life: 3000,
        });
        return false;
      }

      // 유효성 검사 통과시 값 업데이트
      validationErrors.value[field] = null;
      editedProblem.value[field] = value;
      return true;
    } else {
      console.warn(`Unknown field: ${field}`);
      return false;
    }
  }

  function validateAllFields() {
    const requiredFields = ["title", "question", "answer"];
    const errors = {};

    for (const field of requiredFields) {
      const value = editedProblem.value[field];
      const validation = validateField(field, value);
      if (!validation.isValid) {
        errors[field] = validation.message;
      }
    }

    // 출처가 있는 경우에만 유효성 검사
    if (editedProblem.value.origin_source) {
      const sourceValidation = validateField(
        "origin_source",
        editedProblem.value.origin_source,
      );
      if (!sourceValidation.isValid) {
        errors.origin_source = sourceValidation.message;
      }
    }

    // 카테고리 유효성 검사
    if (editedProblem.value.category) {
      const categoryValidation = validateField(
        "category",
        editedProblem.value.category,
      );
      if (!categoryValidation.isValid) {
        errors.category = categoryValidation.message;
      }
    }

    validationErrors.value = errors;
    return Object.keys(errors).length === 0;
  }

  async function saveProblem() {
    const { category } = editedProblem.value;
    try {
      // 전체 유효성 검사 수행
      if (!validateAllFields()) {
        const errorMessages = Object.values(validationErrors.value);
        errorMessages.forEach((message) => {
          toast.add({
            severity: "error",
            summary: "저장 실패",
            detail: message,
            life: 3000,
          });
        });
        return false;
      }

      isLoading.value = true;
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
        title: title.trim(),
        question: question.trim(),
        answer: answer.trim(),
        explanation: explanation?.trim(),
        origin_source: origin_source?.trim(),
        problem_type,
        category_id: category,
        option_one: option_one?.trim(),
        option_two: option_two?.trim(),
        option_three: option_three?.trim(),
        option_four: option_four?.trim(),
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

  function cancelEdit() {
    if (originalProblem.value) {
      editedProblem.value = { ...originalProblem.value };
    } else {
      editedProblem.value = { ...emptyProblem };
    }
    validationErrors.value = {};
  }

  function resetStore() {
    isLoading.value = false;
    originalProblem.value = null;
    editedProblem.value = { ...emptyProblem };
    validationErrors.value = {};
  }

  return {
    isLoading,
    editedProblem,
    validationErrors,
    hasChanges,
    loadProblem,
    updateField,
    saveProblem,
    cancelEdit,
    resetStore,
  };
});