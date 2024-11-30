const API_URL = 'https://jsonplaceholder.typicode.com/users';
const userList = document.getElementById('userList');
const userForm = document.getElementById('userForm');
const form = document.getElementById('form');
const userIdInput = document.getElementById('userId');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const formTitle = document.getElementById('formTitle');
const addUserBtn = document.getElementById('addUser Btn');
const cancelBtn = document.getElementById('cancelBtn');

let users = [];


async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        users = await response.json();
        displayUsers();
    } catch (error) {
        alert('Error fetching users: ' + error.message);
    }
}


function displayUsers() {
    userList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.innerHTML = `
            <strong>ID:</strong> ${user.id} <br>
            <strong>First Name:</strong> ${user.name.split(' ')[0]} <br>
            <strong>Last Name:</strong> ${user.name.split(' ')[1]} <br>
            <strong>Email:</strong> ${user.email} <br>
            <strong>Department:</strong> ${user.department || 'N/A'} <br>
            <button onclick="editUser (${user.id})">Edit</button>
            <button onclick="deleteUser (${user.id})">Delete</button>
        `;
        userList.appendChild(userDiv);
    });
}


addUserBtn.addEventListener('click', () => { 
    userForm.classList.remove('hidden');
    formTitle.innerText = 'Add User';
    resetForm();
});


function editUser (id) {
    const user = users.find(u => u.id === id);
    userIdInput.value = user.id;
    firstNameInput.value = user.name.split(' ')[0];
    lastNameInput.value = user.name.split(' ')[1];
    emailInput.value = user.email;
    departmentInput.value = user.department || '';
    userForm.classList.remove('hidden');
    formTitle.innerText = 'Edit User';
}


async function deleteUser  (id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        users = users.filter(user => user.id !== id);
        displayUsers();
    } catch (error) {
        alert('Error deleting user: ' + error.message);
    }
}


function resetForm() {
    userIdInput.value = '';
    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    departmentInput.value = '';
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = userIdInput.value;

    const userData = {
        name: `${firstNameInput.value} ${lastNameInput.value}`,
        email: emailInput.value,
        department: departmentInput.value
    };

    try {
        if (userId) {
        
            await fetch(`${API_URL}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const index = users.findIndex(user => user.id === parseInt(userId));
            users[index] = { ...users[index], ...userData };
        } else {
            
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            users.push({ id: users.length + 1, ...userData });
        }
        resetForm();
        userForm.classList.add('hidden');
        displayUsers();
    } catch (error) {
        alert('Error saving user: ' + error.message);
    }
});


cancelBtn.addEventListener('click', () => {
    resetForm();
    userForm.classList.add('hidden');
});


fetchUsers();