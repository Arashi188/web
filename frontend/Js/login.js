function setLoginRole(role) {
    document.getElementById('loginTitle').textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
    document.getElementById('userRole').value = role;
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function showRoleSelection() {
    document.getElementById('roleSelection').style.display = 'grid';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('loginMessage').innerHTML = '';
}

async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const loginBtn = document.getElementById('loginText');
    const spinner = document.getElementById('loginSpinner');
    
    // Show loading state
    loginBtn.textContent = 'Logging in...';
    spinner.style.display = 'block';
    
    try {
        const response = await fetch('php/login_handler.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => {
                // Redirect based on role
                const role = document.getElementById('userRole').value;
                switch(role) {
                    case 'student':
                        window.location.href = 'student/dashboard.html';
                        break;
                    case 'teacher':
                        window.location.href = 'teacher/dashboard.html';
                        break;
                    case 'parent':
                        window.location.href = 'parent/dashboard.html';
                        break;
                    default:
                        window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Login failed: ' + error.message, 'error');
    } finally {
        loginBtn.textContent = 'Login';
        spinner.style.display = 'none';
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.innerHTML = message;
    messageDiv.className = `message ${type}`;
}