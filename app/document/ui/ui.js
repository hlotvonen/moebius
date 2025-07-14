const electron = require("electron");
const { on, send, send_sync, open_box } = require("../../senders");
const doc = require("../doc");
const palette = require("../palette");
const keyboard = require("../input/keyboard");
const events = require("events");
let interval, guide_columns, guide_rows;
let canvas_zoom_toggled = false;

function $(name) {
    return document.getElementById(name);
}

function set_var(name, value) {
    document.documentElement.style.setProperty(`--${name}`, value);
}

function set_var_px(name, value) {
    set_var(name, `${value}px`);
}

function open_reference_image() {
    const files = open_box({ filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }] });
    if (files) {
        $("reference_image").style.backgroundImage = `url(${electron.nativeImage.createFromPath(files[0]).toDataURL()})`;
        $("reference_image").style.opacity = 0.4;
        send("enable_reference_image");
    }
}

function toggle_reference_image(visible) {
    $("reference_image").style.opacity = visible ? 0.4 : 0.0;
}

function clear_reference_image() {
    $("reference_image").style.removeProperty("background-image");
    send("disable_clear_reference_image");
}

on("open_reference_image", (event) => open_reference_image());
on("toggle_reference_image", (event, visible) => toggle_reference_image(visible));
on("clear_reference_image", (event) => clear_reference_image());

function set_text(name, text) {
    $(name).textContent = text;
}


function toggle_smallscale_guide(visible) {
    send("uncheck_all_guides");
    if (visible) {
        guide_columns = 80;
        guide_rows = 25;
        rescale_guide();
        $("guide").classList.remove("hidden");
        $("drawing_grid").classList.add("hidden");
        send("check_smallscale_guide");
    } else {
        $("guide").classList.add("hidden");
    }
}

function toggle_square_guide(visible) {
    send("uncheck_all_guides");
    if (visible) {
        guide_columns = 80;
        guide_rows = 40;
        rescale_guide();
        $("guide").classList.remove("hidden");
        $("drawing_grid").classList.add("hidden");
        send("check_square_guide");
    } else {
        $("guide").classList.add("hidden");
    }
}

function toggle_instagram_guide(visible) {
    send("uncheck_all_guides");
    if (visible) {
        guide_columns = 80;
        guide_rows = 50;
        rescale_guide();
        $("guide").classList.remove("hidden");
        $("drawing_grid").classList.add("hidden");
        send("check_instagram_guide");
    } else {
        $("guide").classList.add("hidden");
    }
}

function toggle_file_id_guide(visible) {
    send("uncheck_all_guides");
    if (visible) {
        guide_columns = 44;
        guide_rows = 22;
        rescale_guide();
        $("guide").classList.remove("hidden");
        $("drawing_grid").classList.add("hidden");
        send("check_file_id_guide");
    } else {
        $("guide").classList.add("hidden");
    }
}

function toggle_petscii_guide(visible) {
    send("uncheck_all_guides");
    if (visible) {
        guide_columns = 40;
        guide_rows = 25;
        rescale_guide();
        $("guide").classList.remove("hidden");
        $("drawing_grid").classList.add("hidden");
        send("check_petscii_guide");
    } else {
        $("guide").classList.add("hidden");
    }
}

function rescale_guide() {
    $("guide").style.width = `${doc.render.font.width * Math.min(doc.columns, guide_columns)}px`;
    $("guide").style.height = `${doc.render.font.height * Math.min(doc.rows, guide_rows)}px`;
    if (doc.columns >= guide_columns) {
        $("guide").classList.add("guide_column");
    } else {
        $("guide").classList.remove("guide_column");
    }
    if (doc.rows >= guide_rows) {
        $("guide").classList.add("guide_row");
    } else {
        $("guide").classList.remove("guide_row");
    }
}

function toggle_drawinggrid(visible, columns) {
    $("guide").classList.add("hidden");
    send("uncheck_all_guides");
    if (visible) {
        rescale_drawinggrid(columns);
        $("drawing_grid").classList.remove("hidden");
        if (columns == 1) {
            send("check_drawinggrid_1x1");
        } else {
            send("check_drawinggrid_" + columns + "x" + (columns / 2));
        }
    } else {
        $("drawing_grid").classList.add("hidden");
    }
}

