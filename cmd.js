import { Buffer } from "buffer";

import crc from "crc-react-native";

let maxDataSizeForPacket = 12;
let packetHeader = "AA55";
var crossCommandPacketNumber = 0;
// The crosscommand packet number has to keep incremeting as long as you are connectd. If you disconnect it should start from 0 again.

const enums = {
  setNightLightStatus: "CC",
};

const CommandControlByteString = {
  decrypt: "01",
  check: "02",
  lastPacket: "00",
  requiresResponse: "08",
  multiPacket: "10",
};

function generatePacket(
  commandCode,
  bodyDataStr,
  multiPacket,
  packetNumber,
  totalDataInPacket,
  lastPacket
) {
  var commandString = `${packetHeader}${enums[commandCode]}`; // Header + Command Code
  if (lastPacket) {
    // Adding the Byte to indicate Single or Multi Packet
    commandString += CommandControlByteString.lastPacket;
  } else {
    commandString += CommandControlByteString.multiPacket;
  }

  commandString += packetNumber.toString(16).padStart(2, "0").toUpperCase(); // Hex Value NOTE: Packet Number see note about

  commandString += totalDataInPacket
    .toString(16)
    .padStart(2, "0")
    .toUpperCase(); // Hex Value

  commandString += bodyDataStr;

  var offsetCount = packetHeader.length + (totalDataInPacket + 4) * 2;

  if (totalDataInPacket == 0) offsetCount += 1;

  const subStringForCRCGeneration = commandString.substring(
    packetHeader.length,
    offsetCount
  );

  var crcDataHexStr = crc
    .crc16(Buffer.from(subStringForCRCGeneration, "utf-8"))
    .toString("16");

  commandString += crcDataHexStr;

  return commandString;
}

export function generateDataArray(commandCode, enableCommand) {
  var commandArray = [];

  var dataHexStr = "00";
  var dataLength = 1;

  /* If it is a Toggle Command i.e. for Features where we can Turn it on and OFF by
   Switching the 7th Byte From 00 to 01 and vice versa the Length Should always be
   Sent as 01.
   But
   For Get commands where the data is all 0s the length should also go as 0.
   - SIDDARTH
   */

  if (enableCommand) {
    dataHexStr = "01";
    dataLength = 1;
  }

  dataHexStr = dataHexStr.padEnd(maxDataSizeForPacket * 2, "0");

  const cmd = generatePacket(
    commandCode,
    dataHexStr,
    false,
    crossCommandPacketNumber,
    dataLength,
    true
  );
  commandArray.push(cmd);

  console.log(crossCommandPacketNumber);
  crossCommandPacketNumber += 1;

  return commandArray;
}

// generateDataArray("setNightLightStatus", true);
