import { deviceDetect } from "react-device-detect";
export function getOS() {
  const { osName, browserMajorVersion, browserName, osVersion } =
    deviceDetect();

  const OS = `${osName} ${osVersion}, ${browserName} ${browserMajorVersion}`;
  return OS;
}
