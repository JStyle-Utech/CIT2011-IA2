/*
 * ticket.js - used on ticket.html
 * Reads the saved registration and fills in the ticket.
 * If nothing is saved (someone opened this page directly) it
 * sends them back to the landing page.
 */

// pulls the saved registration out of localStorage, or null if missing/broken
function loadTicketData() {
  const saved = localStorage.getItem("ticketData");

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    // saved data was corrupted, treat it like there is none
    return null;
  }
}

// drops the saved details into the matching spots on the page
function populateTicket(data) {
  document.getElementById("fullname-display").textContent = data.fullname;
  document.getElementById("fullname-ticket").textContent = data.fullname;
  document.getElementById("email-display").textContent = data.email;
  document.getElementById("ticket-number").textContent = data.ticketNumber;
  document.getElementById("github-text").textContent = data.github;

  const link = document.getElementById("github-link");
  link.href = "https://github.com/" + data.github.replace("@", "");

  document.getElementById("avatar-display").src = data.avatar;
}

const ticketData = loadTicketData();

if (ticketData) {
  populateTicket(ticketData);
} else {
  // no data = nobody registered, so send them to the start
  window.location.replace("index.html");
}