function rescale_drawinggrid(columns) {
    if (columns > 1) {
        rows = Math.floor(columns / 2);
    } else {
        rows = 1;
    }
    width = doc.render.font.width * doc.columns;
    height = doc.render.font.height * doc.rows;
    $("drawing_grid").innerHTML = '';
    c = doc.render.font.width * columns;
    while (c < width) {
        var div = document.createElement('div');
        div.style.width = c + 'px';
        div.classList.add("column");
        $("drawing_grid").appendChild(div);
        c += doc.render.font.width * columns;
    }
    r = doc.render.font.height * rows;
    while (r < height) {
        var div = document.createElement('div');
        div.style.height = r + 'px';
        div.classList.add("row");
        $("drawing_grid").appendChild(div);
        r += doc.render.font.height * rows;
    }
}

on("toggle_smallscale_guide", (event, visible) => toggle_smallscale_guide(visible));
on("toggle_square_guide", (event, visible) => toggle_square_guide(visible));
on("toggle_instagram_guide", (event, visible) => toggle_instagram_guide(visible));
on("toggle_file_id_guide", (event, visible) => toggle_file_id_guide(visible));
on("toggle_petscii_guide", (event, visible) => toggle_petscii_guide(visible));
on("toggle_drawinggrid", (event, visible, columns) => toggle_drawinggrid(visible, columns));

doc.on("render", () => rescale_guide());

class StatusBar {
    status_bar_info(columns, rows, code='') {
        set_text("columns", `${columns}`);
        set_text("rows", `${rows}`);
        set_text("columns_s", (columns > 1) ? "s" : "");
        set_text("rows_s", (rows > 1) ? "s" : "");
        set_text("ascii_value", code.code);
    }

    use_canvas_size_for_status_bar() {
        this.status_bar_info(doc.columns, doc.rows);
    }

    set_cursor_position(x, y) {
        set_text("cursor_x", `${x + 1}`);
        set_text("cursor_y", `${y + 1}`);
        set_text("ascii_value", doc.at(x, y).code);
    }

    hide_cursor_position() {
        $("cursor_position").style.opacity = 0;
    }

    show_cursor_position() {
        $("cursor_position").style.opacity = 1;
    }

    constructor() {
        doc.on("render", () => this.use_canvas_size_for_status_bar());
    }
}


function show_statusbar(visible) {
    set_var("statusbar-height", visible ? "22px" : "0px");
}

function show_preview(visible) {
    set_var("preview-width", visible ? "1px" : "300px");
}

function use_pixel_aliasing(value) {
    set_var("scaling-type", value ? "high-quality" : "pixelated");
}

function hide_scrollbars(value) {
    set_var("scrollbar-width", value ? "0px" : "8px");
    set_var("scrollbar-height", value ? "0px" : "8px");
}

function show_charlist(visible) {
    set_var("charlist-width", visible ? "128px" : "1px");
}

function current_zoom_factor() {
    return parseFloat(electron.remote.getCurrentWebContents().zoomFactor.toFixed(1));
}

function set_zoom(factor) {
    const zoom_element = $("zoom");
    electron.remote.getCurrentWebContents().zoomFactor = factor;
    zoom_element.textContent = `${Math.ceil(factor * 10) * 10}%`;
    zoom_element.classList.remove("fade");
    document.body.removeChild(zoom_element);
    document.body.appendChild(zoom_element);
    zoom_element.classList.add("fade");
    send("update_menu_checkboxes", { actual_size: (electron.remote.getCurrentWebContents().zoomFactor == 1) });
}

function zoom_in() {
    set_zoom(Math.min(current_zoom_factor() + 0.1, 3.0));
}

function zoom_out() {
    if (current_zoom_factor() >= 1.001) {
        set_zoom(Math.max(current_zoom_factor() - 0.1, 0.4));
    }
}

function actual_size() {
    set_zoom(1.0);
}

function canvas_zoom_toggle() {
    canvas_zoom_toggled = !canvas_zoom_toggled;
    if (canvas_zoom_toggled) {
        $("canvas_container").classList.add("canvas_zoom");
    } else {
        $("canvas_container").classList.remove("canvas_zoom");
    }
    send("update_menu_checkboxes", { canvas_zoom_toggle: canvas_zoom_toggled });
}

