import fs from "fs";
import os from "os";

import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

interface DeviceEvent {
  time: { tv_sec: number; tv_usec: number };
  type: number;
  code: number;
  value: number;
}

type DeviceEvents = {
  error: (error: Error) => void;
  event: (event: DeviceEvent) => void;
};

const is64Bit = os.arch().indexOf("64") >= 0;

export class EvDevReader extends (EventEmitter as new () => TypedEmitter<DeviceEvents>) {
  protected dataStream: fs.ReadStream;

  constructor(pathToDevice: string) {
    super();

    this.dataStream = fs.createReadStream(pathToDevice);
    this.dataStream.on("data", (data: Buffer) => {
      // TODO: Extract into own function
      const chunk = is64Bit ? 24 : 16;
      for (let i = 0, j = data.length; i < j; i += chunk) {
        const eventSlice = data.slice(i, i + chunk);
        const event = this.parseEvent(eventSlice);
        this.emit("event", event);
      }
    });
    this.dataStream.on("error", async (err) => {
      this.emit("error", err);
    });
  }

  protected parseEvent(buf: Buffer): DeviceEvent {
    let ev: DeviceEvent = {
      time: { tv_sec: 0, tv_usec: 0 },
      type: 0,
      code: 0,
      value: 0,
    };
    var offset;
    if (is64Bit) {
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
    ev.value = buf.readInt32LE(offset + 4);
    return ev;
  }
}

type CardReaderEvents = {
  error: (error: Error) => void;
  cardTouch: (cardId: string) => void;
};

// TODO: I don't think this keymap is special, but I could be wrong. See if there is a better generic mapping of codes to characters somewhere.
const keyMap =
  ".^1234567890....qwertzuiop....asdfghjkl.....yxcvbnm.......................";
const CODE_ENTER = 28;

// TODO: Allow for selection of device by NAME
export class CardReader extends (EventEmitter as new () => TypedEmitter<CardReaderEvents>) {
  private device: EvDevReader;
  private stringBeingBuilt: string = "";

  constructor(pathToDevice: string) {
    super();

    this.device = new EvDevReader(pathToDevice);
    this.device.on("event", this.handleEvent.bind(this));
    this.device.on("error", this.handleError.bind(this));
  }

  protected handleEvent(event: DeviceEvent): void {
    if (event.type == 1 && event.value == 1) {
      if (event.code != CODE_ENTER) {
        const character = keyMap[event.code];
        this.stringBeingBuilt += character;
      } else {
        const stringToEmit = this.stringBeingBuilt;
        this.stringBeingBuilt = "";
        this.emit("cardTouch", stringToEmit);
      }
    }
  }

  protected handleError(error: Error): void {
    this.emit("error", error);
  }
}

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
