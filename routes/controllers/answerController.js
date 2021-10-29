import * as answerService from "../../services/answerService.js";
import { validasaur } from "../../deps.js";
import { answerValidationRules } from "../../config/validationRules.js";
import { questionById } from "../../services/questionService.js";

const getAnswerData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    return {
        option_text: params.get("option_text"),
        is_correct: params.has("is_correct")
    };
};

const getQuestion = async (params, request) => {
    const questionId = params.id
    const userId = 1/*placeholder until authentication is implemented*/

    const res = await questionById(userId, questionId);

    return res;
};

const listAnswers = async ({request, render, params, response}) => {
    const userId = 1/*placeholder until authentication is implemented*/;
    
    const question = await getQuestion(params, request);
    // returns null if user is not the owner
    const answers = await answerService.answersForOwner(
        userId, 
        params.id,
    );

    if (answers) {
        render("answers.eta", { answers: answers, question: question[0] });
    // if question is not owned by user, return 401
    } else {
        response.status = 401;
    }
};


const addAnswer = async ({request, response, render, params}) => {
    const answerData = await getAnswerData(request);

    const question = await getQuestion(params, request);

    answerData.question = question[0];

    const [passes, errors] = await validasaur.validate(
        answerData,
        answerValidationRules,
    );

    if (!passes) {
        console.log(errors);
        answerData.validationErrors = errors;
        render("answers.eta", answerData);
    } else {

        const authorized = await answerService.addAnswer(
            1/*placeholder for user_id*/,
            params.id,
            answerData.option_text,
            answerData.is_correct,
        );
        
        if (authorized) {
            response.redirect( `/questions/${params.id}`);
        } else {
            response.status = 401;
        }
    }
};

export { listAnswers, addAnswer };