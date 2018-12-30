const express = require('express');
const app = express();
const port = 3090;

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Now listining on port number ${port}`)
})