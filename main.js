// Custom function to show loan content
function showContent(loanType, element) {
    // Prevent default anchor behavior
    event.preventDefault();

    // Hide all sections
    const sections = document.getElementsByClassName('loan-content');
    Array.from(sections).forEach(section => section.style.display = 'none');

    // Remove the active class from all menu items
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(item => item.classList.remove('active'));

    // Show the clicked section
    const selectedSection = document.getElementById(loanType);
    if (selectedSection) selectedSection.style.display = 'block';

    // Add active class to the clicked menu item
    element.classList.add('active');
}

// WebSocket Live Server part
if ('WebSocket' in window) {
    (function () {
        function refreshCSS() {
            const sheets = Array.from(document.getElementsByTagName("link"));
            const head = document.getElementsByTagName("head")[0];
            sheets.forEach(elem => {
                const parent = elem.parentElement || head;
                parent.removeChild(elem);
                const rel = elem.rel;
                if (elem.href && (typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet")) {
                    const url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
                    elem.href = `${url}${url.includes('?') ? '&' : '?'}_cacheOverride=${new Date().valueOf()}`;
                }
                parent.appendChild(elem);
            });
        }
        
        const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
        const address = `${protocol}${window.location.host}${window.location.pathname}/ws`;
        const socket = new WebSocket(address);
        socket.onmessage = function (msg) {
            if (msg.data == 'reload') window.location.reload();
            else if (msg.data == 'refreshcss') refreshCSS();
        };
        if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
            console.log('Live reload enabled.');
            sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
        }
    })();
} else {
    console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
}

let currentStep = 1;

function nextStep(step) {
    if (validateStep(step)) {
        if (step < 5) {
            document.getElementById(`step-${step}`).classList.remove('active');
            document.getElementById(`step-${step + 1}`).classList.add('active');
            updateStepIndicator(step + 1);
            currentStep = step + 1;
        }
    }
}

function prevStep(step) {
    if (step > 1) {
        document.getElementById(`step-${step}`).classList.remove('active');
        document.getElementById(`step-${step - 1}`).classList.add('active');
        updateStepIndicator(step - 1);
        currentStep = step - 1;
    }
}

function updateStepIndicator(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((el, index) => {
        el.classList.toggle('active', index + 1 <= step);
    });
}

function validateStep(step) {
    const currentStepElement = document.getElementById(`step-${step}`);
    const inputs = currentStepElement.querySelectorAll('input[required]');
    
    const isValid = Array.from(inputs).every(input => {
        const valid = input.value.trim() !== '';
        input.style.borderColor = valid ? '' : 'red';
        return valid;
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
    }

    return isValid;
}

document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateStep(5)) {
        // Here you would typically send the form data to a server
        alert('Form submitted successfully!');
        // You can add code here to send the form data to your server
    }
});

// Additional validation for specific fields
document.getElementById('nrc').addEventListener('input', function(e) {
    const nrcPattern = /^\d{6}\/\d{2}\/\d$/;
    e.target.setCustomValidity(nrcPattern.test(e.target.value) ? '' : 'Please enter a valid NRC in the format 123456/12/1');
});

document.getElementById('phone').addEventListener('input', function(e) {
    const phonePattern = /^\d{10}$/;
    e.target.setCustomValidity(phonePattern.test(e.target.value) ? '' : 'Please enter a valid 10-digit phone number');
});