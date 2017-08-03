$(function () {


    $.FroalaEditor.DefineIcon('temporal', {NAME: 'star'});
    $.FroalaEditor.RegisterCommand('temporal', {
        title: 'Temporal',
        focus: true,
        undo: true,
        refreshAfterCallback: true,
        callback: function () {
            this.colors.background('#c7bd06');
        }
    });

    $.FroalaEditor.DefineIcon('deontic', {NAME: 'star'});
    $.FroalaEditor.RegisterCommand('deontic', {
        title: 'Deontic',
        focus: true,
        undo: true,
        refreshAfterCallback: true,
        callback: function () {
            this.commands.underline();

        }
    });

    $.FroalaEditor.DefineIcon('operational', {NAME: 'star'});
    $.FroalaEditor.RegisterCommand('operational', {
        title: 'Operational',
        focus: true,
        undo: true,
        refreshAfterCallback: true,
        callback: function () {
            this.colors.text('#c70037');
        }
    });

    $.FroalaEditor.DefineIcon('export', {NAME: 'star'});
    $.FroalaEditor.RegisterCommand('export', {
        title: 'Export',
        focus: true,
        undo: true,
        refreshAfterCallback: true,
        callback: function () {
            var string = this.html.get();
            save(string);
        }
    });

    $.FroalaEditor.DefineIcon('load', {NAME: 'star'});
    $.FroalaEditor.RegisterCommand('load', {
        title: 'Load',
        focus: true,
        undo: true,
        refreshAfterCallback: true,
        callback: function () {
            this.html.set(gs);
        }
    });

    $('#edit').froalaEditor({
        toolbarButtons: ['undo', 'redo', 'operational', 'temporal', 'deontic', '|', 'load', 'export', 'html']
    })
});

var gs = "string";

function save(s) {
    s = s.replace("<u>", "<deontic>");
    s = s.replace("</u>", "</deontic>");
    s = s.replace("<span style=\"color: rgb(199, 0, 55);\">", "<operational>");
    s = s.replace("<span style=\"background-color: rgb(199, 189, 6);\">", "<temporal>");
    var text = s;
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "download.txt");
}

var saveAs = saveAs || (function (view) {
        "use strict";
        // IE <10 is explicitly unsupported
        if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }
        var
            doc = view.document
            // only get URL when necessary in case Blob.js hasn't overridden it yet
            , get_URL = function () {
                return view.URL || view.webkitURL || view;
            }
            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
            , can_use_save_link = "download" in save_link
            , click = function (node) {
                var event = new MouseEvent("click");
                node.dispatchEvent(event);
            }
            , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
            , is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent)
            , throw_outside = function (ex) {
                (view.setImmediate || view.setTimeout)(function () {
                    throw ex;
                }, 0);
            }
            , force_saveable_type = "application/octet-stream"
            // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
            , arbitrary_revoke_timeout = 1000 * 40 // in ms
            , revoke = function (file) {
                var revoker = function () {
                    if (typeof file === "string") { // file is an object URL
                        get_URL().revokeObjectURL(file);
                    } else { // file is a File
                        file.remove();
                    }
                };
                setTimeout(revoker, arbitrary_revoke_timeout);
            }
            , dispatch = function (filesaver, event_types, event) {
                event_types = [].concat(event_types);
                var i = event_types.length;
                while (i--) {
                    var listener = filesaver["on" + event_types[i]];
                    if (typeof listener === "function") {
                        try {
                            listener.call(filesaver, event || filesaver);
                        } catch (ex) {
                            throw_outside(ex);
                        }
                    }
                }
            }
            , auto_bom = function (blob) {
                // prepend BOM for UTF-8 XML and text/* types (including HTML)
                // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
                if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                    return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
                }
                return blob;
            }
            , FileSaver = function (blob, name, no_auto_bom) {
                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                // First try a.download, then web filesystem, then object URLs
                var
                    filesaver = this
                    , type = blob.type
                    , force = type === force_saveable_type
                    , object_url
                    , dispatch_all = function () {
                        dispatch(filesaver, "writestart progress write writeend".split(" "));
                    }
                    // on any filesys errors revert to saving with object URLs
                    , fs_error = function () {
                        if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                            // Safari doesn't allow downloading of blob urls
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                                var popup = view.open(url, '_blank');
                                if (!popup) view.location.href = url;
                                url = undefined; // release reference before dispatching
                                filesaver.readyState = filesaver.DONE;
                                dispatch_all();
                            };
                            reader.readAsDataURL(blob);
                            filesaver.readyState = filesaver.INIT;
                            return;
                        }
                        // don't create more object URLs than needed
                        if (!object_url) {
                            object_url = get_URL().createObjectURL(blob);
                        }
                        if (force) {
                            view.location.href = object_url;
                        } else {
                            var opened = view.open(object_url, "_blank");
                            if (!opened) {
                                // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                                view.location.href = object_url;
                            }
                        }
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                        revoke(object_url);
                    }
                ;
                filesaver.readyState = filesaver.INIT;

                if (can_use_save_link) {
                    object_url = get_URL().createObjectURL(blob);
                    setTimeout(function () {
                        save_link.href = object_url;
                        save_link.download = name;
                        click(save_link);
                        dispatch_all();
                        revoke(object_url);
                        filesaver.readyState = filesaver.DONE;
                    });
                    return;
                }

                fs_error();
            }
            , FS_proto = FileSaver.prototype
            , saveAs = function (blob, name, no_auto_bom) {
                return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
            }
        ;
        // IE 10+ (native saveAs)
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            return function (blob, name, no_auto_bom) {
                name = name || blob.name || "download";

                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                return navigator.msSaveOrOpenBlob(blob, name);
            };
        }

        FS_proto.abort = function () {
        };
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;

        FS_proto.error =
            FS_proto.onwritestart =
                FS_proto.onprogress =
                    FS_proto.onwrite =
                        FS_proto.onabort =
                            FS_proto.onerror =
                                FS_proto.onwriteend =
                                    null;

        return saveAs;
    }(
        typeof self !== "undefined" && self
        || typeof window !== "undefined" && window
        || this.content
    ));


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
    gs = evt.target.result;
    gs = gs.replace("<deontic>", "<u>");
    gs = gs.replace("</deontic>", "</u>");
    gs = gs.replace("<operational>", "<span style=\"color: rgb(199, 0, 55);\">");
    gs = gs.replace("<temporal>", "<span style=\"background-color: rgb(199, 189, 6);\">");
    gs = gs.replace("</operational>", "</span>");
    gs = gs.replace("</temperal>", "</span>");
}

function errorHandler(evt) {
    if (evt.target.error.code === evt.target.error.NOT_READABLE_ERR) {
        // The file could not be read
        document.getElementById('output').innerHTML = "Error reading file..."
    }
}