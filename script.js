const fileUpload = document.querySelector("#fileUpload");
const docList = document.querySelector(".doc-list");
let documentText = "";
const chatInput = document.querySelector("#chatInput");
const sendBtn = document.querySelector("#sendBtn");
const chatArea = document.querySelector("#chatArea");

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
function handleSendMessage() {
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
  chatInput.value = "";
  chatInput.focus();
}
function displayUserMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message user-message");
  const p = document.createElement("p");
  p.textContent = message;
  div.appendChild(p);
  chatArea.appendChild(div);
}
sendBtn.addEventListener("click", handleSendMessage);
