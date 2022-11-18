#!/usr/bin/env node
import "jsh";
import path from "path";
import { CardReader } from "./CardReader";
import { ConfigReader } from "./config/ConfigReader";
import { IPlayer } from "./players/IPlayer";
import { SptPlayer } from "./players/Spt";

const configPath = path.resolve("./config.jsonc");
console.log(`Will read config from: ${configPath}`);
const configReader = new ConfigReader(configPath);
const cardReaderPath = configReader.config.cardReaderPath;
const deviceName = configReader.config.spotifyDeviceName;

const reader = new CardReader(cardReaderPath);
const player: IPlayer = new SptPlayer(deviceName);

let lastTouched: string = "";
// TODO: Make this toggle playback if you touch the same card twice.
reader.on("cardTouch", (cardId: string) => {
  // TODO: Log with timestamp
  console.log(`${new Date().toISOString()}: Card tapped with ID: ${cardId}`);

  const cardData = configReader.getCardData(cardId);
  if (cardData) {
    const playAction = cardData.action.play;
    if (playAction) {
      if (lastTouched == cardId) {
        player.togglePlayback();
      } else {
        if ("uri" in playAction) {
          player.playByUri(playAction.uri);
        } else if ("name" in playAction) {
          player.playByName(playAction.name);
        } else {
          throw new Error(
            `Malformed action: ${JSON.stringify(cardData.action)}`
          );
        }
      }
      lastTouched = cardId;
    } else {
      console.log(
        `  Format of action not recognized: ${JSON.stringify(cardData.action)}`
      );
    }
  } else {
    console.log(
      `  Could not find entry for card id ${cardId}. Add an entry to the config file for this card.`
    );
  }
});

reader.on("error", (error) => {
  console.log("Error received: ", error);
});

console.log(`Ready! (Listening to ${cardReaderPath})`);
