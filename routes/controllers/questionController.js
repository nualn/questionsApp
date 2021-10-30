import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";
import { questionValidationRules } from "../../config/validationRules.js";

const listQuestions = async ({ state, render }) => {
    const userId = (await state.session.get("user")).id;
    const questions = await questionService.questionsFromUserId(userId);
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
    const userId = (await state.session.get("user")).id;
    const questionData = await getQuestionData(request);

    const [passes, errors] = await validasaur.validate(
        questionData,
        questionValidationRules,
    );

    if (!passes) {
        console.log(errors);
        questionData.validationErrors = errors;
        render("questions.eta", questionData);
    } else {

        await questionService.addQuestion(
            userId,
            questionData.title,
            questionData.question_text,
        );

        response.redirect("/questions");
    }
};

const deleteQuestion = async ({ state, response, params }) => {
    const userId = (await state.session.get("user")).id;

    const authorized = await questionService.deleteQuestion(userId, params.id);
    
    if (authorized) {
        response.redirect("/questions");
    } else {
        response.status = 401;
    }
    
};

export { listQuestions, addQuestion, deleteQuestion };