const int numSensors = 1;
const int buttonPin[numSensors] = {13};
int counter = 0;

boolean buttonState;

void setup() {

  for (int i = 0; i < numSensors; i++)
  {
    pinMode(buttonPin[i], INPUT);
  }

  Serial.begin(9600);
}

void loop(){

  for (int i = 0; i < numSensors; i++)
  {
    buttonState = digitalRead(buttonPin[i]);

    if (buttonState == HIGH) {

      Serial.println(buttonPin[i]);
      Serial.println(counter++);

    }
  }
}
