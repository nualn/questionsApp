import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";
import { questionValidationRules } from "../../config/validationRules.js";
import { getUserId } from "../../services/userService.js";

const getQuestions = async (state) => {
    const questions = await questionService.questionsFromUserId(await getUserId(state));

    return questions;
};

const listQuestions = async ({ state, render }) => {
    const questions = await getQuestions(state);
    render("questions.eta", { questions: questions });
};

const getQuestionData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    return {
        title: params.get("title"),
        question_text: params.get("question_text"),
    };
};

const addQuestion = async ({request, response, render, state}) => {
    const questionData = await getQuestionData(request);

    const [passes, errors] = await validasaur.validate(
        questionData,
        questionValidationRules,
    );

    if (!passes) {
        console.log(errors);

        const questions = await getQuestions(state);
        
        questionData.questions = questions;
        questionData.validationErrors = errors;
        render("questions.eta", questionData);
    } else {

        await questionService.addQuestion(
            await getUserId(state),
            questionData.title,
            questionData.question_text,
        );

        response.redirect("/questions");
    }
};

const deleteQuestion = async ({ state, response, params }) => {

    const authorized = await questionService.deleteQuestion(await getUserId(state), params.id);
    
    if (authorized) {
        response.redirect("/questions");
    } else {
        response.status = 401;
    }
    
};

export { listQuestions, addQuestion, deleteQuestion };