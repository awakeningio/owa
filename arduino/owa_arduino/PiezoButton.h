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
  void setId(int id) { this->id = id; }
  void setTriggerThreshold(double thresh) { this->triggerThreshold = thresh; }
private:
  int lastReadings[NUM_READINGS];
  int currentReading;
  bool triggered;
  unsigned long lastTriggerTime;
  int id;
  double triggerThreshold;
};

#endif
