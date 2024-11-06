///////////////////////////////////////////////////////////////////////////////
// Function to pad numbers with a leading zero if needed
function padZero(number) {
    return number < 10 ? '0' + number : number;
}

// Function to get current time in 24-hour format (HH:MM)
function getCurrentTime24() {
    const now = new Date();
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    return `${hours}:${minutes}`;
}

// Function to get current time in 12-hour format with AM/PM (H:MM AM/PM)
function getCurrentTime12() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = padZero(now.getMinutes());
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${amPm}`;
}

// Function to update the default time display based on selected input format
function updateDefaultTime() {
    const inputFormat = document.getElementById('inputFormat').value;
    const defaultTimeDisplay = document.getElementById('defaultTimeDisplay');

    if (inputFormat === '12') {
        defaultTimeDisplay.textContent = `Current Time (24-hour): ${getCurrentTime24()}`;
    } else if (inputFormat === '24') {
        defaultTimeDisplay.textContent = `Current Time (12-hour): ${getCurrentTime12()}`;
    } else {
        defaultTimeDisplay.textContent = '';
    }
}

// Function to validate the time input based on selected input format
function validateTimeInput() {
    const inputFormat = document.getElementById('inputFormat').value;
    const timeInput = document.getElementById('time').value.trim();
    const timeHelp = document.getElementById('timeHelp');
    const resultBox = document.getElementById('resultBox');

    let regex;
    let isValid = false;
    let errorMessage = '';

    if (inputFormat === '12') {
        // Regular expression for 12-hour format (e.g., 1:13 PM)
        regex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
        isValid = regex.test(timeInput);
        if (!isValid) {
            errorMessage = "Invalid 12-hour format. Please use H:MM AM/PM.";
        }
    } else if (inputFormat === '24') {
        // Regular expression for 24-hour format (e.g., 13:13)
        regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        isValid = regex.test(timeInput);
        if (!isValid) {
            errorMessage = "Invalid 24-hour format. Please use HH:MM.";
        }
    } else {
        errorMessage = "Please select an input format.";
    }

    if (!isValid) {
        timeHelp.textContent = errorMessage;
        timeHelp.style.color = 'red';
        resultBox.innerHTML = ''; // Clear previous results
    } else {
        timeHelp.textContent = "Looks good!";
        timeHelp.style.color = 'green';
        resultBox.innerHTML = ''; // Clear previous results
    }

    return isValid;
}

// Function to convert 12-hour format to 24-hour format
function convertTo24Hour(time) {
    const amPm = time.slice(-2).toUpperCase();
    const timeWithoutAmPm = time.slice(0, -2).trim();
    const [hourStr, minuteStr] = timeWithoutAmPm.split(':');

    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (amPm === 'AM') {
        if (hours === 12) {
            hours = 0;
        }
    } else if (amPm === 'PM') {
        if (hours !== 12) {
            hours += 12;
        }
    }

    return `${padZero(hours)}:${padZero(minutes)}`;
}

// Function to convert 24-hour format to 12-hour format
function convertTo12Hour(time) {
    const [hourStr, minuteStr] = time.split(':');

    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    let amPm = 'AM';

    if (hours >= 12) {
        amPm = 'PM';
        if (hours > 12) {
            hours -= 12;
        }
    } else if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${padZero(minutes)} ${amPm}`;
}

// Function to perform the conversion and display the result
function performConversion() {
    const inputFormat = document.getElementById('inputFormat').value;
    const timeInput = document.getElementById('time').value.trim();
    const resultBox = document.getElementById('resultBox');

    let convertedTime = '';
    let error = '';

    if (inputFormat === '12') {
        // Convert to 24-hour format
        convertedTime = convertTo24Hour(timeInput);
    } else if (inputFormat === '24') {
        // Convert to 12-hour format
        convertedTime = convertTo12Hour(timeInput);
    } else {
        error = "Invalid input format selected.";
    }

    if (error === '') {
        resultBox.innerHTML = `<div class="alert alert-success">
            Converted Time: <strong>${convertedTime}</strong>
        </div>`;
    } else {
        resultBox.innerHTML = `<div class="alert alert-danger">
            ${error}
        </div>`;
    }
}

// Event listener for form submission
document.getElementById('timeConverterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    if (validateTimeInput()) {
        performConversion();
    }
});

// Event listener for input format selection change
document.getElementById('inputFormat').addEventListener('change', function() {
    updateDefaultTime();
    validateTimeInput(); // Re-validate when format changes

    // Enable the time input and convert button
    document.getElementById('time').disabled = false;
    document.getElementById('convertButton').disabled = false;
});

// Event listener for time input changes
document.getElementById('time').addEventListener('input', validateTimeInput);

// Initialize the default time display when the page loads
window.addEventListener('DOMContentLoaded', (event) => {
    updateDefaultTime();
});
