import { NativeModules } from "react-native";
import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "GamePartyFinder",
})
  .useReactNative({
    asyncStorage: false,
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: (stackFrame) => false },
    overlay: true,
  })
  .connect();

Reactotron.clear();

console.tron = Reactotron;
