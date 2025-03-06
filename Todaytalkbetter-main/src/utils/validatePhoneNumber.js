export function validatePhoneNumber(phoneNumber) {
    // Regular expression to validate phone number with country code (e.g., +1, +44, etc.)
    const phoneRegex = /^\+(\d{1,4})\d{7,14}$/;

    // Test the phone number against the regex
    if (phoneRegex.test(phoneNumber)) {
        return true
    } else {
        return false
    }
}