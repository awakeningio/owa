/**
 *  @file       owa_arduino.ino
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

/******************************************************************************
from: https://github.com/sparkfun/74HC4051_8-Channel_Mux_Breakout
 ******************************************************************************/

#include "PiezoButton.h"

const bool DEBUG = false;

// Values below this threshold will not be output when DEBUG = true
const int DEBUG_THRESHOLD = 65;

// number of used input pins on the muxer
const int numMuxerPins = 12;

PiezoButton buttons[numMuxerPins];

// not all piezos are created equal, override sensitivity for individual
// buttons here.
double buttonTriggerThresholds[numMuxerPins] = {
  // 0
  60.0,
  // 1
  25.0,
  // 2
  25.0,
  // 3
  25.0,
  // 4
  25.0,
  // 5
  25.0,
  // 6
  25.0,
  // 7
  25.0,
  // 8
  25.0,
  // 9
  10.0,
  // 10
  30.0,
  // 11
  33.0
};

// number of select pins on the muxer
const int numSelectPins = 4;

// digital out (PWM) pins on Arduino connected to muxer select pins
const int selectPins[numSelectPins] = {6, 7, 8, 9};

// single Arduino analog input
const int zInput = A0;

// button message for sending button presses
const int msgLen = strlen("B01\n");
char msg[msgLen];

void setup() 
{
  Serial.begin(9600);

  for (int i=0; i<numSelectPins; i++)
  {
    pinMode(selectPins[i], OUTPUT);
    digitalWrite(selectPins[i], HIGH);
  }

  // our analog in to read piezo values
  pinMode(zInput, INPUT);

  // Sets the id of the piezo button for debugging and the trigger threshold.
  for (int i = 0; i < numMuxerPins; i++) {
    buttons[i].setId(i);
    buttons[i].setTriggerThreshold(buttonTriggerThresholds[i]);
  }
}

bool wasTriggered;
int inputValue;
void loop() 
{
  for (byte pin=0; pin<numMuxerPins; pin++)
  {
    selectMuxPin(pin);
    inputValue = analogRead(A0);
    if (DEBUG && inputValue > DEBUG_THRESHOLD) {
      Serial.println(
        (
         String(millis()) + ":\t"
         + String(pin, DEC) + ":\t"
         + String(inputValue, DEC))
      );
    }
    wasTriggered = buttons[pin].handleInputValue(inputValue);
    if (wasTriggered) {
      if (DEBUG) {
        Serial.println("B" + String(int(pin)) + " triggered.");
      }
      sprintf(msg, "B%02d\n", int(pin));
      Serial.write(msg);
    }
  }
}

// The selectMuxPin function sets the S0, S1, S2, S3 pins
// accordingly, given a pin from 0-16.
void selectMuxPin(byte pin)
{
  for (int i=0; i<numSelectPins; i++)
  {
    if (pin & (1<<i))
      digitalWrite(selectPins[i], HIGH);
    else
      digitalWrite(selectPins[i], LOW);
  }
}

