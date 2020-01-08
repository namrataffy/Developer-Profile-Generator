var inquirer = require("inquirer");
var fs = require("fs");
const axios = require("axios");
const convertFactory = require("electron-html-to");
var ElectronPDF = require("electron-pdf");
var util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
var colorChoice;
let textColor = "white";
var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

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
  colorChoice = data.color;

  axios
    .get(urlQ)
    .then(response => {
      // console.log(response);
      //console.log(response.data);
      dataObj = {
        profImg: response.data.avatar_url || "No profile image",
        userName: response.data.login,
        linkToGit: response.data.html_url,
        bio: response.data.bio || "No bio",
        numberRepo: response.data.public_repos,
        numberFollowers: response.data.followers,
        numberFollowing: response.data.following,
        blog: response.data.blog,
        location: response.data.location,
        stars: response.data.public_gists,
        name: response.data.name
      };
      //console.log(dataObj);

      const htmlF = generateHTML(dataObj);
      //writeFileAsync("index.html", htmlF);
      return htmlF;

      // maps link thing -- https://www.google.com/maps/search/?api=1&query= (separate with +)
    })
    .then(res => {
      conversion({ html: res }, function(err, result) {
        //console.log(res);

        if (err) {
          return console.error(err);
        }
        result.stream.pipe(fs.createWriteStream("profile.pdf"));
        conversion.kill();
      });
    });
});

function generateHTML(dataObj) {
  if (colorChoice == "white" || colorChoice == "yellow") {
    textColor = "black";
  }

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
  <style>
  body{
    color:${textColor};
  }
  .card{
    background-color: ${colorChoice};
  }
  .cardSmall{
    width:50%;
    float: left;
  }
  .imager{
    border-radius:50%;
  }
  a{
    display:inline-block;
  }
  @media print { body {               -webkit-print-color-adjust: exact;            }         }
  </style>
    <div class="container">
      <div class="card text-center  mt-4 mb-3">
        <div class = "card-body">
        <img class = "imager" src = ${dataObj.profImg} width = 30% id="prof" alt="profileimg">
        <h1>Hello my name is ${dataObj.name}</h1>
        <p>${dataObj.bio}</p>
        <a href="${dataObj.linkToGit}" >GitHub: ${dataObj.userName}</a>
        <a class = "ml-2"  href="${dataObj.blog}" >Blog</a>
        <a class = "ml-2"  href="https://www.google.com/maps/place/${dataObj.location}" >${dataObj.location}</a>
  
        </div>
      </div>
  
      <div class="card cardSmall text-center  mb-3">
      <div class="card-body">
        <h2>Public Repositories</h2>
        <h2>${dataObj.numberRepo}</h2>
      </div>
    </div>
    <div class="card cardSmall text-center  mb-3">
    <div class="card-body">
      <h2>Followers</h2>
      <h2>${dataObj.numberFollowers}</h2>
    </div>
  </div>
  <div class="card cardSmall text-center  mb-3">
  <div class="card-body">
    <h2>Following</h2>
    <h2>${dataObj.numberFollowing}</h2>
  </div>
  </div>
  <div class="card cardSmall text-center  mb-3">
  <div class="card-body">
    <h2>GitHub Stars</h2>
    <h2>${dataObj.stars}</h2>
  </div>
  </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
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
