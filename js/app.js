//Form validation
function validateForm() {
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const github = document.getElementById("github").value.trim();

  if (!fullname || !email || !github) {
    alert("Please fill in all fields.");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }
  return true;
}

//Save form data to local storage
function saveToStorage() {
  const avatarInput = document.getElementById("avatar");
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const github = document.getElementById("github").value.trim();

  localStorage.setItem("fullname", fullname);
  localStorage.setItem("email", email);
  localStorage.setItem("github", github);

  if (avatarInput.files && avatarInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("avatar", e.target.result);
    };
    reader.readAsDataURL(avatarInput.files[0]);
  }
}

//Populate ticket.html with saved data
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

  if (document.getElementById("fullname-ticket")) {
    populateTicket();
  }
});

function generateTicketNumber() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return "#" + num;
}