function ice_colors(value) {
    if (!value) {
        let vis_toggle = false;
        $("ice_color_container").style.display = "none";
        $("blink_off_container").style.removeProperty("display");
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            if (vis_toggle) {
                $("blink_on_container").style.display = "none";
                $("blink_off_container").style.removeProperty("display");
            } else {
                $("blink_off_container").style.display = "none";
                $("blink_on_container").style.removeProperty("display");
            }
            vis_toggle = !vis_toggle;
        }, 300);
        set_text("ice_colors", "Off");
    } else {
        if (interval) clearInterval(interval);
        $("ice_color_container").style.removeProperty("display");
        $("blink_off_container").style.display = "none";
        $("blink_on_container").style.display = "none";
        set_text("ice_colors", "On");
    }
    send("update_menu_checkboxes", { ice_colors: value });
}

function use_9px_font(value) {
    set_text("use_9px_font", value ? "On" : "Off");
    send("update_menu_checkboxes", { use_9px_font: value });
}

function change_font(font_name) {
    set_text("font_name", font_name);
    send("update_menu_checkboxes", { font_name });
}

function insert_mode(value) {
    set_text("insert_mode", value ? "Ins" : "");
    keyboard.overwrite_mode = false;
    send("update_menu_checkboxes", { insert_mode: value, overwrite_mode: false });
}

function overwrite_mode(value) {
    set_text("insert_mode", value ? "Over" : "");
    keyboard.insert_mode = false;
    send("update_menu_checkboxes", { overwrite_mode: value, insert_mode: false });
}

function q_key_insert(value) {
    keyboard.q_key_insert = value;
    send("update_menu_checkboxes", { q_key_insert: value });
}

doc.on("new_document", () => {
    ice_colors(doc.ice_colors);
    use_9px_font(doc.use_9px_font);
    change_font(doc.font_name);
});
doc.on("ice_colors", (value) => ice_colors(value));
doc.on("use_9px_font", (value) => use_9px_font(value));
doc.on("change_font", (font_name) => change_font(font_name));
keyboard.on("insert", (value) => insert_mode(value));
on("insert_mode", (event, value) => insert_mode(value));
on("overwrite_mode", (event, value) => overwrite_mode(value));
on("q_key_insert", (event, value) => q_key_insert(value));

on("show_statusbar", (event, visible) => show_statusbar(visible));
on("show_preview", (event, visible) => show_preview(visible));
on("show_charlist", (event, visible) => show_charlist(visible));
on("use_pixel_aliasing", (event, value) => use_pixel_aliasing(value));
on("hide_scrollbars", (event, value) => hide_scrollbars(value));
on("zoom_in", (event) => zoom_in());
on("canvas_zoom_toggle", (event) => canvas_zoom_toggle());
on("zoom_out", (event) => zoom_out());
on("actual_size", (event) => actual_size());

document.addEventListener("DOMContentLoaded", (event) => {
    $("use_9px_font_toggle").addEventListener("mousedown", (event) => doc.use_9px_font = !doc.use_9px_font, true);
    $("ice_colors_toggle").addEventListener("mousedown", (event) => doc.ice_colors = !doc.ice_colors, true);
}, true);

class Tools extends events.EventEmitter {
    get_tool_div(mode) {
        switch (mode) {
            case this.modes.SELECT: return $("select_mode");
            case this.modes.BRUSH: return $("brush_mode");
            case this.modes.SHIFTER: return $("shifter_mode");
            case this.modes.LINE: return $("line_mode");
            case this.modes.RECTANGLE_OUTLINE: return $("rectangle_mode");
            case this.modes.RECTANGLE_FILLED: return $("rectangle_mode");
            case this.modes.ELLIPSE_OUTLINE: return $("ellipse_mode");
            case this.modes.ELLIPSE_FILLED: return $("ellipse_mode");
            case this.modes.FILL: return $("fill_mode");
            case this.modes.SAMPLE: return $("sample_mode");
        }
    }

