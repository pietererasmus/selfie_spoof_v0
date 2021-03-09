const express = require('express');
const {spawn} = require('child_process');
const app = express()
const port = 3000;

// var img_path = 'images/selfie_good/20200901003820.jpg';
// var img_path = 'images/selfie_good/20200901015634.jpg';
// var img_path = 'images/selfie_good/20200901054931.jpg';
// var img_path = 'images/selfie_good/20200901070520.jpg';
// var img_path = 'images/selfie_good/20200901082350.jpg';

// var img_path = 'images/selfie_bad/20200810063756.jpg';
// var img_path = 'images/selfie_bad/20200812140910.png';
// var img_path = 'images/selfie_bad/20200812193745.jpeg';
// var img_path = 'images/selfie_bad/20200813140240.jpeg';
// var img_path = 'images/selfie_bad/20200814143717.jpg';
var img_path = 'images/selfie_bad/20200819202904.jpg';

app.get('/', (req, res) => {
    var dataToSend;
    console.log("This spot is reached")

    const python = spawn("python", ['python/script1.py', img_path]);
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(`data received: ${dataToSend}`);
    });

    python.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    })

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.send(dataToSend);
    });

    python.on('exit', function(code, signal){
        console.log(`child process exited with code ${code} and signal ${signal}`)
    })

    python.on('disconnect', function(code, signal){
        console.log(`child process disconnected with code ${code} and signal ${signal}`)
    })

    python.on('error', function(code, signal){
        console.log(`child process error with code ${code} and signal ${signal}`)
    })

    python.on('message', function(code, signal){
        console.log(`child process message with code ${code} and signal ${signal}`)
    })

});

app.listen(port, () => console.log(`Exaple app listening on port ${port}`));
