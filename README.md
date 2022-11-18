# Juke Rocket: A simple RFID-powered Jukebox

With a Raspberry Pi (3B+ and up), and an [RFID cardreader](https://www.amazon.com/gp/product/B07B7H6CQ2/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1), plays songs on Spotify based on which card is tapped.

## Origin

I originally used [PhonieBox](http://phoniebox.de/index-en.html) to build my son a simple Raspberry Pi-based "Jukebox".
This worked pretty well, but [lost support for Spotify](https://github.com/MiczFlor/RPi-Jukebox-RFID/issues/1815).
I wrote this to simplify and make it work with Spotify again. This project has about 2% of the functionality of Phoniebox, but it's the 2% I need: Tap an RFID card and play a song on Spotify.

## Installation and usage instructions (WIP)

1. Install Node
2. Install [Spotify TUI](https://github.com/Rigellute/spotify-tui#spotify-tui)
3. Install [Spotify Daemon](https://github.com/Spotifyd/spotifyd) to `/home/pi/spotifyd`
4. Create a spotifyd.ini file in `/home/pi/spotifyd` and configure the spotify Daemon to have the Spotify username and password. Also, ensure that you have a device name configured. We will call it "Jukebox". Then, you can run it from the command line as follows.

`$ ./spotifyd --config-path ./spotifyd.ini`
Note that it can be helpful to add `--verbose --no-daemon` to the command line for spotifyd so that you can debug it.

5. Now that spotifyd is running, your Raspberry pi is a Spotify audio device. You can test this by opening Spotify on your phone and choosing "Jukebox" from the dropdown list of devices.
6. Assuming that works, we can test playing a song from the command line using the Spotify TUI:

`$ spt play --name "Twinkle Twinkle Little Star" --track --device "Jukebox"`
And to get the current playback status:
`$ spt playback --status --device "Jukebox"`
And to toggle play/pause:
`$ spt toggle --status --device "Jukebox"`

7. Now that that's working, let's get juke-rocket working. Copy config-example.jsonc to config.jsonc, and edit it as appropriate. You might not know what card IDs to use just yet for each of your RFID cards, but those will be displayed in the next step.
8. Now that that's working, let's make it work with RFIDs. Plug in the RFID reader if you haven't already.
9. `$ yarn run start` will start the juke-rocket. Tapping an RFID card to the reader will print the ID of the card and tell you whether juke-rocket recognizes the card. The card ID it prints out is the card ID you should add to the `cards` section of the config file.
   (After editing your config file, you'll have to restart juke-rocket. (CTRL-C and `yarn run start`)).
10. Running everything on bootup:
    `$ yarn run build && cd ./service-defintions && ./install-services.sh `
    `$ cd ./service-definitions && start-jukerocket-service.sh` should start the service. (You'll hear the startup sound).
    To see its output when running as a service, run: `$ journalctl -u jukerocketd --follow`
11. With the services installed, reboot and you should hear the startup sound. Tap a card and listen to it play back. Tap it again to pause.

### Acknowledgements

Thanks go to the following projects that inspired or helped me develop this work.

[PhonieBox](http://phoniebox.de/index-en.html) was the original inspiration for this project.
The initial repo was copied from [Typescript Boilerplate](https://github.com/metachris/typescript-boilerplate).

More detailed acknowledgement and notes can be found in notes.txt