    start(new_mode) {
        if (new_mode == this.mode) return;
        if (this.mode != undefined) {
            $("brush_size_chooser").classList.remove("ghosted");
            const div = this.get_tool_div(this.mode);
            div.classList.remove("selected");
            switch (this.mode) {
                case this.modes.RECTANGLE_OUTLINE:
                case this.modes.ELLIPSE_OUTLINE:
                    div.classList.remove("outline");
                    break;
                case this.modes.RECTANGLE_FILLED:
                case this.modes.ELLIPSE_FILLED:
                    div.classList.remove("filled");
                    break;
            }
        }
        this.previous_mode = this.mode;
        this.mode = new_mode;
        const div = this.get_tool_div(this.mode);
        div.classList.add("selected");
        switch (this.mode) {
            case this.modes.RECTANGLE_OUTLINE:
            case this.modes.ELLIPSE_OUTLINE:
                div.classList.add("outline");
                $("brush_size_chooser").classList.add("ghosted");
                break;
            case this.modes.RECTANGLE_FILLED:
            case this.modes.ELLIPSE_FILLED:
                div.classList.add("filled");
                $("brush_size_chooser").classList.add("ghosted");
                break;
            case this.modes.LINE:
                $("brush_size_chooser").classList.add("ghosted");
                break;
        }
        this.emit("start", this.mode);
    }

    change_to_previous_mode() {
        if (this.previous_mode != undefined) this.start(this.previous_mode);
    }


    constructor() {
        super();
        this.modes = { SELECT: 0, BRUSH: 1, SHIFTER: 2, LINE: 3, RECTANGLE_OUTLINE: 4, RECTANGLE_FILLED: 5, ELLIPSE_OUTLINE: 6, ELLIPSE_FILLED: 7, FILL: 8, SAMPLE: 9 };
        on("change_to_select_mode", (event) => this.start(this.modes.SELECT));
        on("change_to_brush_mode", (event) => this.start(this.modes.BRUSH));
        on("change_to_shifter_mode", (event) => this.start(this.modes.SHIFTER));
        on("change_to_fill_mode", (event) => this.start(this.modes.FILL));
        document.addEventListener("DOMContentLoaded", (event) => {
            $("select_mode").addEventListener("mousedown", (event) => this.start(this.modes.SELECT), true);
            $("brush_mode").addEventListener("mousedown", (event) => this.start(this.modes.BRUSH), true);
            $("shifter_mode").addEventListener("mousedown", (event) => this.start(this.modes.SHIFTER), true);
            $("line_mode").addEventListener("mousedown", (event) => this.start(this.modes.LINE), true);
            $("rectangle_mode").addEventListener("mousedown", (event) => {
                const rect = $("rectangle_mode").getBoundingClientRect();
                if (Math.floor(event.clientX - rect.left) < 24) {
                    this.start(this.modes.RECTANGLE_OUTLINE);
                } else {
                    this.start(this.modes.RECTANGLE_FILLED);
                }
            }, true);
            $("ellipse_mode").addEventListener("mousedown", (event) => {
                const rect = $("ellipse_mode").getBoundingClientRect();
                if (Math.floor(event.clientX - rect.left) < 24) {
                    this.start(this.modes.ELLIPSE_OUTLINE);
                } else {
                    this.start(this.modes.ELLIPSE_FILLED);
                }
            }, true);
            $("fill_mode").addEventListener("mousedown", (event) => this.start(this.modes.FILL), true);
            $("sample_mode").addEventListener("mousedown", (event) => this.start(this.modes.SAMPLE), true);
        });
    }
}

class Toolbar extends events.EventEmitter {
    set_color(name, index, font) {
        const canvas = document.getElementById(name);
        const ctx = canvas.getContext("2d");
        const rgb = font.get_rgb(index);
        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    draw_charlist() {
        const font = doc.font;
        const { fg, bg } = palette;
        const canvas = document.createElement("canvas");
        const charlist = document.getElementById("charlist");
        canvas.width = font.width * 16;
        canvas.height = font.height * 16;
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;
        if (charlist.contains(charlist.getElementsByTagName('canvas')[0])) {
            charlist.removeChild(charlist.getElementsByTagName('canvas')[0]);
        }
        charlist.appendChild(canvas);
        canvas.addEventListener("mousedown", (event) => {
            const rect = event.target.getBoundingClientRect();
            this.charlist_x = event.clientX - rect.left;
            this.charlist_y = event.clientY - rect.top;
            this.char_index = Math.floor(this.charlist_y / font.height) * 16 + Math.floor(this.charlist_x / 8);
            this.draw_charlist_cursor(this.char_index);
            this.custom_block_index = this.char_index;
            this.draw_custom_block();
        }, true);
        const ctx = canvas.getContext("2d");
        for (let y = 0, code = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++, code++) {
                font.draw(ctx, { code, fg, bg }, x * 8, y * font.height);
            }
        }
    }

