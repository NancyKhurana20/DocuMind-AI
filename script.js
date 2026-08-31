const fileUpload = document.querySelector("#fileUpload");
const docList = document.querySelector(".doc-list");
let documentText = "";
const chatInput = document.querySelector("#chatInput");
const sendBtn = document.querySelector("#sendBtn");
const chatArea = document.querySelector("#chatArea");
const suggestionPills = document.querySelectorAll(".suggestion-pill");

//Types of files which are allowed for users to upload
const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
//Function which will handle the file upload
const handleFileUpload = function (event) {
  //Getting the file which has been uploaded
  const file = event.target.files[0];

  //If no file is uploaded
  if (!file) {
    return;
  }
  //Checking if the uploaded file is valid or not
  const isValidFile = allowedTypes.includes(file.type);
  if (isValidFile) {
    displayUploadedFile(file);
    extractDocumentText(file);
  } else {
    console.log("File type is not valid");
  }
};
function getFileType(file) {
  return file.name.split(".").pop().toUpperCase();
}
//As soon as file will be uploaded this event handler will be called and handleFileUpload function will be called
fileUpload.addEventListener("change", handleFileUpload);

function displayUploadedFile(file) {
  const typeOfFile = getFileType(file);
  const html = `
  <li class="doc-item active">
    <div class="doc-icon" ${typeOfFile}>${typeOfFile}</div>

      <div>
        <p class="doc-name">${file.name}</p>
        <p class="doc-sub">${typeOfFile} Document</p>
      </div>
  </li>
  `;
  docList.innerHTML = html;
}
function extractDocumentText(file) {
  console.log(`Extracting the text from ${file.name}`);
  const type = getFileType(file);
  switch (type) {
    case "PDF":
      readPdf(file);
      break;
    case "DOCX":
      readDocx(file);
      break;
    case "TXT":
      readTxt(file);
      break;
  }
}
function readTxt(file) {
  //Creating a reader which will read our file
  const reader = new FileReader();

  // Tell the browser what to do when reading finishes
  reader.onload = function () {
    documentText = reader.result;
  };

  // Start reading the file
  reader.readAsText(file);
}
async function handleSendMessage() {
  //Get input value
  const inputText = chatInput.value;
  //Validate input
  if (inputText.trim() === "") {
    return;
  }
  //check document exists
  if (documentText === "") {
    console.log("file has not been uploaded");
    return;
  }
  //display user message
  displayUserMessage(inputText);
  const loadingElement = showLoadingMessage();
  const aiResponse = await getAIResponse(inputText);

  loadingElement.remove();
  displayAiMessage(aiResponse);
  chatInput.value = "";
  chatInput.focus();
}
function displayUserMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message", "user");

  const avatar = document.createElement("div");
  avatar.classList.add("avatar", "user-avatar");
  avatar.textContent = "You";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "user-bubble");
  bubble.textContent = message;

  div.appendChild(avatar);
  div.appendChild(bubble);

  chatArea.appendChild(div);
  scrollChatToBottom();
}
sendBtn.addEventListener("click", handleSendMessage);

chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
});

function displayAiMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  const avatar = document.createElement("div");
  avatar.classList.add("avatar", "ai-avatar");
  avatar.textContent = "AI";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "ai-bubble");
  bubble.textContent = message;

  div.appendChild(avatar);
  div.appendChild(bubble);

  chatArea.appendChild(div);
  scrollChatToBottom();
}
function showLoadingMessage() {
  const div = document.createElement("div");
  div.classList.add("message");

  const avatar = document.createElement("div");
  avatar.classList.add("avatar", "ai-avatar");
  avatar.textContent = "AI";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "ai-bubble", "typing-bubble");

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.classList.add("typing-dot");
    bubble.appendChild(dot);
  }

  div.appendChild(avatar);
  div.appendChild(bubble);

  chatArea.appendChild(div);
  scrollChatToBottom();

  return div;
}
function scrollChatToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

async function getAIResponse(question) {
  //question is what user asked/typed
  try {
    //fetch() is JavaScript's built-in way of making an HTTP request
    //await means Wait for Gemini's response before continuing with this function
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST", //we are sending info to gemini that's why we used post
        headers: {
          "Content-Type": "application/json", //this tells gemini that i m sending data in JSON format
        },
        //body is the actual data we are sending to gemini
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are DocuMind AI, an AI assistant that answers questions ONLY using the uploaded document.

DOCUMENT:
${documentText}

USER QUESTION:
${question}

IMPORTANT INSTRUCTIONS:

1. Use ONLY information present in the document.
2. Do not make up or assume information that is not present in the document.
3. If the answer cannot be found in the document, clearly say:
   "This information is not available in the uploaded document."

4. Understand what the user is asking and answer directly.

5. FORMAT YOUR RESPONSE CLEARLY:
   - For summaries or questions asking for multiple points, use a numbered list.
   - Put each point on a separate line.
   - Keep each point concise and easy to read.
   - For example:

     1. First important point.
     2. Second important point.
     3. Third important point.
     4. Fourth important point.
     5. Fifth important point.

   - Do not put all points into one paragraph.
   - Do not use unnecessary introductions or conclusions.
   - Use headings when they improve readability.
   - Use short paragraphs for normal questions.

6. If the user asks for "5 bullet points", provide exactly 5 points.
7. If the user asks for a summary, summarize the most important information from the document.
8. Keep the response concise unless the user specifically asks for a detailed explanation.
`,
                },
              ],
            },
          ],
        }),
      },
    );
    //gemini sends the response in JSON format , we convert the JSON response into a JS object and store it in data
    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return "Gemini could not process the request.";
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("No response from Gemini:", data);
      return "Gemini did not return an answer.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Request Error:", error);
    return "Something went wrong while contacting Gemini.";
  }
}

suggestionPills.forEach(function (suggestionPill) {
  suggestionPill.addEventListener("click", function () {
    chatInput.value = suggestionPill.textContent;
    chatInput.focus();
  });
});

function readPdf(file) {
  const reader = new FileReader();

  reader.onload = async function () {
    const typedArray = new Uint8Array(reader.result);

    const pdf = await pdfjsLib.getDocument(typedArray).promise;

    let extractedText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item) => item.str).join(" ");

      extractedText += pageText + "\n";
    }

    documentText = extractedText;
  };

  reader.readAsArrayBuffer(file);
}
