import React from "react";
import * as WifiManager from "react-native-wifi-reborn";
import { PermissionsAndroid } from "react-native";

export const WifiContext = React.createContext({});

export const WifiProvider = (props) => {
  const [networks, setNetworks] = React.useState([]);
  const [currentNetwork, setCurrentNetwork] = React.useState([]);

  React.useEffect(() => {
    getSSID(setCurrentNetwork);
  }, []);

  return (
    <WifiContext.Provider
      value={{
        networks,
        currentNetwork,
      }}
    >
      {props.children}
    </WifiContext.Provider>
  );
};

async function getSSID(setCurrentNetwork) {
  try {
    if (Platform.OS === "ios") {
      const ssid = await WifiManager.default.getCurrentWifiSSID();
      setCurrentNetwork(ssid);
    } else if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location permission is required for WiFi connections",
          message:
            "This app needs location permission as this is required  " +
            "to scan for wifi networks.",
          buttonNegative: "DENY",
          buttonPositive: "ALLOW",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setCurrentNetwork();
      }
    }
  } catch (error) {
    console.error("wifiProvider.js", "getSSID()", error);
  }
}
