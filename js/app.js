var url = window.location.href;
var swLocation = "/ProgramaOne-Oracle2024-encryption-tool/sw.js";

if (navigator.serviceWorker) {
  if (url.includes("localhost")) {
    swLocation = "/sw.js";
  }

  navigator.serviceWorker.register(swLocation);
}
