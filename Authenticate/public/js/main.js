document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createUserForm').addEventListener('submit', function(e) {
        e.preventDefault();

        let userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            age: document.getElementById('age').value
        };

        console.log('Submitting user data:', userData);

        fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Error creating user');
            }
            return response.json();
        })
        .then(data => {
            window.location.href = '/login'; 
            console.log('Response data:', data);
            alert('User created successfully!');
        })
        .catch(error => {
            alert(error.message);
            console.error('Error:', error);
        });
    });
});
