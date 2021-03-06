// localStorage.clear();

MY_API_KEY = "";

var notesAPI = function() {
    document.getElementById("current-notes").replaceChildren();
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    displayNotes(notes);
}
// Create div sticky note
// Finds note in localStorage and displays it
var popUp = function(oNote) {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    var note = notes.find(note => note.id == oNote.id);
    let div = document.createElement("div");
    let id = "popup-".concat(note.id);
    div.classList.add("dragable");
    div.setAttribute("id", id);
    div.innerHTML = `<h3 class="drag">${note.title}</h3>`;
    document.body.appendChild(div);

    // Textarea, auto sizing.
    var text = document.createElement("textarea");
    text.innerHTML = note.input;
    div.appendChild(text);
    expandTextArea(text);
   
    // Sticky placement
    div.style.left = note.x + "px";
    div.style.top = note.y + "px";

    // Create buttons
    let popup_btns = document.createElement("div");
    popup_btns.classList.add("popup-btns");
    div.appendChild(popup_btns);
    // Close button
    let close_btn = document.createElement('button');
    close_btn.innerHTML = "X";
    close_btn.classList.add("close-btn");
    close_btn.onclick = function() {
        note.active = false;
        note.x = 0;
        note.y = 0;
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
        notesAPI();
        close(this, false);
    };
    div.appendChild(close_btn);
    // Delete button
    let delete_btn = document.createElement('button');
    delete_btn.innerHTML = "Delete";
    delete_btn.classList.add("popup-btn");
    delete_btn.onclick = function() {
        deleteNote(this);
        close(this, true);
    };
    popup_btns.appendChild(delete_btn);
    // Update button
    let update_btn = document.createElement('button');
    update_btn.innerHTML = "Update";
    update_btn.classList.add("popup-btn", "update");
    update_btn.onclick = function() {
        updateNote(this, true);
    }
    popup_btns.appendChild(update_btn);
};

// Note dragging
let isDragging = false;
let dragTarget;
let lastOffsetX = 0;
let lastOffsetY = 0;

var drag = function(e) {
    if (!isDragging) return;
    dragTarget.style.left = e.pageX - lastOffsetX + "px";
    dragTarget.style.top = e.pageY - lastOffsetY + "px";

    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    var id = e.target.parentElement.id.replace("popup-", "");;
    var note = notes.find(note => note.id == id);
    note.x = e.pageX - lastOffsetX;
    note.y = e.pageY - lastOffsetY;
    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    notesAPI();
}

document.addEventListener('mousedown', function(e) {
    if (!e.target.classList.contains('drag')) {
        return;
    }
    dragTarget = e.target.parentElement;
    dragTarget.parentElement.append(dragTarget);
    lastOffsetX = e.offsetX;
    lastOffsetY = e.offsetY;
    isDragging = true;
});

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', () => (isDragging = false));


// Delete note
var deleteNote = function (e) {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    //remove popup from id
    var id = e.parentElement.parentElement.id.replace("popup-", "");
    const newNotes = notes.filter(note => note.id != id);
    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    notesAPI();
};

// Update note
var updateNote = function (e) {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    var id = e.parentElement.parentElement.id.replace("popup-", "");
    var note = notes.find(note => note.id == id);
    note.input = e.parentElement.parentElement.querySelector("textarea").value;
    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
}

// Close note
var close = function(e, nested) {
    if (nested) {
        e.parentElement.parentElement.remove();
    }   else {
    e.parentElement.remove();
    }
}

// Display notes
var displayNotes = function(notes) {
    const currentNotes = document.getElementById("current-notes");
    notes.forEach(note => {
        let li = document.createElement("li");
        li.innerHTML = note.title;
        li.setAttribute("id", note.id);
        li.addEventListener("click", function() {
            if (note.active) {
                return;
            } else {
            popUp(note);
            note.active = true;
            localStorage.setItem("notesapp-notes", JSON.stringify(notes));
            notesAPI();
            }
            });
        currentNotes.appendChild(li);
    })
};