    draw_charlist_cursor(index) {
        const font = doc.font;
        let selector = document.getElementById("charlist_selector");
        selector.style.top = `${Math.floor(this.char_index / 16) * font.height}px`;
        selector.style.left = `${(this.char_index % 16) * 8}px`;
        selector.style.height = `${font.height}px`;
        this.custom_block_index = this.char_index;
        this.draw_custom_block();
        this.draw_fkeys();
    }

    redraw_charlist() {
        if (!doc.render) return;
        this.draw_charlist();
    }

    move_charlist(direction) {
        if (direction == "up") {
            if (this.char_index > 15) { this.char_index -= 16; }
        }
        else if (direction == "right") {
            if ((this.char_index + 1) % 16 != 0 && this.char_index < 256) { this.char_index += 1; }
        }
        else if (direction == "down") {
            if (this.char_index < 240) { this.char_index += 16; }
        }
        else if (direction == "left") {
            if (this.char_index % 16 != 0 && this.char_index > 0) { this.char_index -= 1; }
        }
        else {
            this.char_index = 0;
        }
        this.draw_charlist_cursor(this.char_index)
    }

    insert_charlist_selection() {
        keyboard.emit("key_typed", this.char_index);
    }

    draw_fkeys() {
        // stop the character palette from mapping the function keys
        return
        for (let i = 0; i < 12; i++) {
            let num = i;
            const fkey_index = this.fkey_index;
            let code = this.char_index + i;
            this.draw_fkey(`f${i + 1}`, this.char_index + i);
            send("set_fkey", { num, fkey_index, code });
        }
    }

    draw_fkey(name, code) {
        const font = doc.font;
        const { fg, bg } = palette;
        const canvas = $(name);
        canvas.width = font.width;
        canvas.height = font.height;
        canvas.style.width = `${font.width * 2}px`;
        canvas.style.height = `${font.height * 2}px`;
        canvas.style.margin = `${(48 - font.height * 2 - 2) / 2}px`;
        const ctx = canvas.getContext("2d");
        font.draw(ctx, { code, fg, bg }, 0, 0);
    }

    redraw_fkeys() {
        if (!doc.render || !this.fkeys || !this.fkeys[this.fkey_index]) return;
        for (let i = 0; i < 12; i++) {
            this.draw_fkey(`f${i + 1}`, this.fkeys[this.fkey_index][i])
        };
        $("fkey_chooser_num").textContent = `${this.fkey_index + 1}`;
    }

    draw_custom_block() {
        const font = doc.font;
        const { fg, bg } = palette;
        const canvas = $("custom_block_canvas");
        canvas.width = font.width;
        canvas.height = font.height;
        const ctx = canvas.getContext("2d");
        font.draw(ctx, { code: this.custom_block_index, fg, bg }, 0, 0);
    }

    change_fkeys(num) {
        if (!this.fkeys || num < 0 || num >= this.fkeys.length) return;
        this.fkey_index = num;
        this.redraw_fkeys();
    }

    previous_character_set() {
        if (!this.fkeys || this.fkeys.length === 0) return;
        const prev_index = (this.fkey_index <= 0) ? this.fkeys.length - 1 : this.fkey_index - 1;
        this.change_fkeys(prev_index);
    }

    next_character_set() {
        if (!this.fkeys || this.fkeys.length === 0) return;
        const next_index = (this.fkey_index + 1 >= this.fkeys.length) ? 0 : this.fkey_index + 1;
        this.change_fkeys(next_index);
    }

    increase_brush_size() {
        this.brush_size = Math.min(this.brush_size + 1, 9);
        $("brush_size_num").innerText = this.brush_size;
    }

    decrease_brush_size() {
        this.brush_size = Math.max(this.brush_size - 1, 1);
        $("brush_size_num").innerText = this.brush_size;
    }

    reset_brush_size() {
        this.brush_size = 1;
        $("brush_size_num").innerText = this.brush_size;
    }

    default_character_set() {
        this.change_fkeys(this.default_fkeys);
    }

    f_key(num) {
        return this.fkeys[this.fkey_index][num];
    }

