import { Slot} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


export default function WebLayout() {

  return (
    <SafeAreaView>
        <Slot />
    </SafeAreaView>
  );
}
