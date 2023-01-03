const url = 'http://localhost:3030/jsonstore/phonebook';

function attachEvents() {
    const load = document.getElementById('btnLoad');
    const phonebookElement = document.getElementById('phonebook');
    const create = document.getElementById('btnCreate');

    load.addEventListener('click', loadPhonebook)
    phonebookElement.addEventListener('click', deleteEntry)
    create.addEventListener('click', createEntry);
}

function createEntry() {
    let personElement = document.getElementById('person');
    let phoneElement = document.getElementById('phone');
    if (!personElement.value || !phoneElement.value) {
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ person: personElement.value, phone: phoneElement.value }),
    };

    fetch(url, options)
        .then(res => {
            loadPhonebook();
            personElement.value = '';
            phoneElement.value = ''
        })
        .catch(err => console.log(err));
}

function deleteEntry(e) {
    if (Array.from(e.target.classList).includes('btnDelete')) {
        fetch(`${url}/${e.target.parentNode.id}`, { method: 'DELETE' })
            .then(res => {
                e.target.parentNode.remove();
            })
            .catch(err => console.log(err));
    }
}

function loadPhonebook() {
    const phonebookElement = document.getElementById('phonebook');
    
    fetch(url)
    .then(res => res.json())
    .then(entries => {
        phonebookElement.replaceChildren();
        Object.values(entries).forEach(({ person, phone, _id }) => {
            const liEntry = document.createElement('li');
            liEntry.textContent = `${person}: ${phone}`;
            liEntry.id = _id;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btnDelete')
            liEntry.appendChild(deleteButton)

            phonebookElement.appendChild(liEntry);
        });
    })
    .catch(err => console.log(err));
}

attachEvents();