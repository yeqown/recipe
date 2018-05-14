#
# Rename Shell Script
# TODO: rename `recipes-server` to other name so easy to use 
# 

#!/usr/bin

# make sure you do this script in folder `path/to/gewb/sh`

NewName=$1

if [ -z $NewName ]; then
	echo "Info: need a newname for your Project"
	exit
fi

PATH=`pwd`
echo "Command Running: $PATH, NewName: $NewName"

/usr/bin/grep gewb -rl $PATH | /usr/bin/xargs /usr/bin/sed -i "s/gewb/$NewName/g"