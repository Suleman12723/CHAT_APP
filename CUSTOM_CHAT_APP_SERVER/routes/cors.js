const express = require('express');
const cors = require('cors');
const app = express();



const whitelist  =['http://localhost:3000', 'http://localhost:19006',"ws://localhost:3000","https://mighty-fortress-54471.herokuapp.com"];

var corsOptionsDelegate = (req, callback)=>{
  var corsOptions;

  if(whitelist.indexOf(req.header('Origin')) !==-1){
    corsOptions = {origin: true};
  }
  else{
    corsOptions = {origin:false};
  }
  callback(null,corsOptions);

};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
