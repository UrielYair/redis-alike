const code = document.getElementById("code");
const parseOutput = document.getElementById("parseOutput");
const runButton = document.getElementById("runButton");
const log = document.getElementById("log");

code.addEventListener('input', parseCode);
runButton.addEventListener("click",run);
code.addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    runButton.click();
});


const MyRedis = require('../Models/MyRedis');
var db = new MyRedis(); 
var peg = require("pegjs");
var myParser = parserInit();

function parserInit(){
    try {
        return peg.generate(grammar);;
    } catch (error) {
        console.log(error);
    }
}

function parseCode() {
    try {
        let parseResult = myParser.parse(code.value);
        parseOutput.value = JSON.stringify(parseResult, null, 4);
    } catch (error) {
        parseOutput.value = "Line: " + error["location"]["start"]["line"] +", column: " + error["location"]["start"]["column"] + ": " + error.message;
    }
}

function run() {
    try {
        let parseResult = myParser.parse(code.value);
        const functionMapper = {
            'GET'       : function() { return db.get(parseResult['key']); },
            'SET'       : function() { return db.set(parseResult['key'], parseResult['value']); },
            'KEYS'      : function() { return db.keys(parseResult['pattern']); },
            'EXPIRE'    : function() { return db.expire(parseResult['key'], parseResult['seconds']);},
            'EXIST'     : function() { return db.exist(parseResult['values']); },
            'DEL'       : function() { return db.del(parseResult['values']); },
            'SHOW'      : function() { return JSON.stringify(db.db, null, 4); }
        };
        appendToLog(functionMapper[parseResult['command']]());
    } catch (error) {
        appendToLog("Line: " + error["location"]["start"]["line"] +", column: " + error["location"]["start"]["column"] + ": " + error.message);
    }
}

function appendToLog(text) {
    document.getElementById("log").value += (text + '\r\n');
}

