#ifndef _PIEZOBUTTON_H_
#define _PIEZOBUTTON_H_

#include <Arduino.h>

const int NUM_READINGS = 13;
const int RANGE_THRESHOLD = 45;

class PiezoButton
{
public:
  PiezoButton();
  ~PiezoButton() {}

  bool handleInputValue (int inputValue);
  void setId(int id) { this->id = id; }
  void setTriggerThreshold(double thresh) { this->triggerThreshold = thresh; }
  void enableDebug();
private:
  int lastReadings[NUM_READINGS];
  int currentReading;
  bool triggered;
  unsigned long lastTriggerTime;
  int id;
  double triggerThreshold;
  bool debug;
};

#endif
