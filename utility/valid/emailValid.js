import * as EmailValidator from "email-validator";

const emailValid = (email) => {
    if (!EmailValidator.validate(email)) {
        return false
    }
    return true

}

export default emailValid