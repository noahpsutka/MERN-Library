const express = require('express');

var app = express();

const { MongoClient } = require('mongodb');

let cs = "mongoDB_connection_string" // your mongodb *connection string*, removed for GitHub upload
let db;
let books

// CORS/caching middleware handler
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length');
    res.header('Cache-control', 'no-store');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
});

async function indexExists(ID) {
    if (await books.find({ id: ID }).count() > 0) {
        return true;
    } else {
        return false;
    }
}

// id verification middleware
app.use('/books/:id', function (req, res, next) {
    let id = req.params.id;
    indexExists(id)
        .then((exists) => {
            // console.log(`middleware examining id: ${id} exists: ${exists} `);
            if (req.method == "DELETE" && !exists) {
                res.status(204).send(`${id} no content`);
                return;
            }
            if ((req.method == "PUT" || req.method == "GET") && !exists) {
                res.status(404).send(`${id} not found`);
                return;
            }
            if ((req.method == "POST") && exists) {
                res.status(404).send(`${id} already exists`);
                return;
            }
            next();
        });
});

app.use(express.json());    // <=== parse request body as JSON

var allbooks = [
    {
        id: "1", title: "Reactions in REACT", author: "Ben Smith",
        publisher: "Random House", isbn: "978-3-16-148410-0", avail: true,
        who: "", due: ""
    },
    {
        id: "2", title: "Express-sions", author: "Frieda Livery",
        publisher: "Chaotic House", isbn: "978-3-16-148410-2", avail: true,
        who: "", due: ""
    },
    {
        id: "3", title: "Restful REST", author: "Al Gorithm",
        publisher: "ACM", isbn: "978-3-16-143310-1", avail: true,
        who: "", due: ""
    },
    {
        id: "4", title: "See Essess", author: "Anna Log",
        publisher: "O'Reilly", isbn: "987-6-54-148220-1", avail: false,
        who: "Homer", due: "1/1/23"
    },
    {
        id: "5", title: "Scripting in JS", author: "Dee Gital",
        publisher: "IEEE", isbn: "987-6-54-321123-1", avail: false,
        who: "Marge", due: "1/2/23"
    },
    {
        id: "6", title: "Be An HTML Hero", author: "Jen Neric",
        publisher: "Coders-R-Us", isbn: "987-6-54-321123-2", avail: false,
        who: "Lisa", due: "1/3/23"
    },
    {
        id: "7", title: "Reactions in REACT 2", author: "Ben Smith",
        publisher: "Random House", isbn: "978-3-16-148410-1", avail: false,
        who: "", due: "1/5/23"
    },
    {
        id: "8", title: "Express-sions 2", author: "Frieda Livery",
        publisher: "Chaotic House", isbn: "978-3-16-148410-3", avail: true,
        who: "", due: ""
    },
    {
        id: "9", title: "Restful REST 2", author: "Al Gorithm",
        publisher: "ACM", isbn: "978-3-16-143310-2", avail: true,
        who: "", due: ""
    },
    {
        id: "10", title: "Scripting in JS 2", author: "Dee Gital",
        publisher: "IEEE", isbn: "987-6-54-321123-2", avail: false,
        who: "Marge", due: "1/2/23"
    },
]

function loadbooks() {
    books.insertMany(allbooks);
}

app.get('/', (req, res) => {
    res.json("Welcome to the server");
});

app.get('/books', (req, res) => {
    books.find()
        .project({ _id: 0, id: 1, title: 1, avail: 1 })
        .toArray()
        .then(allbooks => {
            res.send(JSON.stringify(allbooks))
        })
});

app.get('/books/:id', (req, res) => {
    books.find({ id: req.params.id })
        .project({ _id: 0 })
        .toArray()
        .then((book) => {
            if (book == null)
                res.status(404).send("not found")
            else res.send(JSON.stringify(book))
        })
});

app.put('/books/:id', (req, res) => {
    // console.log("put body: " + JSON.stringify(req.body));
    books.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body });
    res.status(200).send(`${req.params.id} updated`);
});

app.delete('/books/:id', (req, res) => {
    books.deleteOne({ id: req.params.id });
    res.status(200).send(`${req.params.id} deleted`);
});

app.post('/books', (req, res) => {
    // Request for post must include a book id and title
    // other parameters are optional 
    indexExists(req.body.id)
        .then((exists) => {
            if (!exists) {
                if (req.body.id && req.body.title) {
                    books.insertOne(req.body)
                    res.status(201).send(`${req.body.id} created`);
                }
                else
                    res.status(404).send(`missing parameters`);
            }
            else
                res.status(403).send(`${req.body.id} already exists`);
        });
});

app.get('/reset', (req, res) => {
    books.deleteMany();
    loadbooks();
    res.send("Library reset");

});

async function start() {
    const client = new MongoClient(cs)  //instantiate the client
    await client.connect();
    db = client.db("DB1"); // database name (whatever name you set to your database)
    books = db.collection("books"); // collection name (whatever name you gave your collection)
    books.deleteMany();
    loadbooks();
    console.log("Server started, loaded books");
    app.listen(5000);
}
start();
