window.addEventListener('load', () => {
    let form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let formData = new FormData(e.currentTarget);
        let name = formData.get('name');
        let img = formData.get('img');
        let ingredients = formData.get('ingredients').split('\n');
        let steps = formData.get('steps').split('\n');

        const data = {name, img, ingredients, steps};
        let options = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': localStorage.getItem('authToken'),
            },
            body: JSON.stringify(data),
        };

        fetch('http://localhost:3030/data/recipes', options)
            .then(res => res.json())
            .then(res => {
                if (res.code) {
                    alert(res.message)
                } else {
                    location.href = '/'
                }
            })
            .catch(err => console.log(err));
    });
});