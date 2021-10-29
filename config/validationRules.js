import { validasaur } from "../deps.js";

const questionValidationRules = {
    title: [validasaur.required, validasaur.minLength(1)],
    question_text: [validasaur.required, validasaur.minLength(1)],
};

const answerValidationRules = {
    option_text: [validasaur.required, validasaur.minLength(1)],
};

const registrationValidationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)],
};
export { questionValidationRules, answerValidationRules, registrationValidationRules };