    show_select() {
        send("show_editing_touchbar");
        send("disable_brush_size_shortcuts");
        $("select_panel").classList.remove("hidden");
        $("brush_panel").classList.add("hidden");
        $("sample_panel").classList.add("hidden");
    }

    show_brush() {
        send("show_brush_touchbar");
        send("enable_brush_size_shortcuts");
        $("select_panel").classList.add("hidden");
        $("brush_panel").classList.remove("hidden");
        $("sample_panel").classList.add("hidden");
    }

    show_sample() {
        send("show_brush_touchbar");
        send("disable_brush_size_shortcuts");
        $("select_panel").classList.add("hidden");
        $("brush_panel").classList.add("hidden");
        $("sample_panel").classList.remove("hidden");
    }

    fkey_clicker(i) {
        return (event) => this.emit("key_typed", this.fkeys[this.fkey_index][i]);
    }

    fkey_pref_clicker(num) {
        return (event) => send_sync("fkey_prefs", { num, fkey_index: this.fkey_index, current: this.fkeys[this.fkey_index][num], bitmask: doc.font.bitmask, use_9px_font: doc.font.use_9px_font, font_height: doc.font.height });
    }

    change_mode(new_mode) {
        if (this.mode == new_mode && this.mode == this.modes.CUSTOM_BLOCK) {
            send_sync("fkey_prefs", { num: -1, fkey_index: 0, current: this.custom_block_index, bitmask: doc.font.bitmask, use_9px_font: doc.font.use_9px_font, font_height: doc.font.height });
            return;
        }
        this.mode = new_mode;
        $("half_block").classList.remove("brush_mode_selected");
        $("custom_block").classList.remove("brush_mode_selected");
        $("colorize").classList.remove("brush_mode_selected");
        $("shading_block").classList.remove("brush_mode_selected");
        $("replace_color").classList.remove("brush_mode_selected");
        $("blink").classList.remove("brush_mode_selected");
        $("colorize_fg").classList.add("brush_mode_ghosted");
        $("colorize_fg").classList.remove("brush_mode_selected");
        $("colorize_bg").classList.add("brush_mode_ghosted");
        $("colorize_bg").classList.remove("brush_mode_selected");
        switch (this.mode) {
            case this.modes.HALF_BLOCK: $("half_block").classList.add("brush_mode_selected"); break;
            case this.modes.CUSTOM_BLOCK: $("custom_block").classList.add("brush_mode_selected"); break;
            case this.modes.SHADING_BLOCK: $("shading_block").classList.add("brush_mode_selected"); break;
            case this.modes.REPLACE_COLOR: $("replace_color").classList.add("brush_mode_selected"); break;
            case this.modes.BLINK: $("blink").classList.add("brush_mode_selected"); break;
            case this.modes.COLORIZE:
                $("colorize").classList.add("brush_mode_selected");
                $("colorize_fg").classList.remove("brush_mode_ghosted");
                $("colorize_bg").classList.remove("brush_mode_ghosted");
                break;
        }
        if (this.colorize_fg) $("colorize_fg").classList.add("brush_mode_selected");
        if (this.colorize_bg) $("colorize_bg").classList.add("brush_mode_selected");
    }

    set_sample(x, y) {
        const font = doc.font;
        const block = doc.at(x, y);
        const canvas = document.getElementById("sample_block");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        font.draw_raw(ctx, block, 0, 0);
        this.set_color("sample_fg", block.fg, font);
        this.set_color("sample_bg", block.bg, font);
        $("code_value").textContent = `${block.code}`;
        $("fg_value").textContent = `${block.fg}`;
        $("bg_value").textContent = `${block.bg}`;
    }

    change_custom_brush(num) {
        if (this.mode != this.modes.CUSTOM_BLOCK) this.change_mode(this.modes.CUSTOM_BLOCK);
        this.custom_block_index = this.fkeys[this.fkey_index][num];
        this.draw_custom_block();
    }

