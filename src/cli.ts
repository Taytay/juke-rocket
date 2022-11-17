#!/usr/bin/env node
import "jsh";
import path from "path";
import { CardReader } from "./CardReader";
import { ConfigReader } from "./config/ConfigReader";

const configPath = path.resolve("./config.jsonc");
console.log(`Will read config from: ${configPath}`);
const configReader = new ConfigReader(configPath);
const cardReaderPath = configReader.config.cardReaderPath;
const deviceName = configReader.config.spotifyDeviceName;
const reader = new CardReader(cardReaderPath);

// TODO: Make a config setting or remember between runs:
// Init with volume 100:
$(`spt playback --volume 100 --device "${deviceName}" `, { echoCommand: true });

// TODO: Make this toggle playback if you touch the same card twice.
reader.on("cardTouch", (cardId: string) => {
  // TODO: Log with timestamp
  console.log(`Card tapped with ID: ${cardId}`);

  const cardData = configReader.getCardData(cardId);
  if (cardData) {
    let command = "";
    const playAction = cardData.action.play;
    if (playAction) {
      if ("uri" in playAction) {
        command = `spt play --uri "${playAction.uri}" --device "${deviceName}"`;
      } else if ("name" in playAction) {
        command = `spt play --name "${playAction.name}" --track --device "${deviceName}"`;
      } else {
        throw new Error(`malformed action: ${JSON.stringify(cardData.action)}`);
      }
      $(command, { echoCommand: true });
    }
  } else {
    console.log(
      `Could not find entry for card id ${cardId}. Add an entry to the config file for this card.`
    );
  }
});

reader.on("error", (error) => {
  console.log("Error received: ", error);
});

console.log(`Ready! (Listening to ${cardReaderPath})`);
