 // Form toggle
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const createAcc = document.getElementById('createAcc');
const goLogin = document.getElementById('goLogin');
const formTitle = document.getElementById('formTitle');

createAcc.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  formTitle.textContent = "Create Account";
});

goLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  formTitle.textContent = "Welcome Back";
});

// Login submit
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const type = document.getElementById('loginType').value;
  if(username){
    localStorage.setItem('loggedUser', username);
    localStorage.setItem('userType', type);
    window.location.href = "/Home";
  }
});

// Register submit
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newUser = document.getElementById('newName').value.trim();
  const type = document.getElementById('registerType').value;
  localStorage.setItem('loggedUser', newUser);
  localStorage.setItem('userType', type);
  window.location.href = "index.html";
});

// Navbar update
const userSection = document.getElementById('user-section');
const loggedUser = localStorage.getItem('loggedUser');
const userType = localStorage.getItem('userType');

if (loggedUser) {
  userSection.innerHTML = `
    <div class="flex items-center gap-2 font-medium text-[#1e2d4d]">
      <i class="fa-solid fa-user text-[#25408f]"></i> ${loggedUser}
      ${userType === 'admin' ? '<a href="admin.html" class="ml-4 text-[#25408f] hover:underline">Admin Dashboard</a>' : ''}
      <button id="logout-btn" class="ml-3 text-sm text-[#25408f] hover:underline">Logout</button>
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('userType');
    location.reload();
  });
}
