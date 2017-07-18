/**
 * Created by wumengyang on 06/07/2017.
 */

function onOpen(e) {
    DocumentApp.getUi().createMenu('Contract Highlight')
        .addItem('Show sidebar', 'showSidebar')
        .addToUi();
}

function showSidebar() {
    var html = HtmlService.createHtmlOutputFromFile('Sidebar')
        .setTitle('My custom sidebar')
        .setWidth(300);
    DocumentApp.getUi() // Or DocumentApp or FormApp.
        .showSidebar(html);
}

function onInstall(e) {
    onOpen(e);
}


function getSelectedText() {
    var selection = DocumentApp.getActiveDocument().getSelection();
    if (selection) {
        return selection.getRangeElements();
    }
}

function temporal() {
    var elements = getSelectedText();
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        if (element.getElement().editAsText) {
            var text = element.getElement().editAsText();
            var f = true;
            for (var j = element.getStartOffset(); j <= element.getEndOffsetInclusive(); j++)
                f = f && (text.isUnderline(j));
            if (f) {
                text.setUnderline(element.getStartOffset(), element.getEndOffsetInclusive(), false);
                continue;
            }
            if (element.isPartial()) {
                text.setUnderline(element.getStartOffset(), element.getEndOffsetInclusive(), true);
            } else {
                text.setUnderline(true);
            }
        }
    }
}

function operational() {
    var elements = getSelectedText();
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        if (element.getElement().editAsText) {
            var text = element.getElement().editAsText();
            var f = true;
            for (var j = element.getStartOffset(); j <= element.getEndOffsetInclusive(); j++)
                f = f && (text.getBackgroundColor(j) === '#00b1d1');
            if (f) {
                text.setBackgroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#ffffff');
                continue;
            }
            if (element.isPartial()) {
                text.setBackgroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#00B1D1');
            } else {
                text.setBackgroundColor('#00B1D1');
            }
        }
    }
}

function deontic() {
    var elements = getSelectedText();
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.getElement().editAsText) {
            var text = element.getElement().editAsText();
            var f = true;
            for (var j = element.getStartOffset(); j <= element.getEndOffsetInclusive(); j++)
                f = f && (text.getForegroundColor(j) === '#d10000');
            if (f) {
                text.setForegroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#000000');
                continue;
            }
            if (element.isPartial()) {
                text.setForegroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#D10000');
            } else {
                text.setForegroundColor('#D10000');
            }

        }
    }
}


// Auto detection of the regular expressions in the text range.
function auto() {
    autoReg("[0-1][0-9][\/|\-][0-1][0-9][\/|\-][1-2][0-9][0-9][0-9]", 'temporal');
    autoReg("Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec", 'temporal');
    autoReg("[0-3][0-9]", 'temporal');
    autoReg("[0-2][0-3]:[0-5][0-9]", 'temporal');
    autoReg("until", 'temporal');
    autoReg("before", 'temporal');
    autoReg("from", 'temporal');
    autoReg("due", 'temporal');
    autoReg("[0-1]*[1-9] AM", 'temporal');
    autoReg("[0-1]*[1-9] PM", 'temporal');
}

function autoReg(regex, option) {
    var page = DocumentApp.getActiveDocument().getBody().editAsText();
    var element = page.findText(regex);
    while (element != null) {
        if (element.getElement().editAsText()) {
            var text = element.getElement().editAsText();
            if (option === 'temporal')
                text.setUnderline(element.getStartOffset(), element.getEndOffsetInclusive(), true);
            else if (option === 'deontic')
                text.setForegroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#D10000');
            else if (option === 'operational')
                text.setBackgroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#00B1D1');
        }
        element = page.findText(regex, element);
    }
}

