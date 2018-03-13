const int numSensors = 12;
const int buttonPin[numSensors] = {24,26,28,30,32,34,36,38,40,42,44,46};
int counter = 0;

int sensorReading[numSensors] = {0,0,0,0,0,0,0,0,0,0,0,0};
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

