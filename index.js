const express = require('express');
const path = require('path');
const app = express();


//settings
app.set('port', 3000)

//middlewares
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.get('/', (req, res) => {
    res.send('hola');
})

app.listen(app.get('port'));
console.log('Server on port ', app.get('port'));