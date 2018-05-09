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

// threshold of input voltage
const int thresh = 10;

void setup() 
{
  Serial.begin(9600);

  for (int i=0; i<numSelectPins; i++)
  {
    pinMode(selectPins[i], OUTPUT);
    digitalWrite(selectPins[i], HIGH);
  }
  pinMode(zInput, INPUT);
}

int inputValue;
bool wasTriggered;
void loop() 
{
  for (byte pin=0; pin<numMuxerPins; pin++)
  {
    selectMuxPin(pin);
    inputValue = analogRead(A0);
    wasTriggered = buttons[pin].handleInputValue(inputValue);
    if (wasTriggered) {
      Serial.println(String(millis()) + ":\t" + String(int(pin)));
    }
    /*if (inputValue > thresh) {*/
      /*Serial.print(String(int(pin)) + ":\t" + String(inputValue) + "\n");*/
    /*}    */
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

