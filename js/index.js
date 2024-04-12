let key;

fetch("config.json")
  .then(res => res.json())
  .then((config) => {
    key = config.key
  })
  .catch((err) => {
    console.error(`Error fetching configuration: ${err}`);
  });

let btn = document.getElementById("send");
let ncv = document.getElementById("ncv"); // NCV = New Conversation
let chatbox = document.getElementById("chatbox");
let chathistory = document.getElementById("chathistory");

// Recieves the user input, puts it through a chat bot endpoint on an API
function ask() {
  if (chatbox.value === "") {
    return alert("You must input something to say");
  } else {
    // Add the user's message to the chat history div and scroll to the latest message
    chathistory.prepend(userMsg(chatbox.value));
    scrollToBottom();

    // Recieve the message and respond to the user
    fetch(
      `https://some-random-api.com/chatbot?key=${key}&message=${encodeURIComponent(
        `${chatbox.value}`
      )}`
    )
      .then((res) => res.json())
      .then((json) => {
        // If there's an error, add the error message into the chat box
        if (json.error) {
          return chathistory.prepend(errorMsg(json.error));
        }
        // Add the bot's message to the chat history div and scroll to the latest message
        chathistory.prepend(botMsg(json.response));
        scrollToBottom();
      })
      .catch((err) => {
        // If there's an error, add the error message into the chat box
        return chathistory.prepend(errorMsg(err.message));
      });

    // Make the text box empty after the user has send their message
    chatbox.value = "";
  }
}

/**
 * Create and make the user's message
 * @param {Text} text The text the user wants to send
 * @returns {HTMLDivElement}
 */
function userMsg(text) {
  var pfp = '<img src="images/default.png" id="pfp">';
  var message = document.createElement("div");
  message.classList.add("usermsg");
  message.innerHTML = `${pfp} You: ${text}`;
  return message;
}

/**
 * Create and make the bot's message
 * @param {Text} text The text the bot replies with
 * @returns {HTMLDivElement}
 */
function botMsg(text) {
  var pfp = '<img src="images/bot.png" id="pfp">';
  var message = document.createElement("div");
  message.classList.add("botmsg");
  message.innerHTML = `${pfp} Bot: ${text}`;
  return message;
}

/**
 * Create and make the error message
 * @param {Text} error The error message itself
 * @returns {HTMLDivElement}
 */
function errorMsg(error) {
  var pfp = '<img src="images/warning.png" id="warning">';
  var message = document.createElement("div");
  message.classList.add("error");
  message.style.color = "red";
  message.innerHTML = `${pfp} [ERROR] ${error}`;
  return message;
}

// Check when either the Send button or key Enter is pressed, then trigger the ask function
btn.addEventListener("click", ask);
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    ask();
  }
});

/**
 * Check if the user has clicked the button to start a new conversation
 * If the user has clicked the button, prompt them if they're sure they want to start a new conversation
 */
ncv.addEventListener("click", function () {
  let res = window.confirm(
    "Are you sure you want to start a new converstation?\nYour previous conversation will be permanently deleted."
  );
  if (res) {
    location.reload();
  }
});

// Makes it so then the conversation is always scrolled to the latest message
function scrollToBottom() {
  chathistory.scrollTop = chathistory.scrollHeight;
}