function count() {
    var body = DocumentApp.getActiveDocument().getBody();
    var s = body.getText();
    var l = s.length;
    var fo = false; // background
    var ft = false; // underline
    var fd = false; // foreground
    var text = body.editAsText().copy();
    var i = 0;
    var ct = 0;
    var cd = 0;
    var co = 0;
    while (i < l) {
        if (text.isUnderline(i) && !ft) {
            ft = true;
            ct++;
        }
        if (!text.isUnderline(i) && ft) {
            ft = false;
        }
        if (text.getBackgroundColor(i) === '#00b1d1' && !fo) {
            fo = true;
            co++;
        }
        if (text.getBackgroundColor(i) != '#00b1d1' && fo) {
            fo = false;
        }

        if (text.getForegroundColor(i) === '#d10000' && !fd) {
            cd++;
            fd = true;
        }
        if (text.getForegroundColor(i) != '#d10000' && fd) {
            fd = false;
        }
        i++;
    }
    showAlert(co, cd, ct);
}

function showAlert(o, d, t) {
    var ui = DocumentApp.getUi(); // Same variations.
    var s = 'obligations:' + d + '\n   times:' + t + '\n   actions:' + o;
    ui.alert(s, ui.ButtonSet.OK);
}

function alert(s) {
    var ui = DocumentApp.getUi();
    ui.alert(s);
}

function save() {
    var body = DocumentApp.getActiveDocument().getBody();
    var s = body.getText();
    var l = s.length;
    var fo = false; // background
    var ft = false; // underline
    var fd = false; // foreground
    var text = body.editAsText().copy();
    var i = 0;
    while (i < l) {
        if (text.isUnderline(i) && !ft) {
            text.insertText(i, "<temporal>");
            ft = true;
            i += 10;
        }
        if (!text.isUnderline(i) && ft) {
            text.insertText(i, "</temporal>");
            i += 11;
            ft = false;
        }
        // if (text.getForegroundColor(i) != null)
        //  s = text.getForegroundColor(i);
        if (text.getBackgroundColor(i) === '#00b1d1' && !fo) {
            text.insertText(i, "<operational>");
            fo = true;
            i += 13;
        }
        if (text.getBackgroundColor(i) != '#00b1d1' && fo) {
            text.insertText(i, "</operational>");
            fo = false;
            i += 14;
        }

        if (text.getForegroundColor(i) === '#d10000' && !fd) {
            text.insertText(i, "<deontic>");
            fd = true;
            i += 9;
        }
        if (text.getForegroundColor(i) != '#d10000' && fd) {
            text.insertText(i, "</deontic>");
            fd = false;
            i += 10;
        }
        i++;
    }
    doc = DocumentApp.create("Format Code");
    doc.getBody().appendParagraph(text.getText());
    //body.appendParagraph(s);
}


function addTemporal() {
    var ui = DocumentApp.getUi(); // Same variations.

    var result = ui.prompt(
        'Add a new word as an temporal!',
        'Please enter the new word:',
        ui.ButtonSet.OK_CANCEL);

    // Process the user's response.
    var button = result.getSelectedButton();
    var text = result.getResponseText();
    if (button == ui.Button.OK) {
        // User clicked "OK".
        writeOneRecord(text.toString(), 'temporal');
        ui.alert('Done!');
    } else if (button == ui.Button.CANCEL) {
        // User clicked "Cancel".
    } else if (button == ui.Button.CLOSE) {
        // User clicked X in the title bar.
    }
}


// Replace the variables in this block with real values.
var address = '35.188.12.153';
var rootPwd = 'Wmy19951028';
var user = 'wumengyangok';
var userPwd = 'Wmy19951028';
var db = 'dictionary';

var root = 'root';
var instanceUrl = 'jdbc:mysql://' + address;
var dbUrl = instanceUrl + '/' + db;

// Create a new database within a Cloud SQL instance.
function createDatabase() {
    var conn = Jdbc.getConnection(instanceUrl, root, rootPwd);
    conn.createStatement().execute('CREATE DATABASE ' + db);
}

// Create a new user for your database with full privileges.
function createUser() {
    var conn = Jdbc.getConnection(dbUrl, root, rootPwd);

    var stmt = conn.prepareStatement('CREATE USER ? IDENTIFIED BY ?');
    stmt.setString(1, user);
    stmt.setString(2, userPwd);
    stmt.execute();

    conn.createStatement().execute('GRANT ALL ON `%`.* TO ' + user);
}

