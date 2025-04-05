const form = document.getElementById("dataForm");
const tableBody = document.getElementById("dynamicTable").getElementsByTagName("tbody")[0];

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (name === "" || email === "") return;

  const newRow = tableBody.insertRow();

  const nameCell = newRow.insertCell(0);
  const emailCell = newRow.insertCell(1);
  const actionCell = newRow.insertCell(2);

  nameCell.setAttribute("data-label", "Name");
  emailCell.setAttribute("data-label", "Email");
  actionCell.setAttribute("data-label", "Action");

  nameCell.textContent = name;
  emailCell.textContent = email;
  actionCell.innerHTML = `<button class="btn delete" onclick="deleteRow(this)">Delete</button>`;

  // Clear form
  form.reset();
});

function deleteRow(button) {
  const row = button.closest("tr");
  row.remove();
}