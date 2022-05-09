# Steps for IoT Assignment

## Setting up MQTT on AWS

1. https://medium.com/@achildrenmile/mqtt-broker-on-aws-ec2-hands-on-install-configure-test-out-f12dd2f5c9d0
2. https://blog.yatis.io/install-secure-robust-mosquitto-mqtt-broker-aws-ubuntu/

## Load data into influx using a simple nodejs application

Install nodejs v. 16+

```
cd ~
curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh

sudo bash /tmp/nodesource_setup.sh

sudo apt install nodejs

node -v 
```

Copy project to aws instance, install pm2 and run the application

Install pm2
```
sudo npm install pm2@latest -g
```

Enable pm2 autostart
```
pm2 startup
```
Copy the command given..

Got to project directory
```
pm2 start index.js
```

Open pm2 logs to make sure app is running correctly
```
pm2 logs
```