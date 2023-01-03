const baseUrl = 'http://localhost:3030/jsonstore/collections/books';

window.addEventListener('load', () => {
    document.getElementById('loadBooks').addEventListener('click', loadAllBooks);
    document.getElementById('form').addEventListener('submit', submit);
    document.getElementById('table').addEventListener('click', performButtonAction);
    loadAllBooks();
})

async function submit(e) {
    e.preventDefault();
    const formClasses = Array.from(e.currentTarget.classList);

    if (formClasses.includes('formCreate')) {
        createBook(e.currentTarget, baseUrl);
    } else if (formClasses.includes('formEdit')) {
        let id = document.querySelector('#form button').className;
        editBook(e.currentTarget, `${baseUrl}/${id}`, id);
    }
}

async function loadAllBooks() {
    let tableBody = document.querySelector('#table tbody');
    tableBody.replaceChildren();
    
    let books = undefined;
    try {
        let booksString = await fetch(baseUrl);
        books = await booksString.json();  
    } catch (err) {
        alert(err.message);
    }

    Object.values(books || {}).forEach(book => {
        if (book._id) {
            let bookElement =
            e('tr', '', { id: book._id },
                e('td', book.author, { className: 'author' }),
                e('td', book.title, { className: 'title' }),
                e('td', '', {}, 
                    e('button', 'Edit', { className: 'btnEdit' }),
                    e('button', 'Delete', { className: 'btnDelete' })
                )
            );
            tableBody.appendChild(bookElement);
        }
    })
}

async function createBook(form, url) {
    const formData = new FormData(form);
    
    let title = formData.get('title');
    let author = formData.get('author');
    if (!title || !author) {
        alert('Please fill all fields');
        return;
    }

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author }),
        });
        
        Array.from(form.querySelectorAll('input')).forEach(x => x.value = '');
        loadAllBooks();
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}

async function editBook(form, url, id) {
    const formData = new FormData(form);
    
    let title = formData.get('title');
    let author = formData.get('author');
    if (!title || !author) {
        alert('Please fill all fields');
        return;
    }

    try {
        await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, _id: id }),
        });
        
        Array.from(form.querySelectorAll('input')).forEach(x => x.value = '');
        exitEditMode();
        loadAllBooks();
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}


async function performButtonAction(e) {
    let classList = Array.from(e.target.classList)

    if (classList.includes('btnDelete')) {
        let tr = e.target.parentNode.parentNode;

        await fetch(`${baseUrl}/${tr.id}`, {
            method: 'DELETE'
        })
        tr.remove();
    } else if (classList.includes('btnEdit')) {
        enterEditMode(e.target.parentNode.parentNode);
    }
}

function enterEditMode(tr) {
    let form = document.getElementById('form');

    form.querySelector('h3').textContent = `Edit FORM`;
    form.querySelector('button').className = tr.id;
    form.querySelector('#title').value = tr.querySelector('.title').textContent;
    form.querySelector('#author').value = tr.querySelector('.author').textContent;
    
    form.classList.add('formEdit');
    form.classList.remove('formCreate');
}

function exitEditMode() {
    let form = document.getElementById('form');

    form.querySelector('h3').textContent = `FORM`;
    form.querySelector('button').className = '';
    form.querySelector('#title').value = '';
    form.querySelector('#author').value = '';

    form.classList.add('formCreate');
    form.classList.remove('formEdit');
}

function e(type, text, attributes, ...children) {
    let el = document.createElement(type);
    el.textContent = text;

    Object.entries(attributes || {}).forEach(([k, v]) => el[k] = v);

    Array.from(children || []).forEach(child => el.appendChild(child));

    return el;
}