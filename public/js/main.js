// Configure the backend URL
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://aireftraders-backend.onrender.com';

// Test backend connection
async function testBackendConnection() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        if (!response.ok) throw new Error('Backend not responding');
        console.log('Backend connection successful');
    } catch (error) {
        console.error('Backend connection failed:', error);
        alert('⚠️ Cannot connect to server. Some features may not work.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    testBackendConnection();

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

async function fetchDailyProfit() {
    try {
        const response = await fetch('/api/trading/calculate-daily-profit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch daily profit');
        }

        const data = await response.json();
        console.log('Daily profit fetched:', data);

        // Update UI with the fetched data
        document.getElementById('dailyProfit').textContent = `Daily Profit: ₦${data.dailyProfit.toLocaleString()}`;
        document.getElementById('totalProfit').textContent = `Total Profit: ₦${data.totalProfit.toLocaleString()}`;
        document.getElementById('withdrawableProfit').textContent = `Withdrawable: ₦${data.withdrawableProfit.toLocaleString()}`;
    } catch (error) {
        console.error('Error fetching daily profit:', error.message);
        alert('⚠️ Failed to fetch daily profit. Please try again later.');
    }
}

// Call fetchDailyProfit when the trading tab is loaded
document.querySelector('.tab[data-tab="trading"]').addEventListener('click', fetchDailyProfit);

async function fetchBalanceAndCapital() {
    try {
        const response = await fetch('/api/user/balance-and-capital', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch balance and capital');
        }

        const data = await response.json();
        console.log('Balance and capital fetched:', data);

        // Update UI with the fetched data
        document.getElementById('balance').textContent = data.balance.toLocaleString();
        document.getElementById('tradingCapital').textContent = `Trading Capital: ₦${data.tradingCapital.toLocaleString()}`;
    } catch (error) {
        console.error('Error fetching balance and capital:', error.message);
        alert('⚠️ Failed to fetch balance and capital. Please try again later.');
    }
}

// Call fetchBalanceAndCapital when the dashboard or trading tab is loaded
document.querySelector('.tab[data-tab="dashboard"]').addEventListener('click', fetchBalanceAndCapital);
document.querySelector('.tab[data-tab="trading"]').addEventListener('click', fetchBalanceAndCapital);

async function fetchProfitPercentage() {
    try {
        const response = await fetch('/api/trading/profit-percentage', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profit percentage');
        }

        const data = await response.json();
        console.log('Profit percentage fetched:', data);

        // Update UI with the fetched profit percentage
        const profitElement = document.getElementById('profitPercentage');
        if (data.profitPercentage > 0) {
            profitElement.textContent = `Profit: ${data.profitPercentage}%`;
            profitElement.style.color = 'green';
        } else {
            profitElement.textContent = 'No Profit (Watch 20 Ads)';
            profitElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error fetching profit percentage:', error.message);
        alert('⚠️ Failed to fetch profit percentage. Please try again later.');
    }
}

// Call fetchProfitPercentage when the trading tab is loaded
document.querySelector('.tab[data-tab="trading"]').addEventListener('click', fetchProfitPercentage);

async function checkReferralBonus() {
    try {
        const response = await fetch('/api/referrals/check-bonus', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to check referral bonus');
        }

        const data = await response.json();
        if (data.success) {
            alert(data.message);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.error('Error checking referral bonus:', error.message);
    }
}

// Call checkReferralBonus when the dashboard is loaded
document.querySelector('.tab[data-tab="dashboard"]').addEventListener('click', checkReferralBonus);