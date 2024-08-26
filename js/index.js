/** Elementos en el DOM que se ocupan globalmente. **/
const btnCrear = document.querySelector("#btnCrear"); 
const inputValue = document.querySelector("#textbox"); 
const finalMessage = document.querySelector("#message");
const buttonEncrypt = document.querySelector("#buttonEncrypt");
const buttonDisableEncrypt = document.querySelector("#buttonDisabled");
const copyButton = document.querySelector("#copyButton");
const copyButtonKey = document.querySelector("#copyKey");
const wrapperForm = document.querySelector("#wrapperSecret");
const form = document.querySelector("#form");
const titleCard = document.querySelector("#titleCard");
const imgCard = document.querySelector("#imgCard");
let ownSecretKey = undefined; // Variable para almacenar la llave secreta creada por el usuario

/** Mapa para encriptar y desencriptar **/
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

// Mensajes de error predefinidos
const ERROR_EMPTY_FIELD = "No puedes encriptar un campo vacío.";
const ERROR_INVALID_TEXT = "Valida tu texto sin mayúsculas o acentos.";

/** Validaciones **/

/**
 * Verifica si el texto contiene solo letras minúsculas, espacios y caracteres permitidos.
 * @param {string} text - El texto a validar.
 * @returns {boolean} - Retorna true si el texto es válido, false en caso contrario.
 */
const validateText = (text) => {
  const regex = /^[a-z\s!?.,\u00f1]*$/; // Solo letras minúsculas, espacios, y caracteres permitidos
  return regex.test(text);
};

/**
 * Muestra un mensaje de error en la interfaz de usuario.
 * @param {string} message - El mensaje de error a mostrar.
 */
const handleError = (message) => {
  handleActivateAlert(message, true);
};

/** Funciones de encriptado y desencriptado **/

/**
 * Encripta un carácter según el mapa de encriptación definido.
 * @param {string} char - El carácter a encriptar.
 * @returns {string} - El carácter encriptado.
 */
const encryptCharacter = (char) => password[char] || char;

/**
 * Desencripta el texto encriptado según el mapa de encriptación definido.
 * @param {string} text - El texto a desencriptar.
 * @returns {string} - El texto desencriptado.
 */
const decryptText = (text) => {
  return text.replaceAll(password.vowelA, "a")
             .replaceAll(password.vowelE, "e")
             .replaceAll(password.vowelI, "i")
             .replaceAll(password.vowelO, "o")
             .replaceAll(password.vowelU, "u");
};

/** Funciones de manejo de UI **/

/**
 * Envía y guarda la llave secreta personalizada creada por el usuario.
 */
