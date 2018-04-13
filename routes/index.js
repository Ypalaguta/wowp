var express = require('express');
var router = express.Router();
var request = require('request');
var HTMLParser = require('node-html-parser');



/* GET home page. */
//https://www.wowprogress.com/gearscore/?lfg=1&raids_week=&lang=ru&sortby=ts

//https://www.wowprogress.com/gearscore/char_rating/next/1/lfg.1/raids_week./lang.ru/sortby.ts
//https://www.wowprogress.com/gearscore/char_rating/prev/2/lfg.1/raids_week./lang.ru/sortby.ts } post ajax=1
//https://www.wowprogress.com/gearscore/char_rating/prev/1/lfg.1/raids_week./lang.ru/sortby.ts } post ajax=1
var result;
var resultCount;
var sitesCount = 10;

var globalCounter = 0;
router.get('/', function(req, res, next) {
    logClient(req);
     result = new Array(10);
     resultCount = 0;
    for(var i = -1;i<sitesCount;i++)
      request("https://www.wowprogress.com/gearscore/char_rating/next/"+i+"/lfg.1/raids_week./lang.ru/sortby.ts", function (numberOfInstance, error, responce, body) {
          if(resultCount == sitesCount){
              result[numberOfInstance+1] = parseTable(body);
              res.render('index', { title: 'Express', responceHtml: result });
              resultCount++;
          }
          else{
              result[numberOfInstance+1] = parseTable(body);
              resultCount++;
          }
      }.bind(this,i));
});

function parseTable(body) {
    const root = HTMLParser.parse(body);
    var result = root.querySelectorAll("#char_rating_container table tr");
    var reallyResult = [];
    result.forEach(function (p1, p2, p3) {
        if(typeof p1.childNodes[0] != "undefined" &&
            typeof p1.childNodes[1] != "undefined" &&
            typeof p1.childNodes[2] != "undefined" &&
            typeof p1.childNodes[3] != "undefined" &&
            typeof p1.childNodes[4] != "undefined" &&
            typeof p1.childNodes[5] != "undefined"){
        // var res = p1.childNodes[0].text + " " + p1.childNodes[1].text + " " + p1.childNodes[2].text + " " + p1.childNodes[3].text + " " + p1.childNodes[4].text + " " + p1.childNodes[5].text;
        // console.log(res);
            reallyResult.push([
                makeCharHtml(p1.childNodes[0]),
                makeGuildHtml(p1.childNodes[1]),
                p1.childNodes[2].text,
                p1.childNodes[3].text,
                p1.childNodes[4].text,
                p1.childNodes[5].text]);
        }
    });
    return reallyResult;
}
function makeCharHtml(node) {
    return {
        "name" : node.text,
        "class" : node.innerHTML.replace(/.+class="/,'').replace(/".+/,''),
        "href" : 'https://www.wowprogress.com' + node.innerHTML.replace(/.+href="/,'').replace(/".+/,''),
    };
}
function makeGuildHtml(node) {
    return {
        "name" : node.text,
        "class" : node.innerHTML.replace(/.+class="/,'').replace(/".+/,''),
        "href" : 'https://www.wowprogress.com' + node.innerHTML.replace(/.+href="/,'').replace(/".+/,''),
    };
}
function logClient(req) {
    var fs = require('fs');
    fs.appendFile("logs/log",(req.headers["user-agent"] + " request = " + globalCounter++  + "\n "), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

module.exports = router;