    constructor() {
        super();
        this.fkey_index = 0;
        this.charlist_x = 0;
        this.charlist_y = 0;
        this.char_index = 0;
        this.fkeys = []; // Initialize as empty array to prevent undefined errors
        on("fkeys", (event, value) => {
            this.fkeys = value;
            this.redraw_fkeys();
        });
        on("default_fkeys", (event, value) => {
            this.default_fkeys = value;
            this.fkey_index = value;
        });
        on("set_custom_block", (event, value) => {
            this.custom_block_index = value;
            this.draw_custom_block();
        });
        on("next_character_set", () => this.next_character_set());
        on("previous_character_set", () => this.previous_character_set());
        on("default_character_set", () => this.default_character_set());
        on("increase_brush_size", () => this.increase_brush_size());
        on("decrease_brush_size", () => this.decrease_brush_size());
        on("reset_brush_size", () => this.reset_brush_size());
        keyboard.on("change_fkeys", (num) => this.change_fkeys(num));
        this.modes = { HALF_BLOCK: 0, CUSTOM_BLOCK: 1, SHADING_BLOCK: 2, REPLACE_COLOR: 3, BLINK: 4, COLORIZE: 5 };
        this.colorize_fg = true;
        this.colorize_bg = false;
        this.brush_size = 1;
        this.custom_block_index = 176;
        on("show_toolbar", (event, visible) => set_var_px("toolbar-height", visible ? 48 : 0));
        palette.on("set_fg", () => {
            this.redraw_fkeys();
            this.draw_custom_block();
            this.redraw_charlist();
        });
        palette.on("set_bg", () => {
            this.redraw_fkeys();
            this.draw_custom_block();
            this.redraw_charlist();
        });
        doc.on("render", () => {
            this.redraw_fkeys();
            this.draw_custom_block();
            this.redraw_charlist();
            this.draw_charlist_cursor(0);
            const font = doc.font;
            const sample_block = document.getElementById("sample_block");
            sample_block.width = font.width;
            sample_block.height = font.height;
            sample_block.style.width = `${font.width * 2}px`;
            sample_block.style.height = `${font.height * 2}px`;
            sample_block.style.margin = `${(48 - font.height * 2 - 2) / 2}px`;
        });
        document.addEventListener("DOMContentLoaded", (event) => {
            for (let i = 0; i < 12; i++) $(`f${i + 1}`).addEventListener("mousedown", this.fkey_clicker(i), true);
            for (let i = 0; i < 12; i++) $(`f${i + 1}_pref`).addEventListener("mousedown", this.fkey_pref_clicker(i), true);
            $("fkey_chooser_left").addEventListener("mousedown", (event) => this.previous_character_set(), true);
            $("fkey_chooser_right").addEventListener("mousedown", (event) => this.next_character_set(), true);
            $("brush_size_left").addEventListener("mousedown", (event) => this.decrease_brush_size(), true);
            $("brush_size_right").addEventListener("mousedown", (event) => this.increase_brush_size(), true);
            $("brush_size_num").innerText = this.brush_size;
            $("half_block").addEventListener("mousedown", (event) => this.change_mode(this.modes.HALF_BLOCK));
            $("custom_block").addEventListener("mousedown", (event) => this.change_mode(this.modes.CUSTOM_BLOCK));
            $("shading_block").addEventListener("mousedown", (event) => this.change_mode(this.modes.SHADING_BLOCK));
            $("replace_color").addEventListener("mousedown", (event) => this.change_mode(this.modes.REPLACE_COLOR));
            $("blink").addEventListener("mousedown", (event) => this.change_mode(this.modes.BLINK));
            $("colorize").addEventListener("mousedown", (event) => this.change_mode(this.modes.COLORIZE));
            $("colorize_fg").addEventListener("mousedown", (event) => {
                this.colorize_fg = !this.colorize_fg;
                this.change_mode(this.modes.COLORIZE);
            });
            $("colorize_bg").addEventListener("mousedown", (event) => {
                this.colorize_bg = !this.colorize_bg;
                this.change_mode(this.modes.COLORIZE);
            });
            this.change_mode(this.modes.HALF_BLOCK);
        }, true);

        keyboard.on("move_charlist", (direction) => this.move_charlist(direction));
        keyboard.on("insert_charlist_selection", () => this.insert_charlist_selection());
        
        on("update_fkeys", (event, new_fkeys) => {
            this.fkeys = new_fkeys;
            this.redraw_fkeys();
        });


    }
}

module.exports = { statusbar: new StatusBar(), tools: new Tools(), toolbar: new Toolbar(), zoom_in, zoom_out, actual_size, canvas_zoom_toggle };
