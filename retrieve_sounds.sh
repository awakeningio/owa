#!/usr/bin/env bash

COMMIT=`git show --oneline|head -1|awk '{print $1}'`
SOUNDS_ARCHIVE_NAME=sounds_${COMMIT}.zip
wget http://owasounds.awakening.io.s3.amazonaws.com/by_commit/$SOUNDS_ARCHIVE_NAME
unzip $SOUNDS_ARCHIVE_NAME
