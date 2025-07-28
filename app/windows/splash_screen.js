const libtextmode = require("../libtextmode/libtextmode");
const electron = require("electron");
let konami_index = 0;
const konami_code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
const { send } = require("../senders");
const dev = require("electron-is-dev");
const ans_path = dev ? "./build/ans/" : `${process.resourcesPath}/ans/`;

function connect(event) {
    const server = document.getElementById("server").value;
    const pass = document.getElementById("pass").value;
    if (server != "") {
        update("server", server);
        update("pass", pass);
        electron.ipcRenderer.send("connect_to_server", { server, pass });
    }
}

function body_key_down(params) {
    if (event.code == konami_code[konami_index]) {
        konami_index += 1;
        if (konami_index == konami_code.length) {
            konami_index = 0;
            send("konami_code");
        }
    } else {
        konami_index = 0;
    }
}

function key_down(params) {
    if (event.code == "Enter" || event.code == "NumpadEnter") connect();
}

function update(key, value) {
    electron.ipcRenderer.send("update_prefs", { key, value });
}

document.addEventListener("DOMContentLoaded", () => {
    const preferences = document.getElementById("preferences");
    if (process.platform != "darwin") preferences.innerText = "Settings";
    document.getElementById("new_document").addEventListener("click", (event) => electron.ipcRenderer.send("new_document"));
    document.getElementById("open").addEventListener("click", (event) => electron.ipcRenderer.send("open"));
    document.getElementById("tutorial").addEventListener("click", (event) => electron.ipcRenderer.send("open_tutorial"));
    preferences.addEventListener("click", (event) => electron.ipcRenderer.send("preferences"));
    document.getElementById("connect").addEventListener("click", connect, true);
    document.body.addEventListener("keydown", body_key_down, true);
    document.getElementById("server").addEventListener("keydown", key_down, true);
    document.getElementById("pass").addEventListener("keydown", key_down, true);
    libtextmode.animate({ file: `${ans_path}splash_2025.xb`, ctx: document.getElementById("splash_terminal").getContext("2d") });
});

electron.ipcRenderer.on("saved_server", (event, { server, pass }) => {
    document.getElementById("server").value = server;
    document.getElementById("pass").value = pass;
});
