const url = 'http://localhost:3030/jsonstore/messenger'

function attachEvents() {
    document.getElementById('submit').addEventListener('click', sendInfo);
    document.getElementById('refresh').addEventListener('click', getInfo);
}

function sendInfo() {
    const authorElement = document.querySelector('input[name="author"]');
    const contentElement = document.querySelector('input[name="content"]');

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            author: authorElement.value,
            content: contentElement.value 
        }),
    };

    fetch(url, options)
        .then(res => {
            authorElement.value = '';
            contentElement.value = '';
        })
        .catch(err => console.log(err));
}

function getInfo() {
    fetch(url)
        .then(res => res.json())
        .then(infos => {
            document.getElementById('messages').value = 
                Object.values(infos)
                .map(({ author, content }) => `${author}: ${content}`)
                .join('\n');
        })
        .catch(err => console.log(err));
}
attachEvents();