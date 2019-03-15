#include "PiezoButton.h"

bool DEBUG = false;
double DEBUG_THRESHOLD = 50;

PiezoButton::PiezoButton () {
  int i;
  for (i = 0; i < NUM_READINGS; ++i) {
    lastReadings[i] = 0;
  }

  currentReading = 0;
  triggered = false;
  lastTriggerTime = 0;
}

bool PiezoButton::handleInputValue (int inputValue) {
  bool wasJustTriggered = false;
  unsigned long time;
  lastReadings[currentReading] = inputValue;

  currentReading = (currentReading + 1) % NUM_READINGS;
  
  int i, min = 255, max = 0;
  double avg;
  for (i = 0; i < NUM_READINGS; ++i) {
    avg += lastReadings[i];
    if (lastReadings[i] < min) {
      min = lastReadings[i];
    }
    if (lastReadings[i] > max) {
      max = lastReadings[i];
    }
  }
  avg = avg / NUM_READINGS;

  //if (DEBUG && avg > DEBUG_THRESHOLD) {
    //Serial.println("button: " + String(this->id) + "; avg: " + String(avg));
  //}

  if (abs(avg) > this->triggerThreshold && (max - min) > RANGE_THRESHOLD) {
    if (DEBUG) {
      Serial.println("button: " + String(this->id) + "; avg: " + String(avg) + "; min: " + String(min) + "; max: " + String(max));
    }
    if (triggered == false) {
      time = millis();
      // debounce
      if (time - lastTriggerTime < 200) {
        wasJustTriggered = false;
      } else {
        wasJustTriggered = true;
        lastTriggerTime = time;
      }
    }
    triggered = true;
  } else {
    triggered = false;
  }
  return wasJustTriggered;
}
