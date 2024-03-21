/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Juan Pablo Rivera Guerr Student ID: __137647228_________ Date: ___01-feb-2024________
*
********************************************************************************/
require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });

  const Theme = sequelize.define(
    'Theme',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true, // automatically increment the value
      },
      name: Sequelize.STRING,
    },
    {
      createdAt: false, // disable createdAt
      updatedAt: false, // disable updatedAt
    }
  );

  const Set = sequelize.define(
    'Set',
    {
      set_num: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      year: Sequelize.INTEGER,
      num_parts: Sequelize.INTEGER,
      theme_id: Sequelize.INTEGER,
      img_url: Sequelize.STRING,
    },
    {
      createdAt: false, // disable createdAt
      updatedAt: false, // disable updatedAt
    }
  );

Set.belongsTo(Theme, {foreignKey: 'theme_id'});


// const setData = require("../data/setData");
// const themeData = require("../data/themeData");

module.exports = {initialize, getAllSets, getSetsByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet};

// let sets = [];

function initialize(){
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getAllSets(){
        return new Promise((resolve, reject) => {
        // Use Sequelize's findAll method to get all sets from the database
        Set.findAll({
            include: [Theme] // Include Theme data
        })
            .then(sets => {
                // Check if sets array is not empty
                if (sets.length > 0) {
                    resolve(sets);
                } else {
                    // If sets array is empty, reject with a custom error message
                    reject(new Error("No sets found in the database"));
                }
            })
            .catch(error => {
                reject(error);
            });
    });

}

function getSetsByNum(setNum){
    return new Promise((resolve, reject) => {
        // Use Sequelize's findOne method to find a single set by set_num value
        Set.findOne({
            where: { set_num: setNum }, // Specify the condition to find the set
            include: [Theme] // Include Theme data
        })
        .then(set => {
            // If a set is found, resolve the promise with the set
            if (set) {
                resolve(set);
            } else {
                // If no set was found, reject the promise with an error message
                reject("Unable to find requested set");
            }
        })
        .catch(error => {
            // If there's an error during the database operation, reject the promise with the error
            reject(error);
        });
    });
}

function getSetsByTheme(theme){

    return new Promise((resolve, reject) => {
        // Decode the theme parameter if it's URL encoded
        const decodedTheme = decodeURIComponent(theme);

        // Use Sequelize's findAll method to find all sets with the specified theme
        Set.findAll({
            include: [Theme], // Include Theme data
            where: {
                '$Theme.name$': {
                    [Sequelize.Op.iLike]: `%${decodedTheme}%` // Case-insensitive search for theme name
                }
            }
        })
        .then(sets => {
            // If sets are found, resolve the promise with the sets
            if (sets.length > 0) {
                resolve(sets);
            } else {
                // If no sets were found, reject the promise with an error message
                reject("Unable to find requested sets");
            }
        })
        .catch(error => {
            // If there's an error during the database operation, reject the promise with the error
            reject(error);
        });
    });

}

async function addSet(setData) {
    return new Promise((resolve, reject) => {
        // Create a new Set using the Set model and setData
        Set.create({
            set_num: setData.set_num,
            name: setData.name,
            year: setData.year,
            num_parts: setData.num_parts,
            theme_id: setData.theme_id,
            img_url: setData.img_url,
          }).then(() => {
                // Resolve the Promise once the set has been created
                resolve();
            })
            .catch(error => {
                // Reject the Promise with an appropriate error message
                if (error.errors && error.errors.length > 0) {
                    reject(error.errors[0].message);
                } else {
                    reject(error.message);
                }
            });
    });
}

async function getAllThemes() {
    return new Promise((resolve, reject) => {
        // Use Sequelize's findAll() method to retrieve all themes
        Theme.findAll()
            .then(themes => {
                // Resolve the Promise with the retrieved themes
                resolve(themes);
            })
            .catch(error => {
                // Reject the Promise with an error message if there's an error
                reject(error.message);
            });
    });
}

async function editSet(set_num, setData) {
    return new Promise((resolve, reject) => {
        // Find the set to update by set_num
        Set.findOne({ where: { set_num: set_num } })
            .then(set => {
                if (!set) {
                    // If set with the given set_num is not found, reject the Promise
                    reject("Set not found");
                } else {
                    // Update the set with the provided setData
                    return set.update(setData);
                }
            })
            .then(() => {
                // Resolve the Promise once the set has been updated successfully
                resolve();
            })
            .catch(error => {
                // Reject the Promise with an appropriate error message
                if (error.errors && error.errors.length > 0) {
                    reject(error.errors[0].message);
                } else {
                    reject(error.message);
                }
            });
    });
}

async function deleteSet(set_num) {
    return new Promise((resolve, reject) => {
        // Find the set to delete by set_num
        Set.findOne({ where: { set_num: set_num } })
            .then(set => {
                if (!set) {
                    // If set with the given set_num is not found, reject the Promise
                    reject("Set not found");
                } else {
                    // Delete the set
                    return set.destroy();
                }
            })
            .then(() => {
                // Resolve the Promise once the set has been deleted successfully
                resolve();
            })
            .catch(error => {
                // Reject the Promise with an appropriate error message
                if (error.errors && error.errors.length > 0) {
                    reject(error.errors[0].message);
                } else {
                    reject(error.message);
                }
            });
    });
}
// sequelize
//   .sync()
//   .then( async () => {
//     try{
//       await Theme.bulkCreate(themeData);
//       await Set.bulkCreate(setData); 
//       console.log("-----");
//       console.log("data inserted successfully");
//     }catch(err){
//       console.log("-----");
//       console.log(err.message);

//       // NOTE: If you receive the error:

//       // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"

//       // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   

//       // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   });


