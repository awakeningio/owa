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
const int numSelectPins = 4;
const int selectPins[numSelectPins] = {4, 5, 6, 7};
const int zInput = A0;

void setup() 
{
  Serial.begin(9600);


  for (int i=0; i<numSelectPins; i++)
  {
    pinMode(selectPins[i], OUTPUT);
    digitalWrite(selectPins[i], HIGH);
  }
  pinMode(zInput, INPUT);

  // Print the header:
  Serial.println("Y0\tY1\tY2\tY3\tY4\tY5\tY6\tY7");
  Serial.println("---\t---\t---\t---\t---\t---\t---\t---");
}

void loop() 
{
  for (byte pin=0; pin<16; pin++)
  {
    selectMuxPin(pin);
    int inputValue = analogRead(A0);
    Serial.print(String(int(pin)) + ":\t" + String(inputValue) + "\n");
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

