var apiKey = "pk-fire"; // fuck you, ness
var baseUrl = "https://api.pawan.krd/cosmosrp/v1/chat/completions";
var memory = [];
memory.push({
    "role": "system",
    "content": ""
})
var metadata = {};
var botPersona = {};
var urlParams = new URLSearchParams(window.location.search);
var botId = urlParams.get("character");
botPersona = localStorage.getItem("pugsbyAi/bot/" + botId.toString());
botPersona = JSON.parse(botPersona);
metadata = localStorage.getItem("pugsbyAi/bot/" + botId.toString() + "/metadata");  
metadata = JSON.parse(metadata);
function basicMessage(message, autoUpdate, setMemoryTo, messageElement) { 
    var userMessage = {
        "role": "user",
        "content": message
    };
    if (setMemoryTo) {
        memory = setMemoryTo;
    }
    memory.push(userMessage);
    var request = {
        "model": "gpt-3.5-turbo",
        "messages": memory,
        "temperature": 0.7,
        "max_tokens": 1000,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "stream": autoUpdate,
    };
    
    var response = fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify(request),
    });
    console.log(apiKey)
    if (autoUpdate && messageElement) {
        // Handle streaming response
        return response.then(function(response) {
            var reader = response.body.getReader();
            var decoder = new TextDecoder();
            var fullContent = "";
            
            function readStream() {
                return reader.read().then(function(result) {
                    if (result.done) {
                        // Stream finished, add to memory
                        memory.push({role: "assistant", content: fullContent});
                        return {choices: [{message: {content: fullContent}}]};
                    }
                    
                    var chunk = decoder.decode(result.value, {stream: true});
                    var lines = chunk.split('\n');
                    
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i].trim();
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                var data = JSON.parse(line.substring(6));
                                if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                                    var content = data.choices[0].delta.content;
                                    fullContent += content;
                                    
                                    // Update the message element with italic formatting and linebreaks
                                    var formattedContent = fullContent
                                        .replace(/\*([^*]+)\*/g, "<span class=\"italic\">*$1*</span>")
                                        .replace(/\n/g, '<br>');  // Convert newlines to <br> tags
                                    messageElement.querySelector("p").innerHTML = formattedContent;
                                    
                                    // Auto-scroll to bottom
                                    messagesElement.scrollTop = messagesElement.scrollHeight;
                                }
                            } catch (e) {
                                console.log("Error parsing JSON:", e);
                            }
                        }
                    }
                    
                    return readStream();
                });
            }
            
            return readStream();
        });
    } else {
        // Handle non-streaming response (original behavior)
        return response.then(function(response) {
            return response.json();
        }).then(function(response) {
            console.log(response.choices[0].message.content);
            memory.push({role: "assistant", content: response.choices[0].message.content});
            return response; 
        });
    }
}

function personasToBaseMemory(botPersona, userPersona) {
    if (!userPersona) {
        userPersona = {name: "User", persona: ""};
    }
    if (!botPersona) {
        botPersona = {
            name: "AI",
            summary: "",
            personality: "",
            scenario: "",
            greeting: "",
            exampleMessages: "",
        };
    }
    
    // Helper function to replace placeholders in all properties of an object
    function replacePlaceholders(obj, userName, botName) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/{{user}}/g, userName).replace(/{{char}}/g, botName);
            }
        });
    }
    
    // Replace placeholders in both personas
    replacePlaceholders(botPersona, userPersona.name, botPersona.name);
    replacePlaceholders(userPersona, userPersona.name, botPersona.name);
    
    return [{
        "role": "system", 
        "content": `You are ${botPersona.name}.
        ${botPersona.name}'s persona/personality is ${botPersona.personality}, (${botPersona.summary}).
        the current scenario is ${botPersona.scenario},
        examples of what ${botPersona.name} would say to ${userPersona.name} are:
        ${botPersona.exampleMessages}`
    },
    {"role": "system", "content": `The user's name is ${userPersona.name}, ${userPersona.persona}.`},
    {"role": "assistant", "content": botPersona.greeting}];
}

function tavernAIToPersona(persona) {
    return {
        name: persona.name,
        summary: persona.summary,
        personality: persona.personality,
        scenario: persona.scenario,
        greeting: persona.first_mes,
        exampleMessages: persona.mes_example,
    }
}

function importPersonalityFromJson(json) {
    json = JSON.parse(json);
    if (json.first_mes) {
        // this is a tavernAI persona, convert it to a pugsbyAI persona
        console.log("tavernAI persona detected");
        return tavernAIToPersona(json);
    }
    return json;
}

