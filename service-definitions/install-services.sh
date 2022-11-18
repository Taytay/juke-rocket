#!/bin/bash

# Installs the spotifyd service:
sudo cp ./spotifyd.service /etc/systemd/system/spotifyd.service
sudo chown root:root /etc/systemd/system/spotifyd.service
sudo chmod 644 /etc/systemd/system/spotifyd.service
sudo systemctl enable spotifyd

# Install jukerocket
sudo cp ./jukerocketd.service /etc/systemd/system/jukerocketd.service
sudo chown root:root /etc/systemd/system/jukerocketd.service
sudo chmod 644 /etc/systemd/system/jukerocketd.service
sudo systemctl enable jukerocketd
