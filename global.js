// Debug
var debugDiv = document.createElement("div");
debugDiv.id = "debug";
document.body.appendChild(debugDiv);
debugDiv.style.backgroundColor = "#000000a7";
debugDiv.style.position = "fixed";
debugDiv.style.top = "10px";
debugDiv.style.left = "10px";
debugDiv.style.width = "300px";
debugDiv.style.height = "200px";
debugDiv.style.zIndex = "99999999999999";

var fpsP = document.createElement("p");
fpsP.innerHTML = "FPS: 0";
fpsP.style.color = "#ffffff";
debugDiv.appendChild(fpsP);

var fps = 0;
var lastTime = performance.now();
var frameCount = 0;
var fpsUpdateTime = 0;
fpsP.style.margin = "0";
fpsP.style.fontFamily = "Ubuntu Mono"; // just Ubuntu Mono because this is for debug purposes and I'm the only dev for this application
// i'm a ubuntu user  
function fpsUpdate(currentTime) {
    frameCount++;
    
    // Update FPS display every 500ms for stability
    if (currentTime - fpsUpdateTime >= 500) {
        fps = Math.round((frameCount * 1000) / (currentTime - fpsUpdateTime));
        fpsP.innerHTML = "FPS: " + fps;
        frameCount = 0;
        fpsUpdateTime = currentTime;
    }
    
    requestAnimationFrame(fpsUpdate);
}

requestAnimationFrame(fpsUpdate);

var elementCount = 0;
var elementCountP = document.createElement("p");
elementCountP.innerHTML = "Elements: 0";
elementCountP.style.color = "#ffffff";
elementCountP.style.margin = "0";
elementCountP.style.fontFamily = "Ubuntu Mono"; // i'm not explaining it again
debugDiv.appendChild(elementCountP);
function countElements() {
    elementCount = document.querySelectorAll("*").length;
    elementCountP.innerHTML = "Elements: " + elementCount;
    setInterval(countElements, 10);
}
countElements();

var tokenP = document.createElement("p");
tokenP.innerHTML = "API Key: " + localStorage.getItem("pugsbyAi/apiKey");
tokenP.style.color = "#ffffff";
tokenP.style.margin = "0";
tokenP.style.fontFamily = "Ubuntu Mono";
debugDiv.appendChild(tokenP);
tokenP.style.wordBreak = "break-all";

var localStorageP = document.createElement("p");
localStorageP.style.color = "#ffffff";
localStorageP.style.margin = "0";
localStorageP.style.fontFamily = "Ubuntu Mono";
debugDiv.appendChild(localStorageP);
var localStorageLength = 0;
function updateLocalStorage() {
    localStorageLength = 0;
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("pugsbyAi")) {
            localStorageLength++;
        }
    }
    localStorageP.innerHTML = "Local Storage: " + localStorage.length + " (" + localStorageLength + ")";
    setInterval(updateLocalStorage, 10);
}
updateLocalStorage();

debugDiv.style.display = "none";
// when right ctrl is pressed, show debug
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.DOM_KEY_LOCATION_RIGHT == event.location) {
        if (debugDiv.style.display == "none") {
            debugDiv.style.display = "block";
        } else {
            debugDiv.style.display = "none";
        }
    }
});