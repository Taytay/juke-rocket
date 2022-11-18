# Installs the spotifyd service:
sudo systemctl disable spotifyd
sudo rm /etc/systemd/system/spotifyd.service
sudo systemctl stop spotifyd

# Install jukerocket
sudo systemctl disable jukerocketd
sudo rm /etc/systemd/system/jukerocketd.service
sudo systemctl stop jukerocketd
