import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const redirectToRandomQuestion = async ({ response, render }) => {
    const id = await questionService.randomQuestionId();

    if (id) {
        response.redirect(`/quiz/${id}`);
    } else {
        render("noQuestions.eta");
    }
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

const checkAnswer = async ({ response, params, state }) => {
    const questionId = params.id;
    const answerId = params.optionId;
    const answer = await answerService.getSingleAnswer(answerId);
    const user = await state.session.user;
    const correct = answer.is_correct

    if(user) {
        const userId = user.id
        await answerService.answerQuestion(userId, questionId, answerId, correct);
    };

    if (correct) {
        response.redirect(`/quiz/${questionId}/correct`);
    } else {
        response.redirect(`/quiz/${questionId}/incorrect`);
    }


};

const renderResponsePage = async ({ params, render , response}) => {
    const correctness = params.correctness;
    
    if (correctness === "correct") {
        render("correctAnswer.eta");
        return;
    }

    if (correctness === "incorrect") {
        const questionId = params.id;
        const answers = await answerService.answersToQuestion(questionId);
        const correctAnswer = answers.find((option) => option.is_correct);
        const data = {};

        if (correctAnswer) {
            data.correctAnswer = correctAnswer;
        }

        render("incorrectAnswer.eta", data);
        return;
    }

    response.status = 404;
}

export { redirectToRandomQuestion, renderQuestion, checkAnswer, renderResponsePage };