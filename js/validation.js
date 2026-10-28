/*
 * validation.js - used on login.html
 * Checks every field, shows errors right under each input,
 * then saves the data to localStorage and sends the user to the ticket.
 */

// rules kept in one place so they are easy to change
const MAX_AVATAR_SIZE = 500 * 1024; // 500KB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GITHUB_PATTERN = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

// puts an error message under a field, or clears it when message is empty
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "-error");

  error.textContent = message;
  // aria-invalid lets screen readers know the field has a problem
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

// full name is required and can't be only spaces
function validateName(value) {
  if (value.trim() === "") {
    return "Please enter your full name.";
  }
  return "";
}

// email has to look like user@domain.com
function validateEmail(value) {
  if (!EMAIL_PATTERN.test(value.trim())) {
    return "Please enter a valid email address.";
  }
  return "";
}

// github handle must start with @
function validateGithub(value) {
  if (!GITHUB_PATTERN.test(value.trim())) {
    return "Please enter a valid GitHub username starting with @.";
  }
  return "";
}

// avatar must exist, be a jpg/png and be under 500KB
function validateAvatar(file) {
  if (!file) {
    return "Please upload an avatar image.";
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "File must be a JPG or PNG image.";
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return "File too large. Please upload a photo under 500KB.";
  }
  return "";
}

// runs every check and returns true only if all of them pass
function validateForm() {
  const name = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const github = document.getElementById("github").value;
  const file = document.getElementById("avatar").files[0];

  const errors = {
    fullname: validateName(name),
    email: validateEmail(email),
    github: validateGithub(github),
    avatar: validateAvatar(file),
  };

  let allValid = true;
  let firstInvalid = null;

  for (const fieldId in errors) {
    setError(fieldId, errors[fieldId]);
    if (errors[fieldId] && allValid) {
      allValid = false;
      firstInvalid = fieldId;
    }
  }

  // move focus to the first problem so keyboard users land on it
  if (firstInvalid) {
    document.getElementById(firstInvalid).focus();
  }
  return allValid;
}

// makes a random 5 digit ticket number like #01609
function generateTicketNumber() {
  const num = Math.floor(Math.random() * 100000);
  return "#" + String(num).padStart(5, "0");
}

// localStorage only holds text, so the image is turned into base64 first
function saveToStorage(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const ticketData = {
      fullname: document.getElementById("fullname").value.trim(),
      email: document.getElementById("email").value.trim(),
      github: document.getElementById("github").value.trim(),
      avatar: event.target.result,
      ticketNumber: generateTicketNumber(),
    };

    localStorage.setItem("ticketData", JSON.stringify(ticketData));
    // only move on once the image has finished saving
    window.location.href = "ticket.html";
  };

  reader.readAsDataURL(file);
}

const form = document.getElementById("registration-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (validateForm()) {
    saveToStorage(document.getElementById("avatar").files[0]);
  }
});

// clear a field's error as soon as the user starts fixing it
form.addEventListener("input", function (event) {
  if (event.target.id) {
    setError(event.target.id, "");
  }
});
