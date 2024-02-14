/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Juan Pablo Rivera Guerra Student ID: __137647228_________ Date: ___14-feb-2024________
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

// Route: GET "/"
app.get('/', async(req, res)=>{
    try {
        const filePath = path.join(__dirname, 'views', 'home.html');
        res.sendFile(filePath);
    } catch (error) {
        console.error(error);
        res.status(404).send('Home not found');
    }
});

// Route: GET "/lego/sets"
app.get('/lego/sets', async (req, res) => {
    try {      
        const theme = req.query.theme;
        
        if(theme){
            const setsByTheme = await legoData.getSetsByTheme(theme);
            res.json(setsByTheme);
        } else {
            const allSets = await legoData.getAllSets();
            res.json(allSets);
        }
    } catch (error) {
        res.status(404).send('404 Error retrieving Lego sets: ' + error);
    }
});

// Route: GET "/lego/sets/:code"
app.get('/lego/sets/:code', async (req, res) => {
    try {
        const setCode = req.params.code;
        const setByNum = await legoData.getSetsByNum(setCode);
        res.json(setByNum);
    } catch (error) {
        res.status(404).send('Error getting set by number: ' + error);
    }
});

//path for about.html
app.get('/about', async(req, res)=>{
    try {
        const filePath = path.join(__dirname, 'views', 'about.html');
        res.sendFile(filePath);
    } catch (error) {
        console.error(error);
        res.status(404).send('about.html Not found');
    }

})


app.use((req, res, next) => {
    const filePath = path.join(__dirname, 'views', '404.html');
    res.status(404).sendFile(filePath);
  });


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});







