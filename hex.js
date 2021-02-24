const responseCommands = {
  C9: "setHomeID",
  D1: "setEmailID",
  B1: "setSSID",
  B5: "setPassword",
  A9: "setFMState",
  A5: "setFMFrequency",
  C1: "SetAutoTune",
  A1: "SetNextFMChannelID",
  BD: "SetFMVolume",
  95: "setAlarmLight",
  99: "setPanicBuzzer",
  D9: "setNightLightStatus",
  51: "getFirmWareVersion",
  55: "getHardwareVersion",
  59: "getDeviceSerialNumber",
  "5D": "getBatteryRemaining",
  61: "getTotalBatteryCapacity",
  65: "getBatterChargingStatus",
  69: "getAlarmLightStatus",
  "6D": "getSirenStatus",
  71: "getFMChannelId",
  75: "getSetFMChannelFrequency",
  79: "getFMStatus",
  "7D": "getFirmwareUpdateStatus",
  81: "getWifiStatus",
  85: "getWifiSignalStrength",
  89: "getRouterSSID",
  "8D": "getRadioVolume",
  91: "getPresetFrequencies",
  CD: "getHomeID",
  D5: "getemailID",
  DD: "getNightLightStatus",
  B9: "resetDevice",
  "9D": "setFMChannelID",
  AD: "triggerFirmwareUpdate",
};

const requestCommands = {
  "00": "noCommand",
  BC: "setHomeID",
  C4: "setEmailID",
  A4: "setSSID",
  A8: "setPassword",
  "9C": "setFMState",
  98: "setFMFrequency",
  B4: "SetAutoTune",
  94: "SetNextFMChannelID",
  B0: "SetFMVolume",
  88: "setAlarmLight",
  "8C": "setPanicBuzzer",
  CC: "setNightLightStatus",
  44: "getFirmWareVersion",
  48: "getHardwareVersion",
  "4C": "getDeviceSerialNumber",
  50: "getBatteryRemaining",
  54: "getTotalBatteryCapacity",
  58: "getBatterChargingStatus",
  "5C": "getAlarmLightStatus",
  60: "getSirenStatus",
  64: "getFMChannelId",
  68: "getSetFMChannelFrequency",
  "6C": "getFMStatus",
  70: "getFirmwareUpdateStatus",
  74: "getWifiStatus",
  78: "getWifiSignalStrength",
  "7C": "getRouterSSID",
  80: "getRadioVaolume",
  84: "getPresetFrequencies",
  C0: "getHomeID",
  C8: "getemailID",
  D0: "getNightLightStatus",
  AC: "resetDevice",
  90: "setFMChannelID",
  A0: "triggerFirmwareUpdate",
};

const parse = (i1, i2, str) => parseInt(str.substring(i1, i2), 16);

export function parseResponse(response) {
  const dataLength = parse(10, 12, response);
  const operationCode = response.substring(4, 6);
  const operation =
    operationCode === "49"
      ? "Error: operation code mismatch"
      : responseCommands[operationCode.toUpperCase()];

  return `${operation} : ${parse(12, 12 + dataLength * 2, response)}`;
}

export function parseRequest(request) {
  const dataLength = parse(10, 12, request);
  const operationCode = request.substring(4, 6);
  const operation = requestCommands[operationCode];

  return `${operation} : ${parse(12, 12 + dataLength * 2, request)}`;
}
