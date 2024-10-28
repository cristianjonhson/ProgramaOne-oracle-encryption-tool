const handleCleaneInputs = (item) => {
  item.value = "";
};

const handleActivateAlert = (
  text = "letras minúsculas y sin acentos",
  isError = false
) => {
  const alert = document.querySelector("#alert");
  isError ? alert.classList.add("warning") : (alert.className = "");
  alert.innerText = text;
};

const validateInputs = (arrayInputs) => {
  let status = true;
  arrayInputs.forEach((input) => {
    if (input.value.search(/[^a-z \u00f1]/) !== -1) {
      status = false;
    }
  });
  return status;
};
