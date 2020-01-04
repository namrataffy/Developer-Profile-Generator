var inquirer = require("inquirer");
var fs = require("fs");
const axios = require("axios");
const convertFactory = require("electron-html-to");
var ElectronPDF = require("electron-pdf");
var util = require("util");

// var conversion = convertFactory({
//   converterPath: convertFactory.converters.PDF
// });

const writeFileAsync = util.promisify(fs.writeFile);

function prompt() {
  return inquirer.prompt([
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
  ]);
}

prompt().then(function(data) {
  // console.log(data);

  var urlQ = "https://api.github.com/users/" + data.username;

  axios.get(urlQ).then(response => {
    // console.log(response);
    // console.log(response.data);
    dataObj = {
      profImg: response.data.avatar_url,
      userName: response.data.login,
      linkToGit: response.data.url,
      bio: response.data.bio,
      numberRepo: response.data.public_repos,
      numberFollowers: response.data.followers,
      numberFollowing: response.data.following,
      location: response.data.location
    };
    console.log(dataObj);
    let html = generateHTML(dataObj);

    return writeFileAsync("index.html", html);
    // maps link thing -- https://www.google.com/maps/search/?api=1&query= (separate with +)

    // fs.writeFile("thing.html", location, function(err) {
    //   if (err) throw err;
    //   console.log("Saved!");
    // });
  });
});

function generateHTML(dataObj) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${dataObj.location}</h1>
    <p class="lead">I am from ${dataObj.bio}.</p>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${dataObj.userName}</li>
      <li class="list-group-item">LinkedIn: ${dataObj.linkToGit}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}

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
