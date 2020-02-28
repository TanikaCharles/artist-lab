const fs = require("fs")
const express = require("express")
const path = require("path");
const cors = require("cors")
const bodyParser = require('body-parser')
//const artistRoute = require("./routes/artists");
const port = process.env.PORT || 3000;


const app = express();
app.disable('x-powered-by');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static("public/css"));
app.use(express.static("public/js"));


app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname,"/index.html"));
});

app.get("/artists/all", (req, res)=>{
    fs.readFile("artists.json", (err, buffer)=>{
        if(err) return console.error(err);

        var parsed = JSON.parse(buffer.toString());
        res.send(parsed);
    });
});

app.post("/artists/delete", (req, res)=>{
    fs.readFile("artists.json", (err, buffer)=>{
        if(err) return console.error(err);
        var parsed = JSON.parse(buffer.toString());
        var artistArray = parsed.filter(a =>{
            if(a.name===req.body.name)
                return false;
            return true;
        });
        fs.writeFile("artists.json", JSON.stringify(artistArray), err=>{
            if(err) return console.error(err);
        });
    });
});

app.post("/artists/add", (req, res)=>{
    fs.readFile("artists.json", (err, buffer)=>{
        if(err) return console.error(err);
        var parsed = JSON.parse(buffer.toString());
        parsed.push(req.body);
        console.log(parsed);
        fs.writeFile("artists.json", JSON.stringify(parsed), err=>{
            if(err) return console.error(err);
        });
    });
});


app.listen(port, () =>{
   console.log("working"); 
});