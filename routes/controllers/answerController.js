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

const getQuestion = async (params) => {
    const questionId = params.id

    const res = await questionById(questionId);

    return res;
};

const listAnswers = async ({ render, params, response, state}) => {
    const userId = (await state.session.get("user")).id;
    
    const question = await getQuestion(params);
    // returns null if user is not the owner
    const answers = await answerService.answersForOwner(
        userId, 
        params.id,
    );

    if (answers) {
        render("answers.eta", { answers: answers, question: question });
    // if question is not owned by user, return 401
    } else {
        response.status = 401;
    }
};


const addAnswer = async ({request, response, render, params, state}) => {
    const userId = (await state.session.get("user")).id;
    const answerData = await getAnswerData(request);
    const question = await getQuestion(params);

    answerData.question = question;

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
            userId,
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

const deleteAnswer = async ({ params, response, state }) => {
    const userId = (await state.session.get("user")).id;
    
    await answerService.deleteAnswer(userId, params.questionId, params.optionId);
    const authorized = await answerService.deleteAnswer(
        userId, 
        params.questionId, 
        params.optionId
    );
    
    if (authorized) {
        response.redirect( `/questions/${params.questionId}`);
    } else {
        response.status = 401;
    }
};

export { listAnswers, addAnswer, deleteAnswer };