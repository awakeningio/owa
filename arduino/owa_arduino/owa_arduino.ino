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


// number of used input pins on the muxer
const int numMuxerPins = 12;

PiezoButton buttons[numMuxerPins];

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

  // set id of the piezo button for debugging
  for (int i = 0; i < numMuxerPins; i++) {
    buttons[i].setId(i);
    // seems to work for most of the piezos
    buttons[i].setTriggerThreshold(90.0);
  }

  // not all piezos are created equal
  buttons[11].setTriggerThreshold(50.0);
  buttons[10].setTriggerThreshold(60.0);
  buttons[9].setTriggerThreshold(50.0);
}

bool wasTriggered;
int inputValue;
void loop() 
{
  for (byte pin=0; pin<numMuxerPins; pin++)
  {
    selectMuxPin(pin);
    inputValue = analogRead(A0);
    /*Serial.println(String(int(pin)) + ": " + String(inputValue));*/
    wasTriggered = buttons[pin].handleInputValue(inputValue);
    if (wasTriggered) {
      /*Serial.println(String(millis()) + ":\t" + String(int(pin)));*/
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