// Display stickys
var displayStickys = function(stickies) {
    stickies.forEach(sticky => {
        if (sticky.active) {
            popUp(sticky);
        }
    })
}

// Expand text areas automatically
var expandTextArea = function(area) {
    area.style.height = 'inherit';
    var computed = window.getComputedStyle(area);
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + area.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    area.style.height = height + 'px';
}

document.addEventListener('input', function (e) {
    if (e.target.tagName.toLowerCase() == ('textarea') && e.target.parentElement.classList.contains('dragable')) {
        expandTextArea(e.target);
    } else {
        return;}
})

// Add note
const note_btn = document.getElementById("add-note-btn");
note_btn.addEventListener("click", function() {
    const note_title = document.getElementById("note-title").value;
    const note_input = document.getElementById("new-note").value;
    if (note_title == "" || note_input == "") {
        alert("Input cannot be empty!");
    } else {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    const note_id = "id-" + Math.floor(Math.random() * 10000);
    const new_note = {title: note_title, input: note_input, id: note_id, active: false, x: 0, y: 0};
    notes.push(new_note);
    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    notesAPI();
    // Clearsm input fields
    document.getElementById("note-title").value = "";
    document.getElementById("new-note").value = "";
    };
});

// Set date and time
var clock = function () {
    var greeting = "Good";
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var hrs = hours < 10 ? "0" + hours : hours;
    var mins = minutes < 10 ? "0" + minutes : minutes;
    var time = "".concat(hrs, ":").concat(mins);
    if (hours >= 0 && hours < 12) {
        greeting += " morning!";
    } else if (hours >= 12 && hours < 18) {
        greeting += " afternoon!";
    } else if (hours >= 18 && hours < 24) {
        greeting += " evening!";
    }
    document.getElementById("greeting").innerHTML = greeting;
    document.getElementById("clock").innerHTML = "It is " + time;
    setTimeout(clock, 1000);
};

// Tab change event
var tabChange = function (tabName) {
    border = document.getElementById("container-contents");
    border.classList.remove("active");
    tabContent = document.querySelectorAll(".tab");
    tabContent.forEach((tab) => {tab.style.display = "none"});
    document.getElementById(tabName.toLowerCase()).style.display = "flex";
    if (tabName == 'Notes') {
        border.classList.add("active");
    };
};

// Get Location
var getLocation = function () {
    fetch('https://geolocation-db.com/json/')
    .then(response => response.json())
    .then(data => { getWeather(data.city, data.country_code); })
    .catch(error => console.error(error));
}

// Weather
var getWeather = function (city, countryCode) {
    const token = MY_API_KEY;
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + countryCode + '&appid=' + token)
    .then(response => response.json())
    .then(data => { 
        var cur_temp = Math.round(((parseFloat(data.main.temp) - 273.15)));
        var temp_high = Math.round(((parseFloat(data.main.temp_max) - 273.15)));
        var temp_low = Math.round(((parseFloat(data.main.temp_min) - 273.15)));
        document.getElementById('weather-icon').src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        document.getElementById("current-temp").innerHTML = cur_temp + '<span id="celcius">??C</span>';
        document.getElementById("current-conditions").innerHTML = data.weather[0].description;
        document.getElementById('location').innerHTML = city + ', ' + countryCode;
        document.getElementById("temp-high").innerHTML = 'High: ' + temp_high + '??C';
        document.getElementById("temp-low").innerHTML = 'Low: ' + temp_low + '??C';
        ; })
    .catch(error => console.error(error));
}   

tabs_btns = document.querySelectorAll(".menu-btn");
tabs_btns.forEach(btn => btn.addEventListener("click", function() {
    tabChange(this.textContent);
}));
document.getElementById("notes").style.display = "none";
const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
displayNotes(notes);
displayStickys(notes);
clock();
getLocation();