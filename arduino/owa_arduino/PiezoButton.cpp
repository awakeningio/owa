#include "PiezoButton.h"

double THRESHOLD = 120;

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
  
  int i;
  double avg;
  for (i = 0; i < NUM_READINGS; ++i) {
    avg += lastReadings[i];
  }
  avg = avg / NUM_READINGS;

  if (abs(avg) > THRESHOLD) {
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
