'use strict';

let ledWrite = null;

// Hide connect button and show text box once connected
function onConnected() {
    document.querySelector('.connect-button').classList.add('hidden');
    document.querySelector('.user_data').classList.remove('hidden');
}

// Connect to LED
function connect() {
    console.log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({
            filters: [{ name: 'MLT-BT05'}]
        })
        .then(device => {
            console.log('> Found ' + device.name);
            console.log('Connecting to GATT Server...');
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Getting Service 0000ffe0-0000-1000-8000-00805f9b34fb...');
            return server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        })
        .then(service => {
            console.log('Getting Characteristic...');
            service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb')
            .then(characteristic => {
                ledWrite = characteristic
            })
            console.log('All ready!');
            onConnected();
        })
        .catch(error => {
            console.log('Argh! ' + error);
        });
}

function sendData() {
    let val = $('#data_field').val();
    console.log('Sending status packet (' + val + ')...');
    let data = new Uint8Array([val]);
    return ballWrite.writeValue(data)
        .catch(err => console.log('Error when sending status packet! ', err))
}