


#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "mailerservice-eac26.firebaseio.com"
#define FIREBASE_AUTH "9ReEqBrTKRxE8QxZumajHkBgZBkSRBc7OdarNXrt"
#define WIFI_SSID "mi"
#define WIFI_PASSWORD "@pri&abhi#2"
int trigPin =5; //d1
int echoPin = 4;  //d2
int valve= 14; //d5
int green=12;  //d6
int red=13;    //d7////// not used
int main = D7;
int duration;
int distance;


int counter = 0;
void setup() {
  
  pinMode(trigPin, OUTPUT); 
  pinMode(echoPin, INPUT);  
  pinMode(valve,OUTPUT);
  pinMode(green,OUTPUT);
  pinMode(main,OUTPUT);
Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

}


void loop() {
     
  mainPower();                        
                              // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
                               // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
                                     // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
                                           // Calculating the distance
  distance= duration*0.034/2;
                                    // Prints the distance on the Serial Monitor
  //Serial.print("Distance: ");
   Serial.println(distance);
  ///////////////////// firebase data update
  firebaseDataUpdate(counter);

  if(distance>0 && distance<20)             // working
  {  
         digitalWrite (green,HIGH);
         delay(770);         
         digitalWrite (valve,HIGH);
         delay(590); //  3 ML   1100 FOR 5ML
  
         digitalWrite (valve,LOW);
         digitalWrite (green,LOW);
         delay(4000);
         counter++;
   
  }
  else
  {
    
//    digitalWrite (red,HIGH);
    digitalWrite (valve,LOW);
    digitalWrite (green,LOW);
   }
}


void firebaseDataUpdate(int dist){
  
  Firebase.setFloat("machine1/visitors", dist);
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
  delay(1000);
}

void mainPower(){
  String state = Firebase.getString("machine1/state");
  Serial.println(state);
  if(state=="on"){
    digitalWrite(main,HIGH);
  }
  else{
    digitalWrite(main,LOW);
  }
}
