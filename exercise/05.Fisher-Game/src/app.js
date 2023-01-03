const logoutUrl = 'http://localhost:3030/users/logout';
const authorizationUrl = 'http://localhost:3030/users/me';
const catchesBaseUrl = 'http://localhost:3030/data/catches';
const user = JSON.parse(localStorage.getItem('user'));
console.log(user);

window.addEventListener('load', () => {
    authorize();
    document.getElementById('logout').addEventListener('click', logoutUser);
    document.getElementById('catches').addEventListener('click', performCatchAction)
    document.querySelector('#home-view aside button.load').addEventListener('click', loadCatches);
    document.querySelector('#addForm fieldset button.add').addEventListener('click', addCatch);
    loadCatches();
});


function performCatchAction(e) {
    let classList = Array.from(e.target.classList)
    if (classList.includes('update')) {
        updateCatch(e.target.parentNode, e.target.getAttribute('data-id'));
    } else if (classList.includes('delete')) {
        deleteCatch(e.target.parentNode, e.target.getAttribute('data-id'));
    }
}

function deleteCatch(catchElement, id) {
    if (!user) {
        return;
    }

    let options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': user.accessToken,
        }
    }

    fetch(`${catchesBaseUrl}/${id}`, options)
        .then(res => {
            catchElement.remove();
        })
        .catch(err => console.log(err));
}

function updateCatch(catchElement, id) {
    if (!user) {
        return;
    }

    let data = {_id: id, _ownerId: catchElement.getAttribute('owner-id')};

    let inputs = catchElement.querySelectorAll('input');
    Array.from(inputs).forEach(input => data[input.className] = input.value)
    
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': user.accessToken,
        },
        body: JSON.stringify(data),
    }

    fetch(`${catchesBaseUrl}/${id}`, options)
        .catch(err => console.log(err));
}

function addCatch(e) {
    e.preventDefault();
    if (!user) {
        return;
    }

    let form = document.getElementById('addForm');
    let formData = new FormData(form);

    const angler = formData.get('angler');
    const weight = formData.get('weight');
    const species = formData.get('species');
    const location = formData.get('location');
    const bait = formData.get('bait');
    const captureTime = formData.get('captureTime');
    
    if (angler === '' || 
        weight === '' ||
        species === '' ||
        location === '' ||
        bait === '' ||
        captureTime === '') {

        alert('Please fill in all fields with correct information');
        return;
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({ angler, weight, species, location, bait, captureTime }),
    }

    fetch(catchesBaseUrl, options)
        .then(res => {
            if (res.code) {
                throw new Error('Error while creating catch.');
            } else {
                Array.from(form.querySelectorAll('input')).forEach(x => x.value = '')
                loadCatches();
            }
        })
        .catch(err => console.log(err));
}

async function loadCatches() {
    let catchesElement = document.getElementById('catches');
    catchesElement.style.display = 'none';

    let catches = undefined;
    try {
        let catchesString = await fetch(catchesBaseUrl)
        catches = await catchesString.json();
    } catch (err) {
        console.log('Load catches: ' + err);
    } finally {
        catchesElement.style.display = 'block';
    }

    if (!catches) {
        return;
    }

    catchesElement.replaceChildren();
    Array.from(catches).forEach(_catch => {
        let disabled = user ? !(user._id === _catch._ownerId) : true;
        catchesElement.appendChild(createCatchDOM(_catch, disabled));
    });
}

function createCatchDOM(_catch, disabled) {
    return e('div', '', { className: 'catch', 'owner-id': _catch._ownerId },
        e('label', 'Angler'),
        e('input', _catch.angler, { type: 'text', className: 'angler', disabled }),
        e('label', 'Weight'),
        e('input', _catch.weight, { type: 'text', className: 'weight', disabled }),
        e('label', 'Species'),
        e('input', _catch.species, { type: 'text', className: 'species', disabled }),
        e('label', 'Location'),
        e('input', _catch.location, { type: 'text', className: 'location', disabled }),
        e('label', 'Bait'),
        e('input', _catch.bait, { type: 'text', className: 'bait', disabled }),
        e('label', 'Capture Time'),
        e('input', _catch.captureTime, { type: 'number', className: 'captureTime', disabled }),
        e('button', 'Update', { className: 'update', 'data-id': _catch._id, disabled }),
        e('button', 'Delete', { className: 'delete', 'data-id': _catch._id, disabled })
    );
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
        headers: {'X-Authorization': user.accessToken}
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
                let addBtn = document.querySelector('#addForm fieldset button.add');
                addBtn.removeAttribute('disabled');
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

function e(type, text, attributes, ...children) {
    let el = document.createElement(type);

    type === 'input' ? el.value = text : el.textContent = text;

    Object.entries(attributes || {}).forEach(([k, v]) => {
        k === 'owner-id' || k === 'data-id' ? el.setAttribute(k, v) : el[k] = v
    });

    Array.from(children || []).forEach(child => el.appendChild(child));

    return el;
}