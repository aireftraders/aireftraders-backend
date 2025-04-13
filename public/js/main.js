document.addEventListener('DOMContentLoaded', () => {
    // Load Header
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });

    // Load Modals
    fetch('components/modals.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('modals').innerHTML = data;
        });

    // Load Testimonials
    fetch('components/testimonials.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('testimonials').innerHTML = data;
        });

    // Load Tab Content
    const tabs = ['dashboard', 'trading', 'games', 'info', 'support'];
    tabs.forEach(tab => {
        fetch(`components/${tab}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(`${tab}Tab`).innerHTML = data;
            });
    });
});