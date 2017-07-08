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
            if (element.isPartial()) {
         text.setUnderline(element.getStartOffset(), element.getEndOffsetInclusive(), true);
       } else {
         text.setUnderline(true);
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
            if (element.isPartial()) {
         text.setForegroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#D10000');
       } else {
text.setForegroundColor('#D10000');       }
            
        }
    }
}

function operational() {
    var elements = getSelectedText();
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        if (element.getElement().editAsText) {
            var text = element.getElement().editAsText();
          if (element.isPartial()) {
         text.setBackgroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), '#00B1D1');
       } else {
text.setBackgroundColor('#00B1D1');       }
                 }
    }
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
