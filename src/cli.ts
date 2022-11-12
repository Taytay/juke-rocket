#!/usr/bin/env node
//import { foo } from './main'
import "jsh";
import { CardReader } from "./CardReader";

const readerPath =
  "/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.3:1.0-event-kbd";
const reader = new CardReader(readerPath);

reader.on("event", (event) => {
  console.log("event: ", event);
});

reader.on("error", (error) => {
  console.log("Error received: ", error);
});

console.log("Listening to " + readerPath);

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
