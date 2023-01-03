const url = 'http://localhost:3030/jsonstore/collections/students';

window.addEventListener('load', () => {
    document.getElementById('submit').addEventListener('click', saveStudent);
    loadStudents();
});

async function saveStudent(e) {
    e.preventDefault();
    const form = document.getElementById('form');
    const formData = new FormData(form);
    
    let firstName = formData.get('firstName');
    let lastName = formData.get('lastName');
    let facultyNumber = formData.get('facultyNumber');
    let grade = formData.get('grade');
    let gradeNum = Number(grade);

    let alertMessages = [];
    if (firstName === '' || lastName === '' || facultyNumber === '' || grade === '') {
        alertMessages.push('Please fill all fields.');
    }
    if (!(/^\d+$/.test(facultyNumber))) {
        alertMessages.push('The faculty number must contain only digits.');
    }
    if (!gradeNum) {
        alertMessages.push('Grade must be a number');    
    }

    if (alertMessages.length !== 0) {
        alert(alertMessages.join('\n'));
        return;
    }

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, facultyNumber, grade: gradeNum }),
        });

        Array.from(form.querySelectorAll('.inputs input'))
            .forEach(x => x.value = '');
        
        loadStudents();
    } catch (err) {
        alert(err.message);
    }
}

async function loadStudents() {
    const tableBody = document.querySelector('#results tbody');
    tableBody.replaceChildren();
    let students = undefined;

    try {
        const studentsString = await fetch(url);
        students = await studentsString.json();
    } catch (err) {
        alert(err.message);
    }
    
    Object.values(students || []).forEach(student => {
        let personRow = 
        e('tr', '', 
            e('th', student.firstName),
            e('th', student.lastName),
            e('th', student.facultyNumber),
            e('th', student.grade)
        );

        tableBody.appendChild(personRow);
    })
}

function e(type, text, ...children) {
    let el = document.createElement(type);
    
    el.textContent = text;
    
    Array.from(children || []).forEach(x => el.appendChild(x));

    return el;
}