import { randomQuestion } from "../../services/questionService.js";
import { answersToQuestion } from "../../services/answerService.js";
import { getSingleAnswer } from "../../services/answerService.js";

const sendRandomQuestion = async({ response }) => {
    const res = {};
    const question = await randomQuestion();

    if (question) {
        const answerOptions = await answersToQuestion(question.id);

        for (let i = 0; i < answerOptions.length; i++) {

            answerOptions[i].optionId = answerOptions[i].id;
            answerOptions[i].optionText = answerOptions[i].option_text; 

            delete answerOptions[i].id;
            delete answerOptions[i].option_text;
            delete answerOptions[i].is_correct;
            delete answerOptions[i].question_id;
        };

        res.questionId = question.id;
        res.questionTitle = question.title;
        res.questionText = question.question_text;
        res.answerOptions = answerOptions;

        delete question.id;
        delete question.title;
        delete question.question_text;
        delete question.user_id;

    }

    response.body = res;

};

const checkAnswerJSON = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const document = await body.value;
    const res = {};
    
    if (document.optionId) {
        const answer = await getSingleAnswer(document.optionId);

        if (document.questionId && document.questionId === answer.question_id) {
            
            res.correct = answer.is_correct;
        }
    }
    
    response.body = res;
};

export { sendRandomQuestion, checkAnswerJSON };