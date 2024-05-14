require("dotenv").config();
const express = require("express");

//import cors
const cors = require("cors");

//importing third party middleware//
const morgan = require("morgan");

//importing postgress interface//
const db = require("./db/index.js");

const app = express();


// //Middleware - order is important! //
// app.use((req, res, next) => {
//     console.log(`middleware in the middle!`);
//     next();
// });

// //Second Middleware! //
// app.use((req, res, next) => {
//     console.log(`middle middle on the middle, who is in the middle of them all!`);
//     next();
// });

// //More functional middleware! //
// app.use((req, res, next) => {
//     res.status(404).json({
//         "status": "fail!"
//     });
//     next();
// });

// //Using Morgan //
// app.use(morgan("dev"));

//Middleware to all cross domain interaction
app.use(cors());

//Using express middleware in order to get the .body property on the request object//
app.use(express.json());

// Get all restaurants //


app.get("/api/v1/restaurants", async (req, res) => {

    //use try and catch when using async and await//
    try {

        //using the pg interface, will return promise, therefore use await and async//
        const results = await db.query("SELECT * FROM restaurants");

        res.status(200).json({

            status: "success",
            //best practise to have a property on the json response that lists the amount of results returned//
            results: results.rows.length,

            //data field//
            data: {

                //list of restaurants hard coded//
                //restuarant: ["KFC", "Steers"]

                //list of restaurants dynamic//
                restaurants: results.rows,
            },
        })
    } catch (err) {
        console.log(err);

    }
    
});

//Get a restaurant//
app.get("/api/v1/restaurants/:id", async (req, res) => {
    console.log(req.params);

    try {
        //using template stirng is bad as it makes our application vulnerable to sql injection attacks, should use a parameterized query//
        //const results = await db.query(`SELECT * FROM restaurants WHERE id = ${req.params.id}`);

        //parameterized query
        const results = await db.query("SELECT * FROM restaurants WHERE id = $1", [req.params.id]);

        //because we are only expecting one item from the array we can do a row[0]//
        console.log(results.rows[0]);

        res.status(200).json({
            status: "success",

            results: results.rows.length,

            data: {
                restaurant: results.rows[0],
            }
        });

    } catch (err) {
        console.log(err);
    }

    
});

//Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    console.log(req.body)

    try {
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING * ",
        [req.body.name, req.body.location, req.body.price_range]);

        console.log(results.rows[0]);

        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            }
        });

    } catch (err) {
        console.log(err);
    }
});

//Update Restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {

    console.log(req.params.id);

    try {

        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING * ",
        [req.body.name, req.body.location, req.body.price_range, req.params.id])

        console.log(req.body);
        
        res.status(200).json({
            status: "success",
            data: {
                restuarant: results.rows[0],
            }
        });

    } catch (err) {
        console.log(err);
    }
   
});

//Delete restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) =>{

    try {

        const results = await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id])

        res.status(204).json({
            status: "success"
        });

    } catch (err) {
        console.log(err);
    }
    
});


const port = process.env.PORT || 3001;
app.listen(port, () => {console.log(`server is up and listening on port ${port}`)});
