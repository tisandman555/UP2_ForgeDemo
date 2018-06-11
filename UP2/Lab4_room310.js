const MQTT_SERVER_ADDRESS = 'mqtt://test.mosquitto.org';
//const MQTT_SERVER_ADDRESS = 'mqtt://q.emqtt.com:1883';
//const MQTT_SERVER_ADDRESS = 'mqtt://192.168.8.103:1886';
const TOPIC_UP2_SENSOR_DATA = 'Building01/Sensors/Room310';



var mqtt = require('mqtt');
var client = mqtt.connect(MQTT_SERVER_ADDRESS);

client.on('connect',function(){
    console.log('connected');
})

client.on('message',function(topic,message){
    console.log('topic: ' + topic);
})


function read_sensor_sim() {
    var random_temp = Math.random() * (30 - 25) + 25;	//25~30 random number
    var random_humi = Math.random() * (72 - 60) + 60;	//25~30 random number
    var timestamp = Math.floor(new Date() / 1000);
    return { 'temperature': random_temp, 'humidity': random_humi, 'timestamp': timestamp };
}

var i=0
function periodicActivity() {
	var sensor_value = read_sensor_sim();
	i+=1;
    console.log('send packet number: ',i);

    sensor_value.number = i;
    var mqtt_msg = JSON.stringify(sensor_value);
    console.log(mqtt_msg);
    client.publish(TOPIC_UP2_SENSOR_DATA,mqtt_msg);
};


setInterval(periodicActivity, 1000); //call the periodicActivity function every second
