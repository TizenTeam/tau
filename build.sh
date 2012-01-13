sbs -eo make clean
sbs -eo make
sudo rm -rf /var/www/webui/*
sudo cp -rf * /var/www/webui
google-chrome --allow-file-access-from-files demos/tizen-gray/index.html

