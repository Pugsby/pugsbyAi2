/*var fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var json = JSON.parse(event.target.result);
        console.log(json);
        var infoElement = document.getElementById("info");
        infoElement.innerHTML = "";
        infoElement.innerHTML += `<h2>Name</h2><p>${json.name}</p>`;
        infoElement.innerHTML += `<h2>Summary</h2><p>${json.description}</p>`;
        infoElement.innerHTML += `<h2>Personality</h2><p>${json.personality}</p>`;
        infoElement.innerHTML += `<h2>Scenario</h2><p>${json.scenario}</p>`;
        infoElement.innerHTML += `<h2>Greeting</h2><p>${json.first_mes}</p>`;
        infoElement.innerHTML += `<h2>Example Messages</h2><p>${json.mes_example}</p>`;
        infoElement.innerHTML += `<h2>Image</h2><img src="${document.getElementById("imageUrl").value}">`; 
        infoElement.innerHTML += `<button id="save">Save</button>`;

        var saveButton = document.getElementById("save");
        function save() {
            // find first available id (where no bot exists)
            var id = 0;
            while (localStorage.getItem("pugsbyAi/bot/" + id.toString()) !== null) {
                id++;
            }
            localStorage.setItem("pugsbyAi/bot/" + id.toString(), JSON.stringify(json));
            localStorage.setItem("pugsbyAi/bot/" + id.toString() + "/metadata", JSON.stringify({name: json.name, img: document.getElementById("imageUrl").value}));
            window.location.href = "../chat/index.html?character=" + id;
        }
        saveButton.addEventListener("click", save);
    }
    reader.readAsText(file);
});*/
// Incase something terrible happens, I've kept the old code so I can revert back
// if this backup gets deleted, I'll just refer to https://github.com/Pugsby/pugsbyAi2/commit/382413d3ecc54c0c36202b53e9f6fd340c2b3e38
// peak
var name = "";
var imageUrl = "";
var chatName = "";
var introduction = "";
var characterPersona = "";
var summary = "";
var exampleMessages = "";
var worldScenario = "";
function updateText() {
    document.getElementById("name").value = name;
    if (imageUrl) {
        document.getElementById("imageUrl").value = imageUrl;
    }
    document.getElementById("chatName").value = chatName;
    document.getElementById("introduction").value = introduction;
    document.getElementById("characterPersona").value = characterPersona;
    document.getElementById("summary").value = summary;
    document.getElementById("exampleMessages").value = exampleMessages;
    document.getElementById("worldScenario").value = worldScenario;
}
function charImport(text) { // would use import if it wasn't a reserved statement
    var json = JSON.parse(text);
    name = json.char_name;
    chatName = json.char_name;
    introduction = json.first_mes;
    characterPersona = json.description;
    summary = json.personality;
    exampleMessages = json.mes_example;
    updateText();
}
charImport(debugCharacter);
document.getElementById("fileInput").addEventListener("change", function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        charImport(event.target.result);
    }
    reader.readAsText(file);
});
function save() {
    var json = valuesToJson();
    var metadata = valuesToMetadata();
    // find first available id (where no bot exists)
    var id = 0;
    while (localStorage.getItem("pugsbyAi/bot/" + id.toString()) !== null) {
        id++;
    }
    localStorage.setItem("pugsbyAi/bot/" + id.toString(), JSON.stringify(json));
    localStorage.setItem("pugsbyAi/bot/" + id.toString() + "/metadata", JSON.stringify(metadata));
    window.location.href = "../chat/index.html?character=" + id;
}
// oh look i already have a save function, sadly it's import only
//function save() {
//    // find first available id (where no bot exists)
//    var id = 0;
//    while (localStorage.getItem("pugsbyAi/bot/" + id.toString()) !== null) {
//        id++;
//    }
//    localStorage.setItem("pugsbyAi/bot/" + id.toString(), JSON.stringify(json));
//    localStorage.setItem("pugsbyAi/bot/" + id.toString() + "/metadata", JSON.stringify({name: json.name, img: document.getElementById("imageUrl").value}));
//    window.location.href = "../chat/index.html?character=" + id;
//}
function valuesToJson() {
    var json = {};
    json.name = document.getElementById("chatName").value;
    json.description = document.getElementById("characterPersona").value;
    json.personality = document.getElementById("summary").value;
    json.world_scenario = document.getElementById("worldScenario").value;
    json.first_mes = document.getElementById("introduction").value;
    json.mes_example = document.getElementById("exampleMesesages").value;
    return json;
}
function valuesToMetadata() {
    var metadata = {};
    metadata.name = document.getElementById("name").value;
    metadata.img = document.getElementById("imageUrl").value;
    return metadata;
}

document.getElementById("imageUrl").addEventListener("change", function(event) {
    var imageUrl = document.getElementById("imageUrl").value;
    document.getElementById("imagePreview").src = imageUrl;
});