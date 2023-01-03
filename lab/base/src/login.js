window.addEventListener('load', () => {
    let form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let formData = new FormData(e.currentTarget);
        
        let email = formData.get('email');
        let password = formData.get('password');

        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        };

        fetch('http://localhost:3030/users/login', options)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.code) {
                    alert(res.message);
                } else {
                    localStorage.setItem('authToken', res.accessToken);
                    localStorage.setItem('username', res.username);
                    location.href = '/';
                }
            })
            .catch(err => console.log(err));
    });
});