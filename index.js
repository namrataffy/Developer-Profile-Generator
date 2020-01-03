var inquirer = require("inquirer");
var fs = require("fs");
const axios = require("axios");
var ElectronPDF = require("electron-pdf");

inquirer
  .prompt([
    {
      type: "input",
      name: "username",
      message: "What is your GitHub username?"
    },
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    }
  ])
  .then(function(data) {
    // fs.writeFile(filename, JSON.stringify(data, null, "\t"), function(err) {
    //   if (err) {
    //     return console.log(err);
    //   }

    //   console.log("Success!");
    // });
    console.log(data);

    var urlQ = "https://api.github.com/users/" + data.username + "/repos";

    axios.get(urlQ).then(response => {
      console.log(response);
    });
  });
