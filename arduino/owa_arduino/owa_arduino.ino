int buttonITOPinStart = 22;
int buttonITOPinEnd = 52;
int i;
bool buttonPressed = false;

void setup() {
  Serial.begin(9600);

  for (i = buttonITOPinStart; i <= buttonITOPinEnd; i++) {
    pinMode(i, INPUT);
  }

}

void loop() {

  for (i = buttonITOPinStart; i <= buttonITOPinEnd; i++) {
    buttonPressed = digitalRead(i);
    if (buttonPressed) {
      Serial.println(i);
    }    
  }

}
