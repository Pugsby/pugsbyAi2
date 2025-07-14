var fileInput = document.getElementById("fileInput");
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
});