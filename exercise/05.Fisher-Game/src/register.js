const logoutUrl = 'http://localhost:3030/users/logout';
const baseUrl = 'http://localhost:3030/users/register';
const authorizationUrl = 'http://localhost:3030/users/me';
const user = JSON.parse(localStorage.getItem('user'));

window.addEventListener('load', () => {
    authorize();
    document.getElementById('logout').addEventListener('click', logoutUser);
    document.getElementById('register-form').addEventListener('submit', registerUser); 
});

function registerUser(e) {
    e.preventDefault();
    let formData = new FormData(e.currentTarget);
    let email = formData.get('email');    
    let password = formData.get('password');
    let rePass = formData.get('rePass');
    
    if (email === '' || password === '' || rePass === '') {
        alert('Please fill all fields');
    }
    if (rePass !== password) {
        alert('Passwords dont match');
    }

    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'applicaiton/json' },
        body: JSON.stringify({ email, password }),
    };

    fetch(baseUrl, options)
        .then(res => res.json())
        .then(res => {
            if (res.code) {
                throw new Error(res.message);  
            }
            delete res._createdOn;
            localStorage.setItem('user', JSON.stringify(res));
            location.href = './index.html';
        })
        .catch(err => console.log(err.message));
}

function authorize() {
    sessionStorage.setItem('authorized', 'false');
    let userNav = document.getElementById('user')
    let guestNav = document.getElementById('guest')

    userNav.style.display = 'none';
    guestNav.style.display = 'none';

    if (!user) {
        guestNav.style.display = 'inline';
        return;
    }
    let options = {
        method: 'GET',
        headers: { 'X-Authorization': user.accessToken }
    };

    fetch(authorizationUrl, options)
        .then(res => {
            if (res.code) {
                guestNav.style = 'inline';
            } else {
                userNav.style = 'inline';
                sessionStorage.setItem('authorized', 'true');

                let welcome = document.querySelector('p.email span');
                welcome.textContent = user.email;
            }
        })
        .catch(err => console.log(err.message))
}

function logoutUser() {
    fetch(logoutUrl)
        .then(res => {
            localStorage.clear();
            sessionStorage.clear();
            location.href = './';
        })
        .catch(err => console.log(err))
}