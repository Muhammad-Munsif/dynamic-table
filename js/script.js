const form = document.getElementById("dataForm");
const tableBody = document.getElementById("dynamicTable").getElementsByTagName("tbody")[0];
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
let isEditing = false;
let currentEditRow = null;

// Store existing user data for duplicate checking
const existingUsers = new Set();

// Initialize existing users from sample data
function initializeExistingUsers() {
    const rows = tableBody.querySelectorAll("tr:not(.empty-state)");
    rows.forEach(row => {
        const email = row.querySelector(".user-email").textContent;
        existingUsers.add(email.toLowerCase());
    });
}

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

// Check for duplicate email
function isDuplicateEmail(email) {
    return existingUsers.has(email.toLowerCase());
}

// Get status class based on status value
function getStatusClass(status) {
    const statusMap = {
        'active': 'status-active',
        'pending': 'status-pending',
        'incomplete': 'status-incomplete',
        'in-progress': 'status-in-progress',
        'completed': 'status-completed'
    };
    return statusMap[status] || 'status-pending';
}

// Format status text
function formatStatusText(status) {
    return status.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Update sample data with new statuses
function updateSampleDataStatus() {
    const sampleRows = tableBody.querySelectorAll("tr");
    sampleRows.forEach(row => {
        const statusBadge = row.querySelector(".status-badge");
        if (statusBadge) {
            const currentStatus = statusBadge.textContent.toLowerCase();
            if (currentStatus === 'active') {
                statusBadge.className = "status-badge status-completed";
                statusBadge.textContent = "Completed";
            } else if (currentStatus === 'pending') {
                statusBadge.className = "status-badge status-incomplete";
                statusBadge.textContent = "Incomplete";
            }
        }
    });
}

// Create empty state
function createEmptyState() {
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>No users found. Add your first user above!</p>
            </td>
        </tr>
    `;
}

// Reset form function
function resetForm() {
    form.reset();
    isEditing = false;
    currentEditRow = null;
    
    const submitBtn = document.querySelector("#dataForm button[type='submit']");
    submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add User';
    submitBtn.onclick = null; // Remove any custom onclick handler
}

// Add new user to table
function addNewUser(name, email, status) {
    // Check if table has empty state
    const emptyState = tableBody.querySelector(".empty-state");
    if (emptyState) {
        emptyState.remove();
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
    const statusClass = getStatusClass(status);
    const statusText = formatStatusText(status);
    statusCell.innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;

    // Action cell
    actionCell.innerHTML = `
        <div class="action-buttons">
            <button class="btn btn-warning btn-sm edit-btn">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm delete-btn">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    // Add event listeners to new buttons
    newRow.querySelector(".edit-btn").addEventListener("click", function() {
        editRow(this);
    });

    newRow.querySelector(".delete-btn").addEventListener("click", function() {
        deleteRow(this);
    });

    // Add email to existing users set
    existingUsers.add(email.toLowerCase());

    // Animate row appearance
    setTimeout(() => {
        newRow.style.transition = "all 0.4s ease";
        newRow.style.opacity = "1";
        newRow.style.transform = "translateY(0)";
    }, 10);

    // Show success message
    showToast(`User "${name}" added successfully!`, "success");

    // Clear form
    resetForm();

    // Focus back on name field
    document.getElementById("name").focus();
}

// Delete row function
function deleteRow(button) {
    const row = button.closest("tr");
    const userName = row.querySelector(".user-name").textContent;
    const userEmail = row.querySelector(".user-email").textContent;

    // Remove email from existing users set
    existingUsers.delete(userEmail.toLowerCase());

    // Animate row removal
    row.style.transition = "all 0.3s ease";
    row.style.opacity = "0";
    row.style.transform = "translateX(100px)";

    setTimeout(() => {
        row.remove();
        showToast(`User "${userName}" deleted successfully!`, "danger");

        // Check if table is empty
        if (tableBody.rows.length === 0) {
            createEmptyState();
        }
    }, 300);
}

// Edit row function
function editRow(button) {
    const row = button.closest("tr");
    const name = row.querySelector(".user-name").textContent;
    const email = row.querySelector(".user-email").textContent;
    const statusText = row.querySelector(".status-badge").textContent.toLowerCase().replace(/\s+/g, '-');

    // Store current email for duplicate checking during update
    currentEditRow = row;
    currentEditRow.dataset.originalEmail = email;

    // Populate form with row data
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("status").value = statusText;

    // Change to edit mode
    isEditing = true;
    const submitBtn = document.querySelector("#dataForm button[type='submit']");
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update User';

    showToast(`Editing user "${name}"`, "info");
    document.getElementById("name").focus();
}

// Update row function
function updateRow(row) {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const status = document.getElementById("status").value;
    const originalEmail = row.dataset.originalEmail;

    // Validation
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

    // Check for duplicate email (only if email changed)
    if (email.toLowerCase() !== originalEmail.toLowerCase() && isDuplicateEmail(email)) {
        showToast("Another user with this email already exists!", "danger");
        return;
    }

    // Update existing users set
    if (email.toLowerCase() !== originalEmail.toLowerCase()) {
        existingUsers.delete(originalEmail.toLowerCase());
        existingUsers.add(email.toLowerCase());
    }

    // Update row data
    const avatarInitials = getAvatarInitials(name);
    row.querySelector(".user-avatar").textContent = avatarInitials;
    row.querySelector(".user-name").textContent = name;
    row.querySelector(".user-email").textContent = email;

    // Update email cell
    row.cells[1].textContent = email;

    // Update status
    const statusClass = getStatusClass(status);
    const statusText = formatStatusText(status);
    row.cells[2].innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;

    // Reset form
    resetForm();

    // Show success message
    showToast(`User "${name}" updated successfully!`, "success");

    // Animate row update
    row.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
    setTimeout(() => {
        row.style.backgroundColor = "";
    }, 1000);
}

// Form submission handler
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const status = document.getElementById("status").value;

    // Validation
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

    // Check for duplicate email (only when adding new, not editing)
    if (!isEditing && isDuplicateEmail(email)) {
        showToast("User with this email already exists!", "danger");
        return;
    }

    if (isEditing && currentEditRow) {
        updateRow(currentEditRow);
    } else {
        addNewUser(name, email, status);
    }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    // Update sample data with new statuses
    updateSampleDataStatus();

    // Initialize existing users set
    initializeExistingUsers();

    // Add event listeners to existing buttons
    const editButtons = document.querySelectorAll(".btn-warning");
    const deleteButtons = document.querySelectorAll(".btn-danger");

    editButtons.forEach(button => {
        button.addEventListener("click", function() {
            editRow(this);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            deleteRow(this);
        });
    });

    // Add initial animation to table rows
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

    // Add form reset on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isEditing) {
            resetForm();
            showToast("Edit cancelled", "warning");
        }
    });

    // Check if table is empty initially
    if (tableBody.rows.length === 0) {
        createEmptyState();
    }
});