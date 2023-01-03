window.addEventListener('load', () => {
    let form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let formData = new FormData(e.currentTarget);
        
        let email = formData.get('email');
        let password = formData.get('password');
        let rePassword = formData.get('rePass');
        if (password != rePassword) {
            alert('Passwords dont match')
            return;
        }

        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        };

        fetch('http://localhost:3030/users/register', options)
            .then(res => res.json())
            .then(res => {
                if (res.code) {
                    alert(res.message)
                } else {
                    location.href = '/login.html'
                }
            })
            .catch(err => console.log(err));
    });
});
