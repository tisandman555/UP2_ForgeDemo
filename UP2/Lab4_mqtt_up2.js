const MQTT_SERVER_ADDRESS = 'mqtt://test.mosquitto.org';
//const MQTT_SERVER_ADDRESS = 'mqtt://q.emqtt.com:1883';
//const MQTT_SERVER_ADDRESS = 'mqtt://192.168.8.103:1886';
const TOPIC_UP2_SENSOR_DATA = 'Building01/Sensors/Room101';


var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

mraa.addSubplatform(mraa.GROVEPI,"0");


// Load lcd module on I2C
var LCD = require('jsupm_jhd1313m1');

// Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

myLcd.setCursor(0,0);
// RGB Blue
myLcd.setColor(53, 39, 249);
// RGB Red
//myLcd.setColor(255, 0, 0);
myLcd.setCursor(0,0);
myLcd.write('Sending          ');
myLcd.setCursor(1,0);
myLcd.write('Data...    ');


var sensor1 = require('jsupm_th02');
var th02 = new sensor1.TH02();

var dbid='';

function read_sensor()
{
	temp = th02.getTemperature();
    humi = th02.getHumidity();
    var timestamp = Math.floor(new Date()/1000);
    return  {'temperature':temp,'humidity':humi,'timestamp':timestamp};

}


var mqtt = require('mqtt');
var client = mqtt.connect(MQTT_SERVER_ADDRESS);



var i=0
function periodicActivity() {
	var sensor_value = read_sensor();
	i+=1;
    console.log('send packet number: ',i);

    sensor_value.number = i;
    var mqtt_msg = JSON.stringify(sensor_value);
    console.log(mqtt_msg);
    client.publish(TOPIC_UP2_SENSOR_DATA,mqtt_msg);
};


setInterval(periodicActivity, 1000); //call the periodicActivity function every second