document.title = "Pugsby AI | Chat with " + metadata.name;
document.getElementById("nameOnTop").innerHTML = metadata.name;
var userPersona = {name: "User", persona: "", image: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"};
memory = personasToBaseMemory(tavernAIToPersona(botPersona), userPersona);

var messagesElement = document.getElementById("messages");
var messageTemplate = document.createElement("div");
messageTemplate.classList.add("message");
messageTemplate.innerHTML = `
<img src="transparent.png">
<div>
    <b></b>
    <p></p>
</div>
`;

for (var i = 0; i < memory.length; i++) {
    var message = memory[i];
    var name = message.role;
    var content = message.content;
    var messageElement = messageTemplate.cloneNode(true);
    if (name === "user") {
        name = userPersona.name;
        // Set user profile picture
        messageElement.querySelector("img").style.backgroundImage = `url(${userPersona.image})`;
    }
    if (name === "assistant") {
        name = botPersona.name;
        messageElement.querySelector("img").style.backgroundImage = `url(${metadata.img})`;
    }
    messageElement.classList.add(message.role);
    messageElement.querySelector("b").innerHTML = name;
    // Format content with linebreaks preserved
    content = content
        .replace(/\*([^*]+)\*/g, "*<span class=\"italic\">$1</span>*")  // Handle italic formatting
        .replace(/\n/g, '<br>');  // Convert newlines to <br> tags for display
    messageElement.querySelector("p").innerHTML += content;
    messagesElement.appendChild(messageElement);
}

var inputElement = document.getElementById("input");
var shiftDown = false;

inputElement.addEventListener("keydown", function(event) {
    if (event.key === "Shift") {
        shiftDown = true;
    }
});

inputElement.addEventListener("keyup", function(event) {
    if (event.key === "Shift") {
        shiftDown = false;
    }
});

function send() {
    // Get the message content and preserve linebreaks
    var message = inputElement.innerHTML
        .replace(/<br\s*\/?>/gi, '\n')  // Convert <br> tags to newlines
        .replace(/<div>/gi, '\n')       // Convert <div> tags to newlines
        .replace(/<\/div>/gi, '')       // Remove closing div tags
        .replace(/<[^>]*>/g, '')        // Remove any remaining HTML tags
        .trim();                        // Remove leading/trailing whitespace
    
    if (!message) return; // Don't send empty messages
    
    // Add user message
    var userMessageElement = messageTemplate.cloneNode(true);
    userMessageElement.classList.add("user");
    userMessageElement.querySelector("b").innerHTML = userPersona.name;
    // Set user profile picture
    userMessageElement.querySelector("img").style.backgroundImage = `url(${userPersona.image})`;
    
    // Format message with linebreaks preserved
    var formattedMessage = message
        .replace(/\*([^*]+)\*/g, "*<span class=\"italic\">$1</span>*")  // Handle italic formatting
        .replace(/\n/g, '<br>');  // Convert newlines to <br> tags for display
    
    userMessageElement.querySelector("p").innerHTML += formattedMessage;
    messagesElement.appendChild(userMessageElement);
    
    // Add assistant message container
    var assistantMessageElement = messageTemplate.cloneNode(true);
    assistantMessageElement.classList.add("assistant");
    assistantMessageElement.querySelector("b").innerHTML = botPersona.name;
    assistantMessageElement.querySelector("img").style.backgroundImage = `url(${metadata.img})`;
    messagesElement.appendChild(assistantMessageElement);
    
    // Call basicMessage with streaming enabled
    var response = basicMessage(message, true, null, assistantMessageElement);
    
    // Handle any errors
    response.catch(function(error) {
        console.error("Error:", error);
        assistantMessageElement.querySelector("p").innerHTML = "Error occurred while generating response.";
    });
    
    // Clear input after sending
    setTimeout(function() {
        inputElement.innerHTML = "";
    }, 1);
    
    // Auto-scroll to bottom
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

inputElement.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !shiftDown) {
        event.preventDefault(); // Prevent default Enter behavior
        send();
    }
});

var sendButtonElement = document.getElementById("sendButton");
sendButtonElement.addEventListener("click", function() {
    send();
});

var hamburgerMenuElement = document.getElementById("hamburgerMenuButton");
hamburgerMenuElement.addEventListener("click", function() {
    setTimeout(function() {
        document.getElementById("hamburgerMenu").style.display = "block";
    }, 1);
});
document.addEventListener("click", function(event) {
    document.getElementById("hamburgerMenu").style.display = "none";
});
apiKey = localStorage.getItem("pugsbyAi/apiKey");
if (apiKey === null) {
    apiKey = "pk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
}
document.getElementById("apiKey").value = apiKey;
document.getElementById("apiKey").addEventListener("change", function() {
    localStorage.setItem("pugsbyAi/apiKey", this.value);
    apiKey = this.value;
});
document.getElementById("apiSettingsButton").addEventListener("click", function(event) {
    document.getElementById("apiSettings").style.display = "block";
});
document.getElementById("closeApiSettings").addEventListener("click", function(event) {
    document.getElementById("apiSettings").style.display = "none";
});