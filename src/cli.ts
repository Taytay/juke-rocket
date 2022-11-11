#!/usr/bin/env node
//import { foo } from './main'
import "jsh";

//import { Evdev, EvdevReader } from "evdev";
import EvdevReader, { Evdev } from "evdev";

var reader = new EvdevReader({ raw: true });
reader.search("/dev/input/by-path", "event-kbd", function (err, files) {
  //Err should be null.
  let device: Evdev.Device = {} as any;
  //const target_index = parseInt(process.argv[3]); // don't forget to check if NaN
  if (err) {
    console.log("node-evdev search stream : ", err);
    return;
  } else if (files.length == 1) {
    console.log("Opening %s", files[0]);
    device = reader.open(files[0]);
  }
  // else if (1 < files.length) {
  //   if (Number.isNaN(target_index)) {
  //     console.log("Found %d files : %s", files.length, prettyPrint(files));
  //     console.log(
  //       'Provide a third argument "index" to choose your file. e.g. :'
  //     );
  //     console.log("\t./index.js %s 0", target_match);
  //     console.log("Or provide a more precise filter to match only 1 device");
  //     return;
  //   } else if (!files[target_index]) {
  //     console.error(
  //       "No file at index %d : %s",
  //       target_index,
  //       prettyPrint(files)
  //     );
  //     return;
  //   } else {
  //     console.log("Opening : %s", files[target_index]);
  //     device = reader.open(files[target_index]);
  //   }
  // } else {
  //   console.log("No device matching %s found", target_match);
  //   return;
  // }

  //We don't check if device is assigned because any code path that does not return should assign it.
  device.on("open", function () {
    console.log(device.id);
  });
  const keys =
    "X^1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX";
  // reader.on("EV_KEY", (event) => {
  //   if (event.value == 1){
  //     console.log(event);
  //     console.log(keys[event.code]);
  //   }
  // });

  type MyEvent = {
    type: number;
    code: number;
    value: string | number;
    time: string;
  };
  let currStr = "";
  reader.on("event", (event: MyEvent) => {
    //console.log(event);
    if (event.type == 1 && event.value == 1) {
      console.log(event);
      console.log(keys[event.code]);
      if (event.code != 28) {
        currStr += keys[event.code];
      } else {
        console.log("Here is the string we got!", currStr);
        currStr = "";
      }
    }
  });

  //   while key != 'KEY_ENTER':
  //           r, w, x = select([self.dev], [], [])
  //           for event in self.dev.read():
  //               if event.type == 1 and event.value == 1:
  //                   stri += self.keys[event.code]
  //                   # print( keys[ event.code ] )
  //                   key = ecodes.KEY[event.code]
  // });
});

// import { findByIds } from "usb";

// const device = findByIds(0xffff, 0x0035);

// if (device) {
//   console.log(device); // Legacy device
// }

// import { webusb } from "usb";

// async function listDevices() {
//   // Returns first matching device
//   try {
//     const device = await webusb.requestDevice({
//       filters: [{}],
//     });

//     if (device) {
//       console.log(device); // WebUSB device
//     }
//   } catch (e) {
//     console.error("Error listing devices: " + e);
//   }
// }
// listDevices();

// const USBCardReader = require("node-usb-cardreader");

// //Default options
// const options = {
//   onRead: console.log, //function to be called
//   onError: console.log, //function to be called
//   onConnection: console.log, //function to be called
//   idVendor: 0, // Mandatory to connect
//   idProduct: 0, // Mandatory to connect
//   lowerCase: true,
// };

// //let reader = new USBCardReader({ idVendor: 0xffff, idProduct: 0x0035 });
// let reader = new USBCardReader(options);
// console.log(reader.getDeviceList(true));

// import { DevInputReader } from "dev-input-reader";

// // use simple events
// //const reader = new DevInputReader("event0", { retryInterval: 10000 });

// console.log("About to read...");
// const reader = new DevInputReader(
//   "/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.3:1.0-event-kbd",
//   { retryInterval: 10000 }
// );

// reader
//   .on("error", console.error)
//   .on("keydown", (data) => console.log("keyDown:", data))
//   .on("key", (data) => console.log("key:", data))
//   .on("error", (data) => console.log("an error occure:", data));
// // data contain the durration of the press and the concurently press key
// // in case oh hardware lost, will reconnect every retryInterval 10sec
// console.log("Reader created. Listening (I Think)");

/*
function rawParse(){

var device =
  "/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.3:1.0-event-kbd";
const options = {
  flags: "r",
  //   encoding: undefined,
  //   fd: undefined,
  autoClose: true,
};
const fd = fs
  .createReadStream(device, options)
  .on("data", function (buf: Buffer) {
    var i,
      j,
      chunk = self.arch === 64 ? 24 : 16;
    for (i = 0, j = buf.length; i < j; i += chunk) {
      //parse the buffer
      console.log(buf[i]);

      const ev: {
        time: {
          tv_sec: number;
          tv_usec: number;
        };
        type: number;
        code: number;
        value: number;
        //         __u16 type;
        // __u16 code;
        // __s32 value;
      } = {} as any;
      let offset = 0; 
      if (this.arch === 64) {
        let low = buf.readInt32LE(0);
        ev.time.tv_sec = buf.readInt32LE(4) * 4294967296.0 + low;
        if (low < 0) {
          ev.time.tv_sec += 4294967296;
        }
        low = buf.readInt32LE(8);
        ev.time.tv_usec = buf.readInt32LE(12) * 4294967296.0 + low;
        if (low < 0) {
          ev.time.tv_usec += 4294967296;
        }
        offset = 16;
      } else {
        ev.time.tv_sec = buf.readInt32LE(0);
        ev.time.tv_usec = buf.readInt32LE(4);
        offset = 8;
      }
      ev.type = buf.readUInt16LE(offset);
      ev.code = buf.readUInt16LE(offset + 2);
      ev.value = buf.readUInt32LE(offset + 4);
    }
  })
  .on("error", function (e) {
    console.error(e);
  });
}
*/

//foo()

// import { getDeviceList } from "usb";

// const devices = getDeviceList();

// for (const device of devices) {
//   console.log(device); // Legacy device
// }

// import { webusb } from "usb";

// async function listDevices() {
//   // Returns first matching device
//   try {
//     const device = await webusb.requestDevice({
//       filters: [{}],
//     });

//     if (device) {
//       console.log(device); // WebUSB device
//     }
//   } catch (e) {
//     console.error("Error listing devices: " + e);
//   }
// }

// listDevices().then(() => {
//   console.log("done!");
// });

// 0 Sycreader USB Reader

// import os.path
// import sys

// from evdev import InputDevice, ecodes, list_devices
// from select import select

// def get_devices():
//     return [InputDevice(fn) for fn in list_devices()]

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
