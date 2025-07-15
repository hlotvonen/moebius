const electron = require("electron");

function send(channel, opts) {
    electron.ipcRenderer.send(channel, {id: electron.remote.getCurrentWindow().getParentWindow().id, ...opts});
}

function ok() {
    // Confirm the warning
    send("close_modal");
}

function cancel() {
    send("close_modal");
    //electron.remote.getCurrentWindow().close();
}

document.addEventListener("keydown", (event) => {
    if (event.code == "Enter") {
        ok();
        //cancel();
    } else if (event.code == "Escape") {
        cancel();
    }
}, true);

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("cancel").addEventListener("click", event => cancel(), true);
}, true);

electron.ipcRenderer.on("cancel", (event) => cancel());

electron.ipcRenderer.on("get_warning_data", (event, {title, content}) => {
    document.getElementById("warning_title").textContent = title;
    document.getElementById("warning_content").textContent = content;
});