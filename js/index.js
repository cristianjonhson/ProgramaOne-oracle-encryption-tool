/**  elementos en el DOM que se ocupan globalmente. **/
const btnCrear = document.querySelector("#btnCrear");
const inputValue = document.querySelector("#textbox");
const finalMessage = document.querySelector("#message");
const buttonEncrypt = document.querySelector("#buttonEncrypt");
const buttonDisableEncrypt = document.querySelector("#buttonDisabled");
const copyButton = document.querySelector("#copyButton");
const copyButtonKey = document.querySelector("#copyKey");
const wrapperForm = document.querySelector("#wrapperSecret");
let ownSecretKey = undefined;
// Fin de los elementos globales

/**Secret key object */
const password = {
  a: "ai",
  e: "enter",
  i: "imes",
  o: "ober",
  u: "ufat",
  vowelA: "ai",
  vowelE: "enter",
  vowelI: "imes",
  vowelO: "ober",
  vowelU: "ufat",
};
/**Inicio de las diferentes funciones para ejecutar segun la situacion */

// función que asigna nuevos valores por referencia al objeto password.
const handleSendSecretKey = () => {
  const inputVowels = document.querySelectorAll("input");
  if (validateInputs(inputVowels)) {
    inputVowels.forEach((input) => {
      const id = input.name.substring(5).toLocaleLowerCase();
      password[id] = input.value.trim().toLocaleLowerCase();
      password[input.name] = input.value.trim().toLocaleLowerCase();
      handleCleaneInputs(input);
    });
    wrapperForm.classList.remove("visible");
    inputValue.classList.remove("hidden");
    ownSecretKey = JSON.stringify({
      a: password["a"],
      e: password["e"],
      i: password["i"],
      o: password["o"],
      u: password["u"],
    });
  } else {
    handleActivateAlert("Valida tus llaves, No mayúsculas y acentos", true);
  }
};
// Función que oculta y muestra el formulario, input del formulario.
const handleCreateOwnKey = () => {
  wrapperForm.classList.toggle("visible");
  inputValue.classList.toggle("hidden");
  const form = document.querySelector("#form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendSecretKey();
  });
};
//Función que maneja el texto y el estado de la tarjeta de ecriptación.
const handleStatusMessage = (text = "", isEncripted = false) => {
  const titleCard = document.querySelector("#titleCard");
  const imgCard = document.querySelector("#imgCard");
  if (text.trim() === "") {
    imgCard.classList.remove("hidden");
    titleCard.innerText = "Ningún mensaje fue encontrado";
    finalMessage.innerText =
      "Ingrese un texto que desees encriptar o desencriptar.";
  } else if (text.trim() !== "" && !isEncripted) {
    imgCard.classList.add("hidden");
    titleCard.innerText = "El mensaje secreto es:";
    finalMessage.innerText = text;
  } else {
    imgCard.classList.add("hidden");
    titleCard.innerText = "mensaje encriptado:";
    finalMessage.innerText = text;
  }
};
// Función encargada de habilitar y deshabilitar el botón de copiar texto.
const handleStatusCopyButton = (type = "message", status = true) => {
  if (type !== "message" && ownSecretKey !== undefined) {
    copyButtonKey.disabled = status;
  } else {
    copyButton.disabled = status;
  }
};
// Función encargada de encryptar texto del textArea, además de validaciones del text (vacio, y sin mayusculas o acentos)
const handleEncryptText = () => {
  if (inputValue.value === "") {
    handleActivateAlert("No puedes encriptar un campo vacio.", true);
  } else if (inputValue.value.search(/[^a-z \u00f1 \s !?,.]/) !== -1) {
    handleActivateAlert("Valida tu texto sin mayusculas o acentos.", true);
  } else {
    let encryptText = "";
    const textValue = inputValue.value;
    let arrayText = [...textValue];
    arrayText = arrayText.map((letter) => {
      return password[letter] || letter;
    });
    arrayText.forEach((element) => {
      encryptText = encryptText + element;
    });
    handleActivateAlert();
    handleStatusMessage(encryptText, true);
    handleCleaneInputs(inputValue);
    handleStatusCopyButton("message", false);
    handleStatusCopyButton("key", false);
  }
};
// Función encargada de descriptar textos además de validación de texto vacio.
const handleDesencryptText = () => {
  if (inputValue.value === "") {
    handleActivateAlert("No puedes desencriptar un campo vacio.", true);
  } else {
    let message = inputValue.value;
    message = message.replaceAll(password.vowelA, "a");
    message = message.replaceAll(password.vowelE, "e");
    message = message.replaceAll(password.vowelI, "i");
    message = message.replaceAll(password.vowelO, "o");
    message = message.replaceAll(password.vowelU, "u");
    handleStatusMessage(message, false);
    handleCleaneInputs(inputValue);
    handleStatusCopyButton("message", false);
    handleStatusCopyButton("key", false);
  }
};
// fuction
// Función encargada de copiar texto al clipboard del navegador.
const handleCopyText = (type = "message") => {
  if (type === "message") {
    const copiedText = finalMessage.innerText;
    navigator.clipboard.writeText(copiedText);
    handleStatusMessage();
    handleStatusCopyButton(type, true);
  } else {
    navigator.clipboard.writeText(ownSecretKey);
    handleStatusMessage();
    handleStatusCopyButton("key", true);
  }
};

// Eventos que ocurren y las funciones que se ejecutan
btnCrear.addEventListener("click", () => handleCreateOwnKey());
buttonEncrypt.addEventListener("click", () => handleEncryptText());
buttonDisableEncrypt.addEventListener("click", () => handleDesencryptText());
copyButton.addEventListener("click", () => handleCopyText());
copyButtonKey.addEventListener("click", () => handleCopyText("key"));
