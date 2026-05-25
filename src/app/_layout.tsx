import Toast from "react-native-toast-message";
import "../global.css";
import { Slot } from "expo-router";


export default function RootLayout() {
  return (
    <>
    <Slot />
      <Toast />
    </>
  );
}