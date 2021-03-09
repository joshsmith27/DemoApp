import React from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { parseResponse, parseRequest } from '../hex';
import crc from 'crc-react-native';

let crossCommandPacketCount = 0;
// The crosscommand packet number has to keep incremeting as long as you are connectd. If you disconnect it should start from 0 again.

const cache = {};

export const BluetoothContext = React.createContext({});

export const BlueToothProvider = (props) => {
  const [characteristics, setCharacteristics] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  const [device, setDevice] = React.useState({});
  const [message, setMessage] = React.useState();
  const [cWritable] = characteristics.filter((c) => c.isWritableWithResponse);
  const [cReadable] = characteristics.filter((c) => c.isNotifiable);
  const [connected, setConnected] = React.useState(false);
  React.useEffect(() => {
    if (Object.keys(device).length !== 0) {
      device.onDisconnected(async (error, d) => {
        console.log('reconnecting...');
        const characteristics = await connect(device);
        setCharacteristics(characteristics);

        crossCommandPacketCount = 0;
        console.log('CONNECTED TO', device.name);
        return;
      });
    }
  }, [device]);

  React.useEffect(() => {
    if (!cReadable) return;
    (async () => {
      await cReadable.monitor(async (error, data) => {
        if (error) {
          return console.log('[MONITOR ERROR]', error.message);
          // return setConnected(await device.isConnected());
        }
        const response = Buffer.from(data.value, 'base64').toString('hex');
        const message = parseResponse(response);

        // 14 means multi packet and more data is coming
        if (message.frameControl === '14') {
          if (!cache[message.operation]) cache[message.operation] = message.data;
          else cache[message.operation] += message.data;
        } else if (message.frameControl === '04' && cache[message.operation]) {
          cache[message.operation] += message.data;
          setMessage({ ...message, data: cleanString(cache[message.operation]) });
          delete cache[message.operation];
        } else {
          setMessage(message);
        }
      });
      setLoading(false);
    })();
  }, [cReadable]);

  React.useEffect(() => {
    init(setCharacteristics, setDevice);
  }, []);

  const send = React.useCallback(
    async (commandCode, payload) => {
      // Convert payload to hex
      let hexString = '00';
      if (typeof payload === 'boolean') hexString = payload ? '01' : '00';
      if (typeof payload === 'string') hexString = Buffer.from(payload, 'utf-8').toString('hex');

      if (hexString.length > 24) {
        // Multi packet data sets need to have the 2 byte length appended in hex
        const dataLength = hexString.length / 2;
        const dataSizeHex = dataLength.toString(16).padEnd(4, '0');
        hexString = dataSizeHex + hexString;
      }

      // break up hex into 12 byte packets
      const chunks = hexString.match(/.{1,24}/g) || [];
      const packets = chunks.map((chunk, i) => {
        const lastPacket = i === chunks.length - 1;
        return generatePacket(commandCode, chunk, lastPacket);
      });
      // console.log(packets);
      // send each packet
      for await (let packet of packets) {
        const details = parseRequest(packet);
        console.log('[R]', details.operation, details.data);
        await cWritable.writeWithResponse(Buffer.from(packet, 'hex').toString('base64'));
      }
    },
    [cWritable]
  );

  return (
    <BluetoothContext.Provider
      value={{
        loading,
        device,
        message,
        send,
      }}
    >
      {props.children}
    </BluetoothContext.Provider>
  );
};

function scan(manager) {
  return new Promise((resolve) => {
    console.log('BLEProvider.js', 'scan()', 'SCANNING');
    const intervalId = setInterval(() => console.log('BLEProvider.js', 'scan()', 'still scanning...'), 1000);

    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        throw error;
      }

      if (device.name && device.name.includes('BodyGuardz 5-in-1')) {
        manager.stopDeviceScan();
        clearInterval(intervalId);
        return resolve(device);
      }
    });
  });
}

async function connect(device) {
  console.log('BLEProvider.js', 'connect()', 'CONNECTING', device.name);
  await device.connect();
  await device.discoverAllServicesAndCharacteristics();
  const services = await device.services();
  const characteristics = [];
  await Promise.all(services.map(async (service) => characteristics.push(...(await service.characteristics()))));
  return characteristics;
}

