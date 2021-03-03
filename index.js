const express = require('express');
const {spawn} = require('child_process');
const app = express()
const port = 3000;

var img_path = 'images/selfie_good/2020091003820.jpg';
// var img_path = 'images/selfie_good/2020091003820.jpg';
// var img_path = 'images/selfie_good/2020091015634.jpg';
// var img_path = 'images/selfie_good/2020091054931.jpg';
// var img_path = 'images/selfie_good/2020091070520.jpg';
// var img_path = 'images/selfie_good/20200901082350.jpg';



app.get('/', (req, res) => {
    var dataToSend;
    console.log("This spot is reached")

    const python = spawn("python", ['python/script1.py', img_path]);
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });

    python.on('close', (code) => {
        console.log('child process close all stdio with code ${code}');
        res.send(dataToSend);
    });
});

app.listen(port, () => console.log("Exaple app listening on port ${port}"));
