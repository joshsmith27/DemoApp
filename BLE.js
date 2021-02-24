import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { parseResponse } from "./hex";

export function bleInit(setCharacteristics) {
  try {
    const manager = new BleManager();
    const subscription = manager.onStateChange(async (state) => {
      if (state === "PoweredOn") {
        console.log("READY");
        const connectedDevices = await manager.connectedDevices([
          "0000ffff-0000-1000-8000-00805f9b34fb",
        ]);

        const device = connectedDevices.find((device) =>
          device.name.includes("BodyGuardz 5-in-1")
        );

        if (device) {
          const characteristics = await connect(device);
          return setCharacteristics(characteristics);
        } else {
          const foundDevice = await scan(manager);
          subscription.remove();
          const characteristics = await connect(foundDevice);
          return setCharacteristics(characteristics);
        }
      }
    }, true);
  } catch (error) {
    console.log("Error!!!", error);
  }
}

function scan(manager) {
  return new Promise((resolve) => {
    console.log("SCANNING");
    const intervalId = setInterval(
      () => console.log("still scanning..."),
      1000
    );

    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        throw error;
      }

      if (device.name && device.name.includes("BodyGuardz 5-in-1")) {
        manager.stopDeviceScan();
        clearInterval(intervalId);
        return resolve(device);
      }
    });
  });
}

async function connect(device) {
  console.log("CONNECTING", device.name);
  await device.connect();
  await device.discoverAllServicesAndCharacteristics();
  const services = await device.services();
  const characteristics = [];
  await Promise.all(
    services.map(async (service) =>
      characteristics.push(...(await service.characteristics()))
    )
  );
  return characteristics;
}

export async function monitor(characteristics) {
  try {
    for (let c of characteristics) {
      if (c.isNotifiable) {
        await c.monitor((error, data) => {
          if (error) return console.log(error);
          const response = Buffer.from(data.value, "base64").toString("hex");
          console.log("BLE RESPONSE", response, parseResponse(response));
        });
        console.log("MONITORING", c.uuid.substring(4, 8));
      }
    }
  } catch (error) {
    console.log("monitor error");
  }
}
