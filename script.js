const fileUpload = document.querySelector("#fileUpload");

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
    console.log(file);
  } else {
    console.log("File type is not valid");
  }
};
//As soon as file will be uploaded this event handler will be called and handleFileUpload function will be called
fileUpload.addEventListener("change", handleFileUpload);
