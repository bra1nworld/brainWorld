#!/bin/bash
release=`lsb_release -sc`
IngredientPPA="deb http://162.243.151.49/ubuntu/main $release main"

[ `id -u` != "0" ] && echo "Please run as root" && exit 1

echo "Install build essential"
apt-get install build-essential cmake

echo Install ros-bare

#sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
echo "$IngredientPPA" > /etc/apt/sources.list.d/ros-latest.list

apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116
apt-get update
apt-get install ros-kinetic-ros-base

echo Install ros-kinetic-ingredient
apt-get install ros-kinetic-ingredient

rosdep init
echo "May need to fix rosdep permission latter..., It's OK to run it as root for now"
rosdep update

echo "Suppose we have npm/nodejs preinstalled"
echo "Install cmake-js"
npm install -g cmake-js

echo "Source ros environment"
. /opt/ros/kinetic/setup.bash

echo "Run install command"
cmake-js

exit 0