const handleSendSecretKey = () => {
  const inputVowels = document.querySelectorAll("input"); // Captura todos los inputs de la llave secreta
  if (validateInputs(inputVowels)) {
    inputVowels.forEach((input) => {
      const id = input.name.substring(5).toLocaleLowerCase(); // Obtiene la vocal del nombre del input
      password[id] = input.value.trim().toLocaleLowerCase();  // Asigna el valor del input al mapa de encriptación
      password[input.name] = input.value.trim().toLocaleLowerCase(); // Actualiza también las claves internas del objeto
      handleCleaneInputs(input); // Limpia los inputs después de asignar los valores
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
    handleError(ERROR_INVALID_TEXT);
  }
};

/**
 * Muestra u oculta el formulario para crear una llave secreta personalizada.
 */
const handleCreateOwnKey = () => {
  wrapperForm.classList.toggle("visible"); // Alterna la visibilidad del formulario
  inputValue.classList.toggle("hidden"); // Oculta o muestra el campo de texto principal
  initializeFormEvents(); // Inicializa los eventos del formulario
};

/**
 * Muestra el mensaje encriptado o desencriptado en la interfaz de usuario.
 * @param {string} text - El texto a mostrar.
 * @param {boolean} isEncripted - Indica si el texto es encriptado o desencriptado.
 */
const handleStatusMessage = (text = "", isEncripted = false) => {
  if (text.trim() === "") {
    imgCard.classList.remove("hidden");
    titleCard.innerText = "Ningún mensaje fue encontrado";
    finalMessage.innerText = "Ingrese un texto que desees encriptar o desencriptar.";
  } else if (text.trim() !== "" && !isEncripted) {
    imgCard.classList.add("hidden");
    titleCard.innerText = "El mensaje secreto es:";
    finalMessage.innerText = text;
  } else {
    imgCard.classList.add("hidden");
    titleCard.innerText = "Mensaje encriptado:";
    finalMessage.innerText = text;
  }
};

/**
 * Habilita o deshabilita el botón de copia según el tipo de texto (mensaje o llave).
 * @param {string} type - Tipo de texto ("message" o "key").
 * @param {boolean} status - Estado del botón (true para deshabilitar, false para habilitar).
 */
const handleStatusCopyButton = (type = "message", status = true) => {
  if (type !== "message" && ownSecretKey !== undefined) {
    copyButtonKey.disabled = status;
  } else {
    copyButton.disabled = status;
  }
};

/**
 * Encripta el texto ingresado por el usuario.
 */
const handleEncryptText = () => {
  const textValue = inputValue.value.trim();
  if (!validateText(textValue)) {
    return handleError(ERROR_INVALID_TEXT);
  }
  if (textValue === "") {
    return handleError(ERROR_EMPTY_FIELD);
  }

  const encryptText = [...textValue].map(encryptCharacter).join("");
  handleActivateAlert();
  handleStatusMessage(encryptText, true);
  handleCleaneInputs(inputValue);
  handleStatusCopyButton("message", false);
  handleStatusCopyButton("key", false);
};

/**
 * Desencripta el texto ingresado por el usuario.
 */
const handleDesencryptText = () => {
  const textValue = inputValue.value.trim();
  if (textValue === "") {
    return handleError(ERROR_EMPTY_FIELD);
  }

  const message = decryptText(textValue);
  handleStatusMessage(message, false);
  handleCleaneInputs(inputValue);
  handleStatusCopyButton("message", false);
  handleStatusCopyButton("key", false);
};

/**
 * Copia el texto (mensaje o llave secreta) al portapapeles.
 * @param {string} type - Tipo de texto ("message" o "key") a copiar.
 */
const handleCopyText = (type = "message") => {
  const cb = navigator.clipboard;
  if (type === "message") {
    const paragraph = finalMessage.textContent;
    cb.writeText(paragraph).then(() =>
      handleActivateAlert("Copiado al portapapeles")
    );
  } else {
    cb.writeText(ownSecretKey).then(() =>
      handleActivateAlert("Llave secreta copiada")
    );
  }
};

/**
 * Muestra una alerta en la interfaz de usuario.
 * @param {string} message - El mensaje de alerta a mostrar.
 * @param {boolean} error - Indica si la alerta es un error (true) o un éxito (false).
 */
const handleActivateAlert = (
  message = "Texto encriptado con éxito!",
  error = false
) => {
  const alerta = document.querySelector("#alerta");
  if (error) {
    alerta.classList.remove("success");
    alerta.classList.add("danger");
  } else {
    alerta.classList.remove("danger");
    alerta.classList.add("success");
  }
  alerta.innerText = message;
  alerta.classList.add("visible");
  setTimeout(() => {
    alerta.classList.remove("visible");
  }, 5000);
};

/**
 * Limpia el valor de un input.
 * @param {HTMLInputElement} input - El input a limpiar.
 */
const handleCleaneInputs = (input) => {
  input.value = "";
};

/**
 * Inicializa los eventos del formulario para capturar la llave secreta personalizada.
 */
const initializeFormEvents = () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendSecretKey();
  });
};

/** Eventos principales de la aplicación **/
btnCrear.addEventListener("click", handleCreateOwnKey);
buttonEncrypt.addEventListener("click", handleEncryptText);
buttonDisableEncrypt.addEventListener("click", handleDesencryptText);
copyButton.addEventListener("click", () => handleCopyText("message"));
copyButtonKey.addEventListener("click", () => handleCopyText("key"));
