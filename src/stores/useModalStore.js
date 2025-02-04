import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const isVisible = ref(false);
  const modalProps = ref({
    message: "",
    type: "twoBtn",
    onConfirm: null,
    onCancel: null,
  });

  const openModal = ({
    message,
    type = "twoBtn",
    onConfirm = null,
    onCancel = null,
  }) => {
    modalProps.value = { message, type, onConfirm, onCancel };
    isVisible.value = true;
  };

  const closeModal = () => {
    isVisible.value = false;
    modalProps.value = {
      message: "",
      type: "twoBtn",
      onConfirm: null,
      onCancel: null,
    };
  };

  return {
    isVisible,
    modalProps,
    openModal,
    closeModal,
  };
});
