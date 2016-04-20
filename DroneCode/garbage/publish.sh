echo "Release script"

# first call a telnet script that stops the test program
#~/Desktop/Drone\ Code/telnet_stop_script.sh | telnet

# requires having 192.168.1.1 ardrone2 in /etc/hosts

ftp 192.168.1.1 5551
# type an arbitrary username on the next line 

# change the source and target dir to fullfill your needs
#put ~/Desktop/Drone\ Code/gps.js /data/video/gps.js
quit
END_SCRIPT

# lastly call a telnet script that gives the test program the right permissions
~/Desktop/Drone\ Code/telnet_permission.sh | telnet

exit 0
