/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Juan Pablo Rivera Guerra Student ID: __137647228_________ Date: ___07-mar-2024________
*
********************************************************************************/

const path = require('path');

const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
const port = 3000;


legoData.initialize();


//declaring static path folder for express.js
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Route: GET "/"
app.get('/', async(req, res)=>{
    try {
        //const filePath = path.join(__dirname, 'views', 'home.html');
        res.render("home");
    } catch (error) {
        console.error(error);
        res.status(404).render("404", {message: '404 Error loading home page, error: ' + error});
    }
});

// Route: GET "/lego/sets"
app.get('/lego/sets', async (req, res) => {
    try {      
        const theme = req.query.theme;
        
        if(theme){
            const setsByTheme = await legoData.getSetsByTheme(theme);
            res.render("sets",{sets: setsByTheme});
        } else {
            const allSets = await legoData.getAllSets();
            res.render("sets",{sets: allSets});
        }
    } catch (error) {
        res.status(404).render("404", {message: '404 Error No Sets found for a matching theme: ' + error});
    }
});

// Route: GET "/lego/sets/:code"
app.get('/lego/sets/:code', async (req, res) => {
    try {
        const setCode = req.params.code;
        const setByNum = await legoData.getSetsByNum(setCode);
        res.render("set", {set: setByNum});
    } catch (error) {
        res.status(404).render("404", {message: '404 Error No Sets found for a specific set num: ' + error});
    }
});

//path for about.html
app.get('/about', async(req, res)=>{
    try {
        const filePath = path.join(__dirname, 'views', 'about.html');
        res.render("about");
    } catch (error) {
        console.error(error);
        res.status(404).render("404", {message: '404 Error: ' + error});
    }

})


app.use((req, res, next) => {
    const filePath = path.join(__dirname, 'views', '404.html');
    res.status(404).render("404", {message: '404 Error. No view matched for a specific route'});
  });


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});







