#!/usr/bin/env node
import "jsh";
import { CardReader } from "./CardReader";

// TODO: Extract all of these constants into a config file:
const cardMap = {
  "0001983429": { name: "Zoom Zoom Zoom We're going to the moon" },
  "0001983384": { name: "Radioactive by Imagine Dragons" },
  "0001983428": { name: "Ants go marching" },
  "0001983407": { name: "You are my sunshine" },
  "0001991783": { name: "The Count by Sesame Street" },
  "0001983451": { name: "Believer by Imagine Dragons" },
  "0001991796": { name: "Old MacDonald Had a Farm" },
  //"0001991774": `spt play --name "Believer Kaskade Imagine Dragons" --track --device "TychosRocket"`, //"spotify:album:2wVV49qXJai8kmCb1Czp0p", //"Believer Kaskade",
  "0001991774": { uri: "spotify:album:2wVV49qXJai8kmCb1Czp0p" }, //"spotify:album:2wVV49qXJai8kmCb1Czp0p", //"Believer Kaskade",
};

const deviceName = "TychosRocket";
const readerPath =
  "/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.3:1.0-event-kbd";
const reader = new CardReader(readerPath);

// TODO: Make this toggle playback if you touch the same card twice.
reader.on("cardTouch", (cardId: string) => {
  // TODO: Log with timestamp
  console.log(`Card tapped with ID: ${cardId}`);
  const songInfo = cardMap[cardId as keyof typeof cardMap];
  if (songInfo) {
    let command = "";
    if ("uri" in songInfo) {
      command = `spt play --uri "${songInfo.uri}" --device "${deviceName}"`;
    } else {
      command = `spt play --name "${songInfo.name}" --track --device "${deviceName}"`;
    }
    $(command, { echoCommand: true });
  } else {
    console.log(
      `Could not find entry for card id ${cardId}. Add an entry to the config file for this card.`
    );
  }
});

reader.on("error", (error) => {
  console.log("Error received: ", error);
});

console.log(`Ready! (Listening to ${readerPath})`);

// class Reader:
//     reader = None

//     def __init__(self):
//         self.reader = self
//         path = os.path.dirname(os.path.realpath(__file__))
//         self.keys = "X^1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX"
//         if not os.path.isfile(path + '/deviceName.txt'):
//             sys.exit('Please run RegisterDevice.py first')
//         else:
//             with open(path + '/deviceName.txt', 'r') as f:
//                 deviceName = f.read()
//             devices = get_devices()
//             for device in devices:
//                 if device.name == deviceName:
//                     self.dev = device
//                     break
//             try:
//                 self.dev
//             except:
//                 sys.exit('Could not find the device %s\n. Make sure is connected' % deviceName)

//     def readCard(self):
//         stri = ''
//         key = ''
//         while key != 'KEY_ENTER':
//             r, w, x = select([self.dev], [], [])
//             for event in self.dev.read():
//                 if event.type == 1 and event.value == 1:
//                     stri += self.keys[event.code]
//                     # print( keys[ event.code ] )
//                     key = ecodes.KEY[event.code]
//         return stri[:-1]
