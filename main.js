const PORT = 8080


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789abcdefghjkmnpqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const { response } = require("express");
var express = require("express")
var app = express()
var customlog = require("./customlog").customlog

var tokens  = new Map() // map tokens to user info
var usermap = new Map() // map usernames back to tokens

app.use(express.urlencoded({ extended: true }))
app.use(customlog)

app.get('/home', (req, res) => {
    res.sendFile("home.html", { // send home.html
        root: "pages/"
    })
})

app.post('/make_account', (req, res) => { // generate the user token,
    console.log(req.body)                 // set it in the tokens map
    user = req.body                       // and pass it back to the user
    newToken = makeid(48)
    if (usermap.get(user.username)){      // error if username already has a token mapped to it
        return res.status(400).send({error: "Username already exists"})
    }
    tokens.set(newToken, user)
    usermap.set(user.username, newToken)
    res.status(200).send(newToken + `<br>Try going to <a href='../get_account/${newToken}'>/get_account/${newToken}</a> now`)
})

app.get('/get_account/:token', (req, res) => { 
    account = tokens.get(req.params.token) // req.params.token == :token in the url
    if (account) {                         // show saved account for token if it exists
        res.status(200).send(account)
    } else {                              // else error, token doesn't have information associated
        res.status(404).send({error:"No such token"})
    }
})

app.get("/", (req, res) => { // Redirect / to /home
    res.redirect("/home")
})

/* app.all("*", (req, res) => { // Catch-all 404 handler.. shouldn't be used here?
    res.status(404).send("404 Not Found")
}) */

app.listen(PORT)
console.log(`Listening on port ${PORT}`)