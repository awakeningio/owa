#!/usr/bin/env bash

COMMIT=`git show --oneline|head -1|awk '{print $1}'`
SOUNDS_ARCHIVE_NAME=sounds_${COMMIT}.zip
zip -r $SOUNDS_ARCHIVE_NAME sounds/
aws s3 cp $SOUNDS_ARCHIVE_NAME s3://owasounds.awakening.io/by_commit/
