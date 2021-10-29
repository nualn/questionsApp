import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";
import { questionValidationRules } from "../../config/validationRules.js";

const listQuestions = async ({request, render}) => {
    const questions = await questionService.questionsFromUserId(1/*placeholder until authentication is implemented*/);
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

const addQuestion = async ({request, response, render}) => {
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
            1/*placeholder for user_id*/,
            questionData.title,
            questionData.question_text,
        );

        response.redirect("/questions");
    }
};

const deleteQuestion = async ({ request, response, params }) => {
    const userId = 1; //placeholder

    const authorized = await questionService.deleteQuestion(userId, params.id);
    
    if (authorized) {
        response.redirect("/questions");
    } else {
        response.status = 401;
    }
    
};

export { listQuestions, addQuestion, deleteQuestion };