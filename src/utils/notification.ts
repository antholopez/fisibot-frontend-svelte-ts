import Notify from "simple-notify";

type status = "success" | "error" | "warning" | "info";
export const notify = (status: status, title: string, text?: string) => {
  try {
    new Notify({
      status,
      title,
      text,
      effect: "slide",
      speed: 300,
      customClass: "",
      customIcon: "",
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 5000,
      gap: 20,
      distance: 20,
      type: 1,
      position: "right bottom",
    });
  } catch (error) {
    console.log("notify error: ", error);
  }
};
