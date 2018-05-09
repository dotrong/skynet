#!/bin/bash
/usr/bin/docker container ps | grep skynet > /dev/null 2>&1
if [ $? = 1 ]
then
 echo 'not running'
else
 echo 'running'
 /usr/bin/docker stop skynet > /dev/null 2>&1
 /usr/bin/docker rm skynet > /dev/null 2>&1
fi

/usr/bin/docker pull dotrong/skynet > /dev/null 2>&1
/usr/bin/docker run -p 80:3000 --name skynet -d -e NODE_ENV='production' -e JAWSDB_URL='mysql://skynet:skynetdb@skynet.cox104fs46zm.us-east-1.rds.amazonaws.com:3306/skynet' dotrong/skynet > /dev/null 2>&1