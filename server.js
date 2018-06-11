/*

The MIT License (MIT)

Copyright (c) Thu Aug 18 2016 Zhong Wu zhong.wu@autodesk.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
///////////////////////////////////////////////////////////
//replace with your suitable topic names 
const MQTT_TOPIC_SENSORS = 'Building01/Sensors/+';

// const  SOCKET_TOPIC_TEMPERATURE = 'Intel-Forge-Temperature';
const SOCKET_TOPIC_SENSORS = 'Intel-Forge-Sensors';

var host = 'mqtt://test.mosquitto.org';
//var host = 'mqtt://192.168.8.103:1886';
var MQTT_TOPIC_CONTROL = '';
//var host = '192.168.8.102:1886';


//import neccessary libraries 
var favicon = require('serve-favicon');
var express = require('express');
var app = express();

//routes
var api = require('./routes/token.js');
app.use('/', express.static(__dirname + '/www'));
app.use(favicon(__dirname + '/www/img/favicon.ico'));
app.use('/api', api);
var server = require('http').Server(app);

//Step 1, the socketio server creation code.
var socketio = require('socket.io')(server);  
socketio.on('connection', function(socket){
    console.log('user connected to the socket');
    var timer;
    socket.on('element select', function (msg) {
        console.log('message:----------------- ' + msg);

        var timesRun = 0;
        // var interval = setInterval(() => {
        //     timesRun += 1;
        //     if (timesRun === 4) {
        //         clearInterval(interval);
        //     }
        //     mqttclient.publish(MQTT_TOPIC_CONTROL, msg);
        // }, 1000);
     });

      socket.on('disconnect', function(){
         console.log('user disconnected from the socket');
       });
 })
//// Step 1 end



//// Step 2, Subscribe the mqtt data and emit message to socketio
 var mqtt = require('mqtt');
 var mqttclient  = mqtt.connect(host);
 mqttclient.on('connect', function () {
     console.log('mqtt on server side is connected');

    //     //subscribe mqtt topic
    mqttclient.subscribe(MQTT_TOPIC_SENSORS);

    //     // handle the message
    mqttclient.on('message', function (topic, message) {
        // if (topic === MQTT_TOPIC_SENSORS) {
        var obj = JSON.parse(message);
        obj.topic = topic;
        obj.dbid = 0;
        var iotdata = JSON.stringify(obj);
        //var iotdata = message.toString();			
        console.log('UP2 sensor data from topic: ' + iotdata)

        //             //broadcast the IoT data to socket
        socketio.emit(SOCKET_TOPIC_SENSORS, iotdata);
        //mqttclient.end()
        // }
     })   
 })
//// Stpe 2 end 


app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
});