// Create a new table in the database.
function createTable() {
    var conn = Jdbc.getConnection(dbUrl, user, userPwd);
    conn.createStatement().execute('CREATE TABLE entries '
        + '(word VARCHAR(255), discription VARCHAR(255), '
        + 'entryID INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(entryID));');
}


// Write one row of data to a table.
function writeOneRecord(word, type) {
    var conn = Jdbc.getConnection(dbUrl, user, userPwd);

    var stmt = conn.prepareStatement('INSERT INTO entries '
        + '(word, discription) values (?, ?)');
    stmt.setString(1, word);
    stmt.setString(2, type);
    stmt.execute();
}

// Delete one row of data from a table.
function deleteOneRecord(word){
    var conn = Jdbc.getConnection(dbUrl, user, userPwd);

    var stmt = conn.prepareStatement('DELETE FROM entries WHERE word=?');
    stmt.setString(1, word);
    stmt.execute();
}

// Write 500 rows of data to a table in a single batch.
function writeManyRecords() {
    var conn = Jdbc.getConnection(dbUrl, user, userPwd);
    conn.setAutoCommit(false);

    var start = new Date();
    var stmt = conn.prepareStatement('INSERT INTO entries '
        + '(guestName, content) values (?, ?)');
    for (var i = 0; i < 500; i++) {
        stmt.setString(1, 'Name ' + i);
        stmt.setString(2, 'Hello, world ' + i);
        stmt.addBatch();
    }

    var batch = stmt.executeBatch();
    conn.commit();
    conn.close();

    var end = new Date();
    Logger.log('Time elapsed: %sms for %s rows.', end - start, batch.length);
}


function readFromTable() {
    var conn = Jdbc.getConnection(dbUrl, user, userPwd);

    var start = new Date();
    var stmt = conn.createStatement();
    stmt.setMaxRows(1000);
    var results = stmt.executeQuery('SELECT * FROM entries');
    var numCols = results.getMetaData().getColumnCount();

    while (results.next()) {
        var rowString = '';
        for (var col = 0; col < numCols; col++) {
            rowString += results.getString(col + 1) + '\t';
        }
        Logger.log(rowString)
    }

    results.close();
    stmt.close();

    var end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
}

function getDictionary() {
    var conn = Jdbc.getConnection(dbUrl, user, userPwd);
    var start = new Date();
    var stmt = conn.createStatement();
    stmt.setMaxRows(1000);
    var results = stmt.executeQuery('SELECT * FROM entries');
    var numCols = results.getMetaData().getColumnCount();
    var rowString = '';
    while (results.next()) {
        for (var col = 0; col < numCols; col++) {
            rowString += results.getString(col + 1) + ',';
        }
        rowString += '/';
    }
    results.close();
    stmt.close();
    //alert(rowString);
    return rowString;
    var end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
}

// Read up to 1000 rows of data from the table and log them.
function autoByDict() {
    var conn = Jdbc.getConnection(dbUrl, user, userPwd);

    var start = new Date();
    var stmt = conn.createStatement();
    stmt.setMaxRows(1000);
    var results = stmt.executeQuery('SELECT * FROM entries');
    var numCols = results.getMetaData().getColumnCount();

    while (results.next()) {

        autoReg(results.getString(1), results.getString(2));
        //Logger.log(rowString)
    }

    results.close();
    stmt.close();

    var end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
}

function testDictionary() {
    var html = HtmlService.createHtmlOutputFromFile('Dictionary')
        .setWidth(400)
        .setHeight(100);
    DocumentApp.getUi() // Or DocumentApp or FormApp.
        .showModalDialog(html, 'My dictionary');
}

function showAddWord() {
    var html = HtmlService.createHtmlOutputFromFile('AddWord')
        .setWidth(400)
        .setHeight(100);
    DocumentApp.getUi() // Or DocumentApp or FormApp.
        .showModalDialog(html, 'Add new word');
}

