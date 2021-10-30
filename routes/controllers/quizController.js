import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const redirectToRandomQuestion = async ({ response }) => {
    const id = await questionService.randomQuestionId();

    response.redirect(`/quiz/${id}`);
};

const renderQuestion = async ({ render, params }) => {
    const question = await questionService.questionById(params.id);
    const answers = await answerService.answersToQuestion(params.id)

    const data = {
        question: question,
        answers: answers,
    };

    render("quiz.eta", data);
};

export { redirectToRandomQuestion, renderQuestion };