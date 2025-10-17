// Disable left-click
document.addEventListener('click', function(event) {
    event.preventDefault();
    return false;
});

// REPLACE WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const LOG_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzAcA4JNxg4YAYvNk2tEPj3m94YlZvru9KCF8afGzdf30tlGL_Aq6ncRoHxKGPbvgFG/exec';

// Function to fetch IP with fallback
async function getIP() {
    const services = [
        'https://ipapi.co/json/',
        'https://api.ipify.org?format=json'
    ];
    for (const url of services) {
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (response.ok) {
                const data = await response.json();
                return data.ip || data.query || 'unknown';
            }
        } catch (err) {
            console.warn('IP fetch failed for ' + url + ':', err);
        }
    }
    return 'unknown';
}

// Log visitor via GAS
async function logVisitor() {
    try {
        const ip = await getIP();
        const visitorData = {
            ip: ip,
            userAgent: navigator.userAgent,
            screenResolution: screen.width + 'x' + screen.height,
            referrer: document.referrer || 'direct',
            pageUrl: window.location.href
        };

        await fetch(LOG_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(visitorData),
            mode: 'no-cors'  // Avoids some cross-origin issues
        });

        console.log('Visitor logged successfully:', visitorData);
    } catch (error) {
        console.error('Error logging visitor:', error.message || error);
    }
}

// Run once per session
if (!sessionStorage.getItem('visitorLogged')) {
    logVisitor();
    sessionStorage.setItem('visitorLogged', 'true');
}
