# Juke Rocket: A simple RFID-powered Jukebox

With a Raspberry Pi (3B+ and up), and an [RFID cardreader](https://www.amazon.com/gp/product/B07B7H6CQ2/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1), plays songs on Spotify based on which card is tapped.

## Origin

I originally used [PhonieBox](http://phoniebox.de/index-en.html) to build my son a simple Raspberry Pi-based "Jukebox".
This worked pretty well, but lost support for Spotify back in May of 2022.
I wrote this to simplify and make it work with Spotify again. This project has about 2% of the functionality of Phoniebox, but it's the 2% I need: Tap an RFID card and play a song on Spotify.

## Installation and usage instructions (WIP)

1. Install Node
2. Install [Spotify Daemon](https://github.com/Spotifyd/spotifyd)
3. Install [Spotify TUI](https://github.com/Rigellute/spotify-tui#spotify-tui)
4. Configure the spotify Daemon to have the Spotify username and password. Also, ensure that you have a device name configured. We will call it "Jukebox". Then, you can run it from the command line as follows.

`$ ./spotifyd --config-path ./spotifyd.ini`
Note that it can be helpful to add `--verbose --no-daemon` to the command line for spotifyd so that you can debug it.

To run it on bootup instead, run:

`$ cd ./service-defintions && ./install.sh `

5. Now that spotifyd is running, your Raspberry pi is a Spotify audio device. You can test this by opening Spotify and choosing "Jukebox" from the dropdown list of devices.
6. Assuming that works, we can test playing a song from the command line using the Spotify TUI:

`$ spt play --name "Twinkle Twinkle Little Star" --track --device "Jukebox"`
And to get the current playback status:
`$ spt playback --status --device "Jukebox"`
And to toggle play/pause:
`$ spt toggle --status --device "Jukebox"`

7. Now that that's working, let's make it work with RFIDs. Plug in the RFID reader if you haven't already.
8. `$ yarn run cli` will start the app. Tapping an RFID card to the reader will look up the song or action and run it by calling the appropriate `spt` command.

### Acknowledgements

Thanks go to the following projects that inspired or helped me develop this work.

The initial repo was copied from the [Typescript Boilerplate](https://github.com/metachris/typescript-boilerplate) project.
