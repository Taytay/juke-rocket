# Installs the spotifyd service:
sudo cp ./spotifyd.service /etc/systemd/system/spotifyd.service
sudo chown root:root /etc/systemd/system/spotifyd.service
sudo chmod 644 /etc/systemd/system/spotifyd.service
sudo systemctl enable spotifyd
