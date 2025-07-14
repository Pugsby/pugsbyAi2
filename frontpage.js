var charactersElement = document.getElementById("characters");
//<div class="characterCard">
//    <img src="https://characterai.io/i/400/static/avatars/uploaded/2025/7/11/QLBTboMCFcKYmVZVPduSBlm6scLx4rguDIJEzsgYLqc.webp?anim=0" width="100%">
//    <div><h1>Name</h1>
//    <p>Test uhhhhhhh pluh idk lorem ipsum</p>
//    <button>Chat</button></div>
//</div>
function checkCharacter(id) {
    var character = localStorage.getItem("pugsbyAi/bot/" + id.toString() + "/metadata");
    if (character) {
        return JSON.parse(character);
    }
    return false;
}
function addCharacter(idx, continued) {
    var character = checkCharacter(idx);
    console.log(character);
    if (character) {
        var template = `
        <div class="characterCard">
            <img src="IMAGEURL" width="100%">
            <div><h1>NAME</h1>
            <p>DESCRIPTION</p>
            <button onclick="window.location.href='chat/index.html?character=${idx}'">Chat</button></div>
        </div>
        `
        /// replace NAME with character.name
        /// replace DESCRIPTION with character.summary
        /// replace IMAGEURL with character.img
        template = template.replace(/NAME/g, character.name);
        var chardata = JSON.parse(localStorage.getItem("pugsbyAi/bot/" + idx.toString())); 
        template = template.replace(/DESCRIPTION/g, chardata.description);
        template = template.replace(/IMAGEURL/g, character.img);
        
        charactersElement.innerHTML += template;
        
    }
    if (continued) {
        setTimeout(addCharacter, 1, idx + 1, true);
    }
}
addCharacter(0, true)