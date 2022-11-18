import { IPlayer } from "./IPlayer";
import "jsh";
import { syncExecCommand } from "../utils/syncExecCommand";

export class SptPlayer implements IPlayer {
  protected deviceName: string | null = null;

  public constructor(deviceName: string) {
    this.deviceName = deviceName;
  }

  private ensurePlaybackDeviceSet(): void {
    if (this.deviceName == null) {
      throw new Error("Must set a playback device name first.");
    }
  }

  setPlaybackDevice(deviceName: string): void {
    this.deviceName = deviceName;
  }

  playByName(name: string): void {
    this.ensurePlaybackDeviceSet();
    const command = `spt`;
    const params = [
      "play",
      "--name",
      `"${name}"`,
      "--track",
      "--device",
      this.deviceName!,
    ];
    this.runCommand(command, params);
  }

  playByUri(uri: string): void {
    this.ensurePlaybackDeviceSet();
    const command = `spt`;
    const params = [
      "play",
      "--uri",
      `"${uri}"`,
      "--track",
      "--device",
      this.deviceName!,
    ];
    this.runCommand(command, params);
  }

  setVolume(zeroTo100: number): void {
    this.ensurePlaybackDeviceSet();
    zeroTo100 = Math.floor(zeroTo100);
    if (!(zeroTo100 >= 0 && zeroTo100 <= 100)) {
      throw new Error("Expected volume to be an integer from 0 to 100");
    }
    const command = `spt`;
    const params = [
      "playback",
      "--volume",
      `"${zeroTo100}"`,
      "--device",
      this.deviceName!,
    ];
    this.runCommand(command, params);
  }

  togglePlayback(): void {
    this.ensurePlaybackDeviceSet();
    const command = `spt`;
    const params = ["playback", "--toggle", "--device", this.deviceName!];
    this.runCommand(command, params);
  }

  protected runCommand(command: string, params: ReadonlyArray<string>): void {
    //$(command, { echoCommand: true });
    syncExecCommand(command, params);
  }
}

// const playAction = cardData.action.play;
//     if (playAction) {
//       if ("uri" in playAction) {
//         command = `spt play --uri "${playAction.uri}" --device "${deviceName}"`;
//       } else if ("name" in playAction) {
//         command = `spt play --name "${playAction.name}" --track --device "${deviceName}"`;
//       } else {
//         throw new Error(`malformed action: ${JSON.stringify(cardData.action)}`);
//       }
//       $(command, { echoCommand: true });
//     }
//   } else {
//     console.log(
//       `Could not find entry for card id ${cardId}. Add an entry to the config file for this card.`
//     );
//   }
