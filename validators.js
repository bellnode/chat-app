import { isValidUsername , isValidEmail } from "6pp";


export const usernameValidator = (username) =>{
    if(!isValidUsername(username))
        {
            return {isValid : false , errorMessage : "Username is inValid"};
        }
}

export const emailValidator = (email) =>{
    if(!isValidEmail(email))
        {
            return {isValid : false , errorMessage : "Email is inValid"};
        }
}