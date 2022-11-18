export interface IPlayer {
  setPlaybackDevice(deviceName: string): void;

  playByName(name: string): void;
  playByUri(uri: string): void;
  setVolume(zeroTo100: number): void;
  togglePlayback(): void;
}
