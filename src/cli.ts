#!/usr/bin/env node
import path from "path";
import { CardReader } from "./CardReader";
import { ConfigReader } from "./config/ConfigReader";
import { IPlayer } from "./players/IPlayer";
import { SptPlayer } from "./players/Spt";
import { syncExecCommand } from "./utils/syncExecCommand";

const configPath = path.resolve("./config.jsonc");
console.log(`Will read config from: ${configPath}`);
const configReader = new ConfigReader(configPath);
const cardReaderPath = configReader.config.cardReaderPath;
const deviceName = configReader.config.spotifyDeviceName;

const reader = new CardReader(cardReaderPath);
const player: IPlayer = new SptPlayer(deviceName);

let lastTouched: string = "";
reader.on("cardTouch", (cardId: string) => {
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

syncExecCommand(`mpg123`, [`"./sounds/game-start-6104-short.mp3"`]);
console.log(`Ready! (Listening to ${cardReaderPath})`);
