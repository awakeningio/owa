#!/usr/bin/env bash

COMMIT=`git show --oneline|head -1|awk '{print $1}'`
SOUNDS_ARCHIVE_NAME=sounds_${COMMIT}.zip
#wget https://owasounds.awakening.io/by_commit/$SOUNDS_ARCHIVE_NAME
wget https://s3-us-west-1.amazonaws.com/owasounds.awakening.io/by_commit/$SOUNDS_ARCHIVE_NAME
unzip $SOUNDS_ARCHIVE_NAME
