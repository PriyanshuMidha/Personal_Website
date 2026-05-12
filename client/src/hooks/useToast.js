import { useContext } from "react";
import { ToastContext } from "../components/ToastProvider";

const useToast = () => useContext(ToastContext);

export default useToast;
