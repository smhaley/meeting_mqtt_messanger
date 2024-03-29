import { ToastTypes } from "../constants/toastTypes";

const toastBox = document.getElementById("toastBox");

export const showToast = (
  msg: string,
  toastType: ToastTypes,
  resetTime: number
) => {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add(toastType);
  toast.innerHTML = msg;
  toastBox?.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, resetTime);
};
