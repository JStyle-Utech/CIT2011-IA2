// checks that all required fields are filled in and the email looks right
// before letting the form submit
function validateForm() {
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const github = document.getElementById("github").value.trim();

  if (!fullname || !email || !github) {
    alert("Please fill in all fields.");
    return false;
  }

  // basic email format check - not perfect but catches the obvious stuff
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }
  return true;
}

// grabs whatever's in the form and stores it so ticket.html can read it back
function saveToStorage() {
  const avatarInput = document.getElementById("avatar");
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const github = document.getElementById("github").value.trim();

  localStorage.setItem("fullname", fullname);
  localStorage.setItem("email", email);
  localStorage.setItem("github", github);

  // localStorage only holds text, so the uploaded image has to be converted
  // to a base64 string first with FileReader before it can be saved
  if (avatarInput.files && avatarInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("avatar", e.target.result);
    };
    reader.readAsDataURL(avatarInput.files[0]);
  }
}

// runs on ticket.html - pulls everything back out of localStorage
// and drops it into the right spots on the page
function populateTicket() {
  const fullname = localStorage.getItem("fullname");
  const github = localStorage.getItem("github");
  const avatar = localStorage.getItem("avatar");
  const ticketNumber = localStorage.getItem("ticketNumber");

  const fullnameDisplay = document.getElementById("fullname-display");
  const fullnameTicket = document.getElementById("fullname-ticket");
  const githubLink = document.getElementById("github-link");
  const avatarDisplay = document.getElementById("avatar-display");

  if (fullnameDisplay) fullnameDisplay.textContent = fullname;
  if (fullnameTicket) fullnameTicket.textContent = fullname;
  if (githubLink) {
    // makes sure the @ shows up even if the user typed it without one
    githubLink.textContent = github.startsWith("@") ? github : "@" + github;
    githubLink.href = `https://github.com/${github.replace("@", "")}`;
  }

  if (avatarDisplay && avatar) {
    avatarDisplay.src = avatar;
  }

  const ticketNumDisplay = document.querySelector(".ticket-info p");

  if (ticketNumDisplay) {
    ticketNumDisplay.textContent = "Generated: " + ticketNumber;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");

  // only login.html has a form, so this block just gets skipped
  // on the other two pages
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateForm()) {
        localStorage.setItem("ticketNumber", generateTicketNumber());
        saveToStorage();
        window.location.href = "ticket.html";
      }
    });
  }

  // this only exists on ticket.html, so it's a safe way to check
  // we're actually on that page before trying to populate anything
  if (document.getElementById("fullname-ticket")) {
    populateTicket();
  }
});

// makes up a random 5-digit ticket number, e.g. #72493
function generateTicketNumber() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return "#" + num;
}
