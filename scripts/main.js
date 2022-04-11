const client = new tmi.Client({
  channels: ["alissonmdo"],
});

const createCard = (message, user, color) => {
  const parseMessage = (message) => {
    const classes = [];
    let parsedMessage = message;
    if (message.includes("!bold") || !message.includes("!ignore")) {
      classes.push("bold");
      parsedMessage = parsedMessage.replace("!bold", "");
    }
    if (message.includes("!big")) {
      classes.push("big");
      parsedMessage = parsedMessage.replace("!big", "");
    }

    const expression =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (message.match(regex)) {
      classes.push("link");
      parsedMessage = `${parsedMessage} 🔗`;
    }
    return { parsedMessage, classes };
  };
  // 1. Create Card
  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("zero-height");

  // 2. Create Header
  const cardHeader = document.createElement("div");
  const image = document.createElement("img");
  image.classList.add("card-avatar");
  image.src = `https://robohash.org/${user}`;
  cardHeader.appendChild(image);
  cardHeader.append(user);
  cardHeader.classList.add("card-header");
  cardHeader.style.color = color;
  card.appendChild(cardHeader);

  // 3. Create Content
  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  const { parsedMessage, classes } = parseMessage(message);

  cardContent.innerText = parsedMessage;
  classes.forEach((c) => {
    cardContent.classList.add(c);
  });
  card.appendChild(cardContent);

  return card;
};

const addCardToList = (message, displayName, color) => {
  const card = createCard(message, displayName, color);
  messageList.appendChild(card);
  messageList.scrollTop = messageList.scrollHeight;
};

client.on("message", (channel, tags, message, self) => {
  const { color } = tags;
  const displayName = tags["display-name"];
  addCardToList(message, displayName, color);
  messages.push({ message, displayName, color });
  window.localStorage.setItem("messages", JSON.stringify(messages));
  card.classList.remove("zero-height");
});
const messageList = document.getElementById("list");

const possiblyMessagesAsString = window.localStorage.getItem("messages");

/** @type Array */
const messages = possiblyMessagesAsString
  ? JSON.parse(possiblyMessagesAsString)
  : [];

messages.forEach((message) => {
  addCardToList(message.message, message.displayName, message.color);
});

client.connect();
