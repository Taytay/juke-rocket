To install spotifyd as a service, simply run:
$ ./install.sh

This ensures that spotifyd will run at startup.
To test it before rebooting, run:
$ sudo systemctl start spotifyd
$ journalctl -u spotifyd --follow

To test the jukerocketd service:
$ sudo systemctl start jukerocketd

To tail the logs:
$ journalctl -u jukerocketd --follow

Notes and inspiration taken from:
https://spotifyd.github.io/spotifyd/installation/Raspberry-Pi.html#systemd-daemon-file
And some of the installation scripts of:
https://github.dev/MiczFlor/RPi-Jukebox-RFID
