AutodeskNamespace('Viewing.ClassroomTrainning');

var _viewer;
var _data;
var _options;
var _googleChart;

var _temperatureTimeSeries;
var _humidityTimeSeries;

var infoToIot = {
    "name": "",
    "dbid": ""
};

Viewing.ClassroomTrainning.Extension = function (viewer, option) {
    Autodesk.Viewing.Extension.call(this, viewer, option);
    _viewer = viewer;
    _self = this;
};


Viewing.ClassroomTrainning.Extension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
Viewing.ClassroomTrainning.Extension.prototype.constructor = Viewing.ClassroomTrainning.Extension;


Viewing.ClassroomTrainning.Extension.prototype.onSelectionChanged = function (event) {

    if (curSelection = event.selections.length === 0) {
        console.log('clear the selection');
        //  _self.socketio.emit('element select', JSON.stringify(infoToIot) );
    }
    else {
        infoToIot.dbid = event.selections[0].dbIdArray[0];
        infoToIot.name = "model";
        console.log('current element is: ' + infoToIot.dbid);
        //  _self.socketio.emit('element select', JSON.stringify(infoToIot) );
    }
};

Viewing.ClassroomTrainning.Extension.prototype.load = () => {

    //replace with your own website
    const baseurl = 'http://localhost:3000';
    _self.socketio = io.connect(baseurl);

    //replace with your suitable topic names 
    const SOCKET_TOPIC_SENSORS = 'Intel-Forge-Sensors';




    //// Step 3, The code to add charts and timeline
    /////////////////////////////////////////////////////////////////////////
    /// create google charts for Temperature and Humidity
    google.charts.load('current', { 'packages': ['gauge'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        _data = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Temperature', 0],
            ['Humidity', 0]
        ]);
        _options = {
            width: 400, height: 120,
            redFrom: 90, redTo: 100,
            yellowFrom: 75, yellowTo: 90,
            minorTicks: 5
        };
        _googleChart = new google.visualization.Gauge(document.getElementById('chartDiv'));
        _googleChart.draw(_data, _options);
    }

    // //////////////////////////////////////////////////////////////////////////////
    // /// create smoothie timeline chart
    _temperatureTimeSeries = new TimeSeries();
    _humidityTimeSeries = new TimeSeries();

    var temperatureChart = new SmoothieChart();
    temperatureChart.addTimeSeries(_temperatureTimeSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 1 });
    temperatureChart.streamTo(document.getElementById("chart1"), 1000);

    var humidityChart = new SmoothieChart();
    humidityChart.addTimeSeries(_humidityTimeSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 1 });
    humidityChart.streamTo(document.getElementById("chart2"), 1000);
    //// Step 3 end


    const total_num = 3;
    var sel_dbid = new Array(
        "6194", "6195", "6196", "6197", "6198", "6199", "6200", "6201", "6202", "6203",
        "6204", "6205", "6206", "6207", "6208", "6209", "6210", "6211", "6212", "6213",
        "6260", "6261", "6262", "6263", "6264", "6265", "6266", "6267", "6268", "6269",
        "6270", "6271", "6272", "6273", "6274", "6275", "6276", "6277", "6278", "6279",
        "6326", "6327", "6328", "6329", "6330", "6331", "6332", "6333", "6334", "6335",
        "6336", "6337", "6338", "6339", "6340", "6341", "6342", "6343", "6344", "6345"
    );
    var colortag = new Array(60);
    var recv_temperature = new Array(60);
    var recv_humidity = new Array(60);
    var recv_topic = new Array(
        "Building01/Sensors/Room100", "Building01/Sensors/Room101", "Building01/Sensors/Room102", "Building01/Sensors/Room103", "Building01/Sensors/Room104",
        "Building01/Sensors/Room105", "Building01/Sensors/Room106", "Building01/Sensors/Room107", "Building01/Sensors/Room108", "Building01/Sensors/Room109",
        "Building01/Sensors/Room110", "Building01/Sensors/Room111", "Building01/Sensors/Room112", "Building01/Sensors/Room113", "Building01/Sensors/Room114",
        "Building01/Sensors/Room115", "Building01/Sensors/Room116", "Building01/Sensors/Room117", "Building01/Sensors/Room118", "Building01/Sensors/Room119",
        "Building01/Sensors/Room200", "Building01/Sensors/Room201", "Building01/Sensors/Room202", "Building01/Sensors/Room203", "Building01/Sensors/Room204",
        "Building01/Sensors/Room205", "Building01/Sensors/Room206", "Building01/Sensors/Room207", "Building01/Sensors/Room208", "Building01/Sensors/Room209",
        "Building01/Sensors/Room210", "Building01/Sensors/Room211", "Building01/Sensors/Room212", "Building01/Sensors/Room213", "Building01/Sensors/Room214",
        "Building01/Sensors/Room215", "Building01/Sensors/Room216", "Building01/Sensors/Room217", "Building01/Sensors/Room218", "Building01/Sensors/Room219",
        "Building01/Sensors/Room300", "Building01/Sensors/Room301", "Building01/Sensors/Room302", "Building01/Sensors/Room303", "Building01/Sensors/Room304",
        "Building01/Sensors/Room305", "Building01/Sensors/Room306", "Building01/Sensors/Room307", "Building01/Sensors/Room308", "Building01/Sensors/Room309",
        "Building01/Sensors/Room310", "Building01/Sensors/Room311", "Building01/Sensors/Room312", "Building01/Sensors/Room313", "Building01/Sensors/Room314",
        "Building01/Sensors/Room315", "Building01/Sensors/Room316", "Building01/Sensors/Room317", "Building01/Sensors/Room318", "Building01/Sensors/Room319"
    );


    //////////////////////////////////////////////////////////////////////////////////
    /// get iot data from socket connection

    //// Step 4, subscribe the socket data, draw chart base on selected dbid

    $("#startwebsocket").click(function (res) {
        //     //Add selection changed event
        _viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, _self.onSelectionChanged);
        _self.socketio.on(SOCKET_TOPIC_SENSORS, function (msg) {

            console.log("Sensor Data from Intel: " + msg);
            var msgJson = JSON.parse(msg);


            for (var i = 0; i < recv_topic.length; i++) {
                if (recv_topic[i] === msgJson.topic) {
                    if (colortag[i] != 'green' && msgJson.humidity < 70) {
                        _viewer.setThemingColor(
                            sel_dbid[i],
                            new THREE.Vector4(0, 255 / 255, 0, 1));   //Green
                        colortag[i] = 'green';

                    }
                    else if (colortag[i] != 'red' && msgJson.humidity >= 70) {
                        _viewer.setThemingColor(
                            sel_dbid[i],
                            new THREE.Vector4(255 / 255, 0, 0, 1));
                        colortag[i] = 'red';

                    }
                    recv_temperature[i] = msgJson.temperature;
                    recv_humidity[i] = msgJson.humidity;
                    //console.log('-----------received temp = ' + recv_temperature[i]);
                    //console.log('-----------received humi = ' + recv_humidity[i]);
                    break;
                }
            }
            //console.log('-----------dbid = ' + infoToIot.dbid );

            if (infoToIot.dbid === "")
                return;
            else {
                var index = sel_dbid.indexOf("" + infoToIot.dbid);
                // console.log('-----------index = ' + index);

                if (index != -1) {
                    console.log('-----------index = ' + index + '   -----------dbid = ' + infoToIot.dbid);
                    console.log('-----------To draw temp = ' + recv_temperature[index]);
                    console.log('-----------To draw humi = ' + recv_humidity[index]);

                    _data.setValue(0, 1, recv_temperature[index]);
                    _googleChart.draw(_data, _options);
                    _temperatureTimeSeries.append(new Date().getTime(), recv_temperature[index]);

                    _data.setValue(1, 1, recv_humidity[index]);
                    _googleChart.draw(_data, _options);
                    _humidityTimeSeries.append(new Date().getTime(), recv_humidity[index]);
                }
                return;
            }


        });
    });
    //// Step 4 end


    //// Step 5: Remove the listeners
    //// unsubscribe the socket data 
    $("#endwebsocket").click(function (res) {
        _viewer.clearThemingColors();
        infoToIot.dbid = "";
        _data.setValue(0, 1, 0);
        _googleChart.draw(_data, _options);

        _data.setValue(1, 1, 0);
        _googleChart.draw(_data, _options);

        _self.socketio.removeAllListeners(SOCKET_TOPIC_SENSORS);
        _viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT);
        colortag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	   //Restore this tag	

    });
    //// Step 5 end


    console.log('My Extension is loaded');
    return true;
};

Viewing.ClassroomTrainning.Extension.prototype.unload = () => {
    console.log('My Extension is unloaded');
    return true;

};


Autodesk.Viewing.theExtensionManager.registerExtension(
    'MyExtension', Viewing.ClassroomTrainning.Extension);


//////////////////////////////////////////////////////////


