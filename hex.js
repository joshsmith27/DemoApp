import { Buffer } from 'buffer';

const responseCommands = [
  {
    operation: 'setHomeID',
    dataType: '',
    code: 'C9',
  },
  {
    operation: 'setEmailID',
    dataType: 'string',
    code: 'D1',
  },
  {
    operation: 'setSSID',
    dataType: 'string',
    code: 'B1',
  },
  {
    operation: 'setPassword',
    dataType: 'string',
    code: 'B5',
  },
  {
    operation: 'setFMState',
    dataType: 'number',
    code: 'A9',
  },
  {
    operation: 'setFMFrequency',
    dataType: '',
    code: 'A5',
  },
  {
    operation: 'SetAutoTune',
    dataType: '',
    code: 'C1',
  },
  {
    operation: 'SetNextFMChannelID',
    dataType: '',
    code: 'A1',
  },
  {
    operation: 'SetFMVolume',
    dataType: '',
    code: 'BD',
  },
  {
    operation: 'setAlarmLight',
    dataType: 'number',
    code: '95',
  },
  {
    operation: 'setPanicBuzzer',
    dataType: 'number',
    code: '99',
  },
  {
    operation: 'setNightLightStatus',
    dataType: 'number',
    code: 'D9',
  },
  {
    operation: 'getFirmWareVersion',
    dataType: 'string',
    code: '51',
  },
  {
    operation: 'getHardwareVersion',
    dataType: 'string',
    code: '55',
  },
  {
    operation: 'getDeviceSerialNumber',
    dataType: 'string',
    code: '59',
  },
  {
    operation: 'getBatteryRemaining',
    dataType: 'number',
    code: '5D',
  },
  {
    operation: 'getTotalBatteryCapacity',
    dataType: 'number',
    code: '61',
  },
  {
    operation: 'getBatterChargingStatus',
    dataType: 'number',
    code: '65',
  },
  {
    operation: 'getAlarmLightStatus',
    dataType: 'number',
    code: '69',
  },
  {
    operation: 'getSirenStatus',
    dataType: 'number',
    code: '6D',
  },
  {
    operation: 'getFMChannelId',
    dataType: '',
    code: '71',
  },
  {
    operation: 'getSetFMChannelFrequency',
    dataType: '',
    code: '75',
  },
  {
    operation: 'getFMStatus',
    dataType: 'number',
    code: '79',
  },
  {
    operation: 'getFirmwareUpdateStatus',
    dataType: 'number',
    code: '7D',
  },
  {
    operation: 'getWifiStatus',
    dataType: 'number',
    code: '81',
  },
  {
    operation: 'getWifiSignalStrength',
    dataType: 'number',
    code: '85',
  },
  {
    operation: 'getRouterSSID',
    dataType: 'string',
    code: '89',
  },
  {
    operation: 'getRadioVolume',
    dataType: 'number',
    code: '8D',
  },
  {
    operation: 'getPresetFrequencies',
    dataType: '',
    code: '91',
  },
  {
    operation: 'getHomeID',
    dataType: 'string',
    code: 'CD',
  },
  {
    operation: 'getEmailID',
    dataType: 'string',
    code: 'D5',
  },
  {
    operation: 'getNightLightStatus',
    dataType: 'number',
    code: 'DD',
  },
  {
    operation: 'resetDevice',
    dataType: '',
    code: 'B9',
  },
  {
    operation: 'setFMChannelID',
    dataType: '',
    code: '9D',
  },
  {
    operation: 'triggerFirmwareUpdate',
    dataType: '',
    code: 'AD',
  },
  {
    operation: null,
    dataType: '',
    code: '49',
  },
];

