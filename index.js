var inquirer = require("inquirer");
var fs = require("fs");
const axios = require("axios");
const convertFactory = require("electron-html-to");
var ElectronPDF = require("electron-pdf");

var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

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
    console.log(data);

    var urlQ = "https://api.github.com/users/" + data.username + "/repos";

    axios.get(urlQ).then(response => {
      console.log(response);
    });
  })
  .then(function() {
    conversion({ html: "<h1>Hello World</h1>" }, function(err, result) {
      if (err) {
        return console.error(err);
      }

      console.log(result.numberOfPages);
      console.log(result.logs);
      result.stream.pipe(fs.createWriteStream("/Desktop/thing.pdf"));
      // conversion.kill();
    });
  });
