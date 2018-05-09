#ifndef _PIEZOBUTTON_H_
#define _PIEZOBUTTON_H_

#include <Arduino.h>

const int NUM_READINGS = 10;

class PiezoButton
{
public:
  PiezoButton();
  ~PiezoButton() {}

  bool handleInputValue (int inputValue);
private:
  int lastReadings[NUM_READINGS];
  int currentReading;
  bool triggered;
  unsigned long lastTriggerTime;
};

#endif