const requestCommands = [
  {
    operation: 'noCommand',
    dataType: 'string',
    code: '00',
  },
  {
    operation: 'setHomeID',
    dataType: 'string',
    code: 'BC',
  },
  {
    operation: 'setEmailID',
    dataType: 'string',
    code: 'C4',
  },
  {
    operation: 'setSSID',
    dataType: 'string',
    code: 'A4',
  },
  {
    operation: 'setPassword',
    dataType: 'string',
    code: 'A8',
  },
  {
    operation: 'setFMState',
    dataType: 'string',
    code: '9C',
  },
  {
    operation: 'setFMFrequency',
    dataType: 'string',
    code: '98',
  },
  {
    operation: 'SetAutoTune',
    dataType: 'string',
    code: 'B4',
  },
  {
    operation: 'SetNextFMChannelID',
    dataType: 'string',
    code: '94',
  },
  {
    operation: 'SetFMVolume',
    dataType: 'string',
    code: 'B0',
  },
  {
    operation: 'setAlarmLight',
    dataType: 'string',
    code: '88',
  },
  {
    operation: 'setPanicBuzzer',
    dataType: 'string',
    code: '8C',
  },
  {
    operation: 'setNightLightStatus',
    dataType: 'string',
    code: 'CC',
  },
  {
    operation: 'getFirmWareVersion',
    dataType: 'string',
    code: '44',
  },
  {
    operation: 'getHardwareVersion',
    dataType: 'string',
    code: '48',
  },
  {
    operation: 'getDeviceSerialNumber',
    dataType: 'string',
    code: '4C',
  },
  {
    operation: 'getBatteryRemaining',
    dataType: 'number',
    code: '50',
  },
  {
    operation: 'getTotalBatteryCapacity',
    dataType: 'string',
    code: '54',
  },
  {
    operation: 'getBatterChargingStatus',
    dataType: 'string',
    code: '58',
  },
  {
    operation: 'getAlarmLightStatus',
    dataType: 'string',
    code: '5C',
  },
  {
    operation: 'getSirenStatus',
    dataType: 'string',
    code: '60',
  },
  {
    operation: 'getFMChannelId',
    dataType: 'string',
    code: '64',
  },
  {
    operation: 'getSetFMChannelFrequency',
    dataType: 'string',
    code: '68',
  },
  {
    operation: 'getFMStatus',
    dataType: 'string',
    code: '6C',
  },
  {
    operation: 'getFirmwareUpdateStatus',
    dataType: 'string',
    code: '70',
  },
  {
    operation: 'getWifiStatus',
    dataType: 'string',
    code: '74',
  },
  {
    operation: 'getWifiSignalStrength',
    dataType: 'string',
    code: '78',
  },
  {
    operation: 'getRouterSSID',
    dataType: 'string',
    code: '7C',
  },
  {
    operation: 'getRadioVaolume',
    dataType: 'string',
    code: '80',
  },
  {
    operation: 'getPresetFrequencies',
    dataType: 'string',
    code: '84',
  },
  {
    operation: 'getHomeID',
    dataType: 'string',
    code: 'C0',
  },
  {
    operation: 'getemailID',
    dataType: 'string',
    code: 'C8',
  },
  {
    operation: 'getNightLightStatus',
    dataType: 'string',
    code: 'D0',
  },
  {
    operation: 'resetDevice',
    dataType: 'string',
    code: 'AC',
  },
  {
    operation: 'setFMChannelID',
    dataType: 'string',
    code: '90',
  },
  {
    operation: 'triggerFirmwareUpdate',
    dataType: 'string',
    code: 'A0',
  },
];

const parse = (i1, i2, str) => parseInt(str.substring(i1, i2), 16);

function decodeHexString(hexString, map) {
  const dataLength = parse(10, 12, hexString);

  const operationCode = hexString.substring(4, 6);

  const operationDetails = map.find((item) => item.code === operationCode.toUpperCase()) || {};

  const rawData = hexString.substring(12, 12 + dataLength * 2);

  const frameControl = hexString.substring(6, 8);

  let data;
  if (operationDetails.dataType === 'string') data = Buffer(rawData, 'hex').toString();
  else if (operationDetails.dataType === 'number') data = parseInt(rawData, 16);

  // if (operationDetails.operation === 'getRouterSSID') {
  //   console.log('-------------------------------------');
  //   console.log('hex', hexString);
  //   console.log('dataLength', dataLength);
  //   console.log('body', rawData);
  //   console.log('string', Buffer(rawData, 'hex').toString());
  //   console.log('number', parseInt(rawData, 16));
  //   console.log('frameControl', frameControl);
  // }

  return {
    frameControl,
    operation: operationDetails.operation,
    data: data,
  };
}

export function parseResponse(payload) {
  return decodeHexString(payload, responseCommands);
}

export function parseRequest(payload) {
  return decodeHexString(payload, requestCommands);
}
