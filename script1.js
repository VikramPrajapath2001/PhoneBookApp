let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editingContactId = null;

function showView(view) {
    const content = document.getElementById("content");
    
  
    switch (view) {
      case "home":
        content.innerHTML = `
        
          <div class="card">
            <h3>Phone Book Application</h3>
            <p>Welcome to contact management system</p>
            <div class="image-container">
                <img src="https://i.pinimg.com/736x/6c/99/97/6c9997ef2fef597426700a1744d59341--old-mans-the-streets.jpg" width="200px" height="200px">
            </div>

            <table>
              <tr><td>id</td><td>1</td></tr>
              <tr><td>First Name</td><td>Henry</td></tr>
              <tr><td>Last Name</td><td>Potter</td></tr>
              <tr><td>gender</td><td>male</td></tr>
              <tr><td>date-of-birth</td><td>23/11/1990</td></tr>
              <tr><td>Email address</td><td>fdhdhdgyg@cdn.com</td></tr>
              <tr><td>Phone number</td><td>9198765432</td></tr>
              <tr><td>city</td><td>chicago</td></tr>
              <tr><td>state</td><td>california</td></tr>
              <tr><td>country</td><td>united states</td></tr>
              <tr>
                <td><button class="edit-btn">edit</button></td>
                <td><button class="delete-btn">delete</button></td>
              </tr>
            </table>
          </div>
        `;
        break;
      case "list":
        renderContactList();
        break;
      case "add":
        renderContactForm();
        break;
    }
  }
  

function renderContactList() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Contact List</h2>
    ${contacts
      .map(
        (contact) => `
          <div class="contact-card">
            <img src="${contact.avatar || 'images/laptop.jpg'}" alt="${contact.firstname} ${contact.lastname}">
            <div>
              <h3>${contact.firstname} ${contact.lastname}</h3>
              <p>${contact.country}</p>
              <button class="btn btn-success" onclick="editContact(${contact.id})">Edit</button>
              <button type="button" class="btn btn-danger" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
          </div>
        `
      )
      .join("") || "<p>No contacts found</p>"}
  `;
}

function renderContactForm(contact = {}) {
  const content = document.getElementById("content");
  editingContactId = contact.id;
  content.innerHTML = `
    <h2>${contact.id ? "Edit Contact" : "Add New Contact"}</h2>
    <form id="contactForm" onsubmit="saveContact(event)">
      <input type="text" name="firstname" placeholder="First Name" value="${contact.firstname || ""}" required>
      <input type="text" name="lastname" placeholder="Last Name" value="${contact.lastname || ""}" required>
      <select name="gender" required>
        <option value="">Select Gender</option>
        <option value="Male" ${contact.gender === "Male" ? "selected" : ""}>Male</option>
        <option value="Female" ${contact.gender === "Female" ? "selected" : ""}>Female</option>
        <option value="Other" ${contact.gender === "Other" ? "selected" : ""}>Other</option>
      </select>
      <input type="date" name="dob" value="${contact.dob || ""}" required>
      <input type="email" name="email" placeholder="Email" value="${contact.email || ""}" required>
      <input type="tel" name="phone" placeholder="Phone" pattern="[0-9]{10}" value="${contact.phone || ""}" required>
      <input type="text" name="city" placeholder="City" value="${contact.city || ""}" required>
      <input type="text" name="state" placeholder="State" value="${contact.state || ""}" required>
      <input type="text" name="country" placeholder="Country" value="${contact.country || ""}" required>
      <input type="file" name="avatar" accept="image/*" ${contact.avatar ? "" : "required"}>
      <button type="submit">${contact.id ? "Update" : "Add"} Contact</button>
    </form>
  `;
}

function saveContact(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const contact = Object.fromEntries(formData.entries());

  const fileInput = form.querySelector('input[name="avatar"]');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      contact.avatar = e.target.result; 
      saveContactToLocalStorage(contact);
    };
    reader.readAsDataURL(file);
  } else {
    saveContactToLocalStorage(contact);
  }
}

function saveContactToLocalStorage(contact) {
  if (editingContactId) {
    const index = contacts.findIndex((c) => c.id === editingContactId);
    contact.id = editingContactId;
    contacts[index] = contact;
  } else {
    contact.id = contacts.length ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;
    contacts.push(contact);
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));
  showView("list");
}

function editContact(id) {
  const contact = contacts.find((c) => c.id === id);
  renderContactForm(contact);
}

function deleteContact(id) {
  contacts = contacts.filter((contact) => contact.id !== id);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContactList();
}

showView("home");
