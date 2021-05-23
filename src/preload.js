const { promises: { readFile, writeFile } } = require('fs');
const { dialog } = require('electron');

window.aveDialog = function (data, options = {}) {
    // var options = {
    //     title: "Save file",
    //     defaultPath: "my_filename",
    //     buttonLabel: "Save",
    //     filters: [
    //         { name: 'txt', extensions: ['txt'] },
    //         { name: 'All Files', extensions: ['*'] }
    //     ]
    // };
    return dialog.showSaveDialog(null, options).then(({ filePath } = {}) => {
        return filePath && writeFile(filePath, data);
    });
};

window.openDialog = function (options = {}) {
    return showOpenDialog(options).then(({ filePath } = {}) => {
        return filePath && readFile(filePath);
    });
};
