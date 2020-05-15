var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('dist'));
app.use(cors());

dotenv.config();

app.get('/', (req, res) => {
    res.sendFile('dist/index.html')
    // res.status(200).sendFile(path.resolve('src/client/views/index.html'))
});


const projectData = {};

app.post('/add', (req, res) => {
    console.log(req.body);
    projectData.temp = req.body.temp;
    projectData.date = req.body.date;
    projectData.userResponse = req.body.userResponse;


    res.status(200).send(projectData);
});


app.listen(8081, () => {
    console.log('Example app listening on port 8081!')
});

module.exports = app
