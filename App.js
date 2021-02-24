import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Buffer } from "buffer";
import { parseRequest } from "./hex";
import { generateDataArray } from "./cmd";
import { bleInit, monitor } from "./BLE";

export default function App() {
  const [characteristics, setCharacteristics] = React.useState([]);

  React.useEffect(() => {
    bleInit(setCharacteristics);
  }, []);

  React.useEffect(() => {
    if (characteristics.length > 0) monitor(characteristics);
  }, [characteristics]);

  const [c] = characteristics.filter((c) => c.isWritableWithResponse);

  return (
    <View style={styles.container}>
      {c && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              try {
                const [cmd] = generateDataArray("setNightLightStatus", true);
                console.log("BLE REQUEST", cmd, parseRequest(cmd));
                await c.writeWithResponse(
                  Buffer.from(cmd, "hex").toString("base64")
                );
              } catch (error) {
                console.log("WRITE ERROR", error);
              }
            }}
          >
            <Text style={styles.buttonText}>I am Groot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            title={"Off"}
            onPress={async () => {
              try {
                const [cmd] = generateDataArray("setNightLightStatus", false);
                console.log("BLE REQUEST", cmd, parseRequest(cmd));
                await c.writeWithResponse(
                  Buffer.from(cmd, "hex").toString("base64")
                );
              } catch (error) {
                console.log("WRITE ERROR", error);
              }
            }}
          >
            <Text style={styles.buttonText}>Off</Text>
          </TouchableOpacity>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 20,
    color: "#555",
  },
});
