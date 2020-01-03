var inquirer = require("inquirer");
var fs = require("fs");
const axios = require("axios");
const convertFactory = require("electron-html-to");
var ElectronPDF = require("electron-pdf");

// var conversion = convertFactory({
//   converterPath: convertFactory.converters.PDF
// });

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

    var urlQ = "https://api.github.com/users/" + data.username;

    axios.get(urlQ).then(response => {
      // console.log(response);
      console.log(response.data);
      let profImg = response.data.avatar_url;
      let userName = response.data.login;
      let linkToGit = response.data.url;
      let bio = response.data.bio;
      let numberRepo = response.data.public_repos;
      let numberFollowers = response.data.followers;
      let numberFollowing = response.data.following;
      let location = response.data.location;

      // maps link thing -- https://www.google.com/maps/search/?api=1&query= (separate with +)
    });
  });

// .then(function() {
//   conversion({ html: "<h1>Hello World</h1>" }, function(err, result) {
//     if (err) {
//       return console.error(err);
//     }

//     console.log(result.numberOfPages);
//     console.log(result.logs);
//     result.stream.pipe(fs.createWriteStream("thing.pdf"));
//     conversion.kill();
//   });
// });
