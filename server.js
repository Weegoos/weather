let express = require('express');
let path = require('path');
const bodyParser = require('body-parser');

let app = express()
let PORT = process.env.PORT || 3000;

app.get('/api/data', (req, res) =>{
    const serverData = {message: "Сервер работает!"};
    res.json(serverData)
  })
 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.resolve(__dirname, 'Weather')))

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'main', 'main.html'))
});
app.use('/main/css', express.static(path.resolve(__dirname, 'main', 'css')))
app.use('/main', express.static(path.resolve(__dirname, 'main')))
app.use('/main', express.static(path.resolve(__dirname, 'function')))

app.get('/news', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'news', 'news.html'))
})

app.use('/news', express.static(path.resolve(__dirname, 'news')))

app.listen(PORT, () => {
    // console.log(`Server is running on http://localhost:${PORT}`);
})

