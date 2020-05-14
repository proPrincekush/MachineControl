#include<ESP8266WiFi.h>
#include<ESP8266WebServer.h>
ESP8266WebServer server;
char* ssid= "AIT";
char* pass = "coll@airtel578";
//uint8_t D0 = 16; 
int Time,i;
void setup() {
 // put your setup code here, to run once:
pinMode(D0, OUTPUT);
digitalWrite(D0,HIGH);
WiFi.begin(ssid,pass);
Serial.begin(115200);
while(WiFi.status()!=WL_CONNECTED)
{
  Serial.print(".");
  delay(500);
}
Serial.println("connected");
Serial.println("ip address: ");
Serial.println(WiFi.localIP());


server.on("/",[](){server.send(200,"text/plain","Hello World!");});
//server.sendHeader("Access-Control-Allow-Origin", "*");
server.on("/toggle",toggleLED);

//server.on("/set",seTime);
server.begin();
server.onNotFound(handleNotFound);
}


void loop() {
  // put your main code here, to run repeatedly:
server.handleClient();
}

void toggleLED()
{   
  server.sendHeader("Access-Control-Allow-Origin", "*");
  int hours = server.arg("hour").toInt();
  int mint = server.arg("min").toInt();
  Serial.println(mint);
  seTime(hours,mint);
//  Serial.println("hour=" + hours + "mint=" +mint);
//  digitalWrite(D0,!digitalRead(D0));
  server.send(204,"");
}
void seTime(int h, int m){
   Time = (h*3600)+(m*60);
   for( i = Time;i>=0;i--){
      Serial.print("i=");
      Serial.println(i);
      Serial.print("TIME ");
      Serial.println(Time);
    server.handleClient();
    if(i<(Time/10)){
      digitalWrite(D0,LOW);
      delay(500);
      digitalWrite(D0,HIGH);
      delay(500);
    }
    else{
    digitalWrite(D0,LOW);
    delay(1000); 
    }
   }

}

void handleNotFound()
{
    if (server.method() == HTTP_OPTIONS)
    {
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Max-Age", "10000");
        server.sendHeader("Access-Control-Allow-Methods", "PUT,POST,GET,OPTIONS");
        server.sendHeader("Access-Control-Allow-Headers", "*");
        server.send(204);
    }
    else
    {
        server.send(404, "text/plain", "");
    }
}
