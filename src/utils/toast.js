import { toast as hotToast } from "react-hot-toast";

const toast = {
  success: (msg) => hotToast.success(msg),
  error: (msg) => hotToast.error(msg),
  warning: (msg) => hotToast(msg, { icon: "⚠️" }),
};

export default toast;