function init(setCharacteristics, setDevice) {
  try {
    const manager = new BleManager();
    const subscription = manager.onStateChange(async (state) => {
      if (state === 'PoweredOn') {
        const connectedDevices = await manager.connectedDevices(['0000ffff-0000-1000-8000-00805f9b34fb']);

        const device = connectedDevices.find((device) => device.name.includes('BodyGuardz 5-in-1'));

        if (device) {
          setDevice(device);
          const characteristics = await connect(device);
          return setCharacteristics(characteristics);
        } else {
          const foundDevice = await scan(manager);
          setDevice(foundDevice);

          subscription.remove();
          const characteristics = await connect(foundDevice);
          return setCharacteristics(characteristics);
        }
      }
    }, true);
  } catch (error) {
    console.error('BLEProvider.js', 'init()', error);
  }
}

const enums = {
  noCommand: '00',

  setHomeID: 'BC',
  setEmailID: 'C4',
  setSSID: 'A4',
  setPassword: 'A8',
  setFMState: '9C',
  setFMFrequency: '98',
  SetAutoTune: 'B4',
  SetNextFMChannelID: '94',
  SetFMVolume: 'B0',
  setAlarmLight: '88',
  setPanicBuzzer: '8C',
  setNightLight: 'CC',

  getFirmWareVersion: '44',
  getHardwareVersion: '48',
  getDeviceSerialNumber: '4C',
  getBatteryRemaining: '50',
  getTotalBatteryCapacity: '54',
  getBatterChargingStatus: '58',
  getAlarmLightStatus: '5C',
  getSirenStatus: '60',
  getFMChannelId: '64',
  getSetFMChannelFrequency: '68',
  getFMStatus: '6C',
  getFirmwareUpdateStatus: '70',
  getWifiStatus: '74',
  getWifiSignalStrength: '78',
  getRouterSSID: '7C',
  getRadioVolume: '80',
  getPresetFrequencies: '84',
  getHomeID: 'C0',
  getEmailID: 'C8',
  getNightLightStatus: 'D0',

  resetDevice: 'AC',
  setFMChannelID: '90',
  triggerFirmwareUpdate: 'A0',
};

const CommandControlByteString = {
  lastPacket: '00',
  multiPacket: '10',
  decrypt: '01',
  check: '02',
  requiresResponse: '08',
};

function generatePacket(commandCode, chunk, lastPacket) {
  // Commands are 20 Byte Hex Strings
  // Format: AA 55 9c 00 xx 01 01 00 00 00 00 00 00 00 00 00 00 00 CRC1 CRC2
  // Example: AA5544000001000000000000000000000000ABAE

  // Byte 1-2: Header
  const header = 'AA55';

  // Byte 3 Operation Code
  const operationCode = enums[commandCode];

  // Byte 4 packet frame control
  const frameControl = lastPacket ? CommandControlByteString.lastPacket : CommandControlByteString.multiPacket;

  // Byte 5 which frame is transmitting min 00 max ff
  const packetCount = crossCommandPacketCount.toString(16).padStart(2, '0');

  // Byte 6 data length
  let byteCount = chunk.length / 2;
  const dataLength = byteCount.toString(16).padStart(2, '0');

  // Byte 7-18 data, hex data cannot exceed 12 bytes
  const data = chunk.padEnd(24, '0');

  // console.log(JSON.stringify({ header, operationCode, frameControl, packetCount, dataLength, data }, null, 2));

  const command = [header, operationCode, frameControl, packetCount, dataLength, data].join('');

  // Byte 19-20 CRC16
  const crcString = crc
    .crc16(Buffer.from(command.substring(header.length, 10), 'utf-8'))
    .toString('16')
    .toUpperCase();

  if (crossCommandPacketCount >= 255) crossCommandPacketCount = 0;
  else crossCommandPacketCount += 1;

  return command + crcString;
}

function cleanString(input) {
  var output = '';
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i);
    }
  }
  return output;
}
