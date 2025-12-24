const form = document.getElementById("dataForm");
const tableBody = document
  .getElementById("dynamicTable")
  .getElementsByTagName("tbody")[0];
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
// Show toast notification
function showToast(message, type = "success") {
  toastMessage.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
// Generate avatar initials from name
function getAvatarInitials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
// Generate random user ID
function generateUserId() {
  return "USER" + Math.floor(1000 + Math.random() * 9000);
}
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const status = document.getElementById("status").value;
  if (name === "" || email === "") {
    showToast("Please fill in all required fields", "danger");
    return;
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Please enter a valid email address", "danger");
    return;
  }
  const newRow = tableBody.insertRow();
  // Add animation class
  newRow.style.opacity = "0";
  newRow.style.transform = "translateY(20px)";
  // Create cells
  const userCell = newRow.insertCell(0);
  const emailCell = newRow.insertCell(1);
  const statusCell = newRow.insertCell(2);
  const actionCell = newRow.insertCell(3);
  // Set data labels for mobile responsiveness
  userCell.setAttribute("data-label", "User");
  emailCell.setAttribute("data-label", "Email");
  statusCell.setAttribute("data-label", "Status");
  actionCell.setAttribute("data-label", "Actions");
  // User cell with avatar
  const avatarInitials = getAvatarInitials(name);
  userCell.innerHTML = `
        <div class="user-info">
          <div class="user-avatar">${avatarInitials}</div>
          <div class="user-details">
            <div class="user-name">${name}</div>
            <div class="user-email">${email}</div>
          </div>
        </div>
      `;
  // Email cell
  emailCell.textContent = email;
  // Status cell
  const statusClass = status === "active" ? "status-active" : "status-pending";
  statusCell.innerHTML = `<span class="status-badge ${statusClass}">${
    status.charAt(0).toUpperCase() + status.slice(1)
  }</span>`;
  // Action cell
  actionCell.innerHTML = `
        <div class="action-buttons">
          <button class="btn btn-warning btn-sm" onclick="editRow(this)">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
  // Animate row appearance
  setTimeout(() => {
    newRow.style.transition = "all 0.4s ease";
    newRow.style.opacity = "1";
    newRow.style.transform = "translateY(0)";
  }, 10);
  // Show success message
  showToast(`User "${name}" added successfully!`, "success");
  // Clear form
  form.reset();
  // Focus back on name field
  document.getElementById("name").focus();
});
function deleteRow(button) {
  const row = button.closest("tr");
  const userName = row.querySelector(".user-name").textContent;
  // Animate row removal
  row.style.transition = "all 0.3s ease";
  row.style.opacity = "0";
  row.style.transform = "translateX(100px)";
  setTimeout(() => {
    row.remove();
    showToast(`User "${userName}" deleted successfully!`, "danger");
    // Check if table is empty
    if (tableBody.rows.length === 0) {
      tableBody.innerHTML = `
            <tr>
              <td colspan="4" class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>No users found. Add your first user above!</p>
              </td>
            </tr>
          `;
    }
  }, 300);
}
function editRow(button) {
  const row = button.closest("tr");
  const name = row.querySelector(".user-name").textContent;
  const email = row.querySelector(".user-email").textContent;
  const status = row.querySelector(".status-badge").textContent.toLowerCase();
  // Populate form with row data
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("status").value = status;
  // Change button text
  const submitBtn = document.querySelector("#dataForm button[type='submit']");
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Update User';
  submitBtn.onclick = function (e) {
    e.preventDefault();
    updateRow(row);
  };
  // Focus on name field
  document.getElementById("name").focus();
  showToast(`Editing user "${name}"`, "warning");
}
function updateRow(row) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const status = document.getElementById("status").value;
  if (name === "" || email === "") {
    showToast("Please fill in all required fields", "danger");
    return;
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Please enter a valid email address", "danger");
    return;
  }
  // Update row data
  const avatarInitials = getAvatarInitials(name);
  row.querySelector(".user-avatar").textContent = avatarInitials;
  row.querySelector(".user-name").textContent = name;
  row.querySelector(".user-email").textContent = email;
  // Update email cell
  row.cells[1].textContent = email;
  // Update status
  const statusClass = status === "active" ? "status-active" : "status-pending";
  row.cells[2].innerHTML = `<span class="status-badge ${statusClass}">${
    status.charAt(0).toUpperCase() + status.slice(1)
  }</span>`;
  // Reset form and button
  form.reset();
  const submitBtn = document.querySelector("#dataForm button[type='submit']");
  submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add User';
  submitBtn.onclick = null;
  // Show success message
  showToast(`User "${name}" updated successfully!`, "success");
  // Animate row update
  row.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
  setTimeout(() => {
    row.style.backgroundColor = "";
  }, 1000);
}
// Initialize with empty state if no rows
document.addEventListener("DOMContentLoaded", function () {
  if (tableBody.rows.length === 0) {
    tableBody.innerHTML = `
          <tr>
            <td colspan="4" class="empty-state">
              <i class="fas fa-users-slash"></i>
              <p>No users found. Add your first user above!</p>
            </td>
          </tr>
        `;
  }
  // Add animation to table rows on load
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    row.style.opacity = "0";
    row.style.transform = "translateY(20px)";
    row.style.transitionDelay = `${index * 0.1}s`;
    setTimeout(() => {
      row.style.transition = "all 0.5s ease";
      row.style.opacity = "1";
      row.style.transform = "translateY(0)";
    }, 100);
  });
});
