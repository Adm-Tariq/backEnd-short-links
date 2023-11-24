import PasswordValidator from "password-validator"
const passwordValid = (password) => {
    const schema = new PasswordValidator();
    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(200)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()
        .has().symbols()                            // Must have lowercase letters
        .has().digits(2)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123', '000000', '12345678']);

    if (!schema.validate(password)) {
        return false
    }
    return true
}

export default passwordValid