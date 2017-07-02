var switches = angular.module('switches', ['ngSwitchToggle']);
var mode;

var left;
var right;
var id = "";
function mouseDown(clicked_id) {
    id = clicked_id;
}

function mouseUp(clicked_id) {
    var i;
    right = clicked_id;
    if (id < right) {
        left = id;
    } else {
        left = right;
        right = id;
    }

    for (i = left; i <= right; i++) {
        if (mode === "temporal")
            document.getElementById(i.toString()).style.color = "blue";
        else if (mode === "deontic")
            document.getElementById(i.toString()).style.backgroundColor = "yellow";
        else
            document.getElementById(i.toString()).style.textDecoration = "underline";
    }

}

function undo() {
    var i;
    for (i = left; i <= right; i++) {
        if (mode === "temporal")
            document.getElementById(i.toString()).style.color = "black";
        else if (mode === "deontic")
            document.getElementById(i.toString()).style.backgroundColor = "transparent";
        else
            document.getElementById(i.toString()).style.textDecoration = "none";
    }
}

function save() {
    var text = document.getElementsByTagName('div')[2].outerHTML.toString();
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "example.html");
}

function one() {
    mode = "temporal";
}

function two() {
    mode = "deontic";
}

function three() {
    mode = "operational";
}

function load_home() {
    document.getElementById("content").innerHTML = '<object type="text/html" data="home.html" ></object>';
}

function startRead() {
    // obtain input element through DOM

    var file = document.getElementById('file').files[0];
    if (file) {
        getAsText(file);
    }
}

function getAsText(readFile) {
    var reader;
    try {
        reader = new FileReader();
    } catch (e) {
        document.getElementById('output').innerHTML =
            "Error: seems File API is not supported on your browser";
        return;
    }

    // Read file into memory as UTF-8
    reader.readAsText(readFile, "UTF-8");

    // Handle progress, success, and errors
    reader.onprogress = updateProgress;
    reader.onload = loaded;
    reader.onerror = errorHandler;
}

function updateProgress(evt) {
    if (evt.lengthComputable) {
        // evt.loaded and evt.total are ProgressEvent properties
        var loaded = (evt.loaded / evt.total);
        if (loaded < 1) {
            // Increase the prog bar length
            // style.width = (loaded * 200) + "px";
            document.getElementById("bar").style.width = (loaded * 100) + "%";
        }
    }
}

function loaded(evt) {
    // Obtain the read file data
    var fileString = evt.target.result;
    document.getElementById('output').innerHTML = fileString;
    document.getElementById("bar").style.width = 100 + "%";
}

function errorHandler(evt) {
    if (evt.target.error.code === evt.target.error.NOT_READABLE_ERR) {
        // The file could not be read
        document.getElementById('output').innerHTML = "Error reading file..."
    }
}