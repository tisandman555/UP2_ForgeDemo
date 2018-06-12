# Intel UP2 IOT Workshop with Forge Viewer

This project is based on [Autodesk IoT workshop](https://github.com/JohnOnSoftware/IntelForgeSample)

Connect Forge viewer with IOT device sample
[![LMV](https://img.shields.io/badge/Viewer-v1.2.23-green.svg)](https://developer.autodesk.com/api/view-and-data-api/)

This is a skeleton sample to demo the connection of [Intel Up2 Grove board](https://software.intel.com/en-us/upsquared-grove-getting-started-guide) with [Forge Viewer](https://developer.autodesk.com/en/docs/viewer/v2/overview/). 

## Setup
1. For using this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). Finally make a copy of client id and client secret. 
2. Please use other ways to translate the source model to the format for Forge Viewer in advance. Get the model base64 urn. The model in this demo is currently using [rac_advanced_sample_project.rvt](https://knowledge.autodesk.com/support/revit-products/getting-started/caas/CloudHelp/cloudhelp/2019/ENU/Revit-GetStarted/files/GUID-61EF2F22-3A1F-4317-B925-1E85F138BE88-htm.html)

### 1. Setup UP2 board as IoT Client
You can use UP2 as the IoT client in this demo
1. Prepare a Intel Up2 Grove board, and make sure the board has been setup correctly with the guidance of [Step 1: Make Board Connections](https://software.intel.com/en-us/upsquared-grove-getting-started-guide-power-on-board)
2. Connect Temperature and Humidity sensor to I2C-2, and LCD sensor to I2C-3
3. Setup the NodeJS runtime of UP2 board, the instruction is [here](https://github.com/tisandman555/UP2_JS/blob/master/README.md)
4. The test code is [UP2/Lab4_mqtt_up2.js](https://github.com/tisandman555/UP2_ForgeDemo/blob/master/UP2/Lab4_mqtt_up2.js)

### 2. Setup PC as IoT Client
You can use PC as the IoT client in this demo
1. Install NodeJS runtime on your PC, the install file can be downloaded from [here](https://nodejs.org)
2. Install MQTT library `npm install -g mqtt`
3. The test files are [UP2/Lab4_room101.js](https://github.com/tisandman555/UP2_ForgeDemo/blob/master/UP2/Lab4_room101.js)\
[UP2/Lab4_room105.js](https://github.com/tisandman555/UP2_ForgeDemo/blob/master/UP2/Lab4_room105.js)\
[UP2/Lab4_room110.js](https://github.com/tisandman555/UP2_ForgeDemo/blob/master/UP2/Lab4_room110.js)\
... etc.


## Local Test

1. Set enviroment variables of Forge credentials or hard-coded the credentials in [credentials.js]. 

    Mac OSX/Linux (Terminal). 
    
        export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
        export FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    
    Windows (command line)

        set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
        set FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>

2. In [www\js\index.js](www\js\index.js), replace the documentID with your own demo documentID.
3. Run the project `node server.js`, open up a browser page, and fill http://localhost:3000 at the address bar. Then the model loaded in the page.
4. Click *start web socket* in http://localhost:3000, you will see the value of timeline and chart will be changed based on the data from Intel board, and also the window objects will change the color with the data from device.
5. Power **Intel Up2 Grove board**, deploy [UP2/Lab4_mqtt_up2.js](https://github.com/tisandman555/UP2_ForgeDemo/blob/master/UP2/Lab4_mqtt_up2.js) to the board. Run the script with `sudo nodejs Lab4_mqtt_up2.js`
6. Or run `node Lab4_room310.js` on your PC, the file is from here [UP2/Lab4_room310.js](https://github.com/tisandman555/UP2_ForgeDemo/blob/master/UP2/Lab4_room310.js)

Afterwards, you should see the model in your browser responsing the sensor info (the color of the window is shown in Green or Red)

## Written By
Caihong Qian, Jianjun Gu, Fanjiang Pei
