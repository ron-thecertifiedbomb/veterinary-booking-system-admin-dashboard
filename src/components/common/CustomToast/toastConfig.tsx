import { ToastConfig } from "react-native-toast-message";
import CustomToast from "@/components/common/CustomToast/CustomToast";

export const toastConfig: ToastConfig = {
  success: (props) => <CustomToast {...props} />,
  error: (props) => <CustomToast {...props} />,
};