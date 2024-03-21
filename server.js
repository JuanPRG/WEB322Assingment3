/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Juan Pablo Rivera Guerra Student ID: __137647228_________ Date: ___21-mar-2024________
*
********************************************************************************/

const path = require('path');

const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
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


// Route to handle GET request to /lego/addSet
app.get('/lego/addSet', async (req, res) => {
    try {
        // Make a request to the getAllThemes() function
        const themes = await legoData.getAllThemes();
        
        // Render the addSet view with the themes
        res.render('addSet', { themes: themes });
    } catch (error) {
        // Handle errors
        console.error('Error fetching themes:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST route to handle adding a new LEGO set
app.post('/lego/addSet', async (req, res) => {
    try {
        // Extract data from req.body
        const setData = req.body;
        
        // Make a request to the addSet(setData) function
        await legoData.addSet(setData);
        
        // Redirect user to the "/lego/sets" route upon success
        res.redirect('/lego/sets');
    } catch (error) {
        // Render the "500" view with an error message if an error occurred
        console.error('Error adding LEGO set:', error);
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});
// Define the route to handle GET request to "/lego/editSet/:num"

app.get('/lego/editSet/:num', async (req, res) => {
    try {
        // Extract the setNum from the route parameter
        const setNum = req.params.num;

        // Make a request to getSetByNum(setNum) function
        const setData = await legoData.getSetsByNum(setNum);

        // Make a request to getAllThemes() function
        const themeData = await legoData.getAllThemes();

        // Render the "edit" view with theme data and set data
        res.render('editSet', { themes: themeData, set: setData });
    } catch (error) {
        // Render the "404" view with an appropriate error message
        res.status(404).render('404', { message: error });
    }
});

// Define the route to handle POST request to "/lego/editSet"
app.post('/lego/editSet', async (req, res) => {
    try {
        // Extract data from req.body
        const setNum = req.body.set_num;
        const setData = req.body;

        // Make a request to editSet(set_num, setData) function
        await legoData.editSet(setNum, setData);

        // Redirect user to the "/lego/sets" route upon success
        res.redirect('/lego/sets');
    } catch (error) {
        // Render the "500" view with an error message if an error occurred
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});

// Define the route to handle GET request to "/lego/deleteSet/:num"
app.get('/lego/deleteSet/:num', async (req, res) => {
    try {
        // Extract the setNum from the route parameter
        const setNum = req.params.num;

        // Make a request to deleteSet(setNum) function
        await legoData.deleteSet(setNum);

        // Redirect user to the "/lego/sets" route upon success
        res.redirect('/lego/sets');
    } catch (error) {
        // Render the "500" view with an error message if an error occurred
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});



app.use((req, res, next) => {
    const filePath = path.join(__dirname, 'views', '404.html');
    res.status(404).render("404", {message: '404 Error. No view matched for a specific route'});
  });


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});







