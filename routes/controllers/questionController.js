import * as questionService from "../../services/questionService.js";

const listQuestions = async ({request, render}) => {
    const questions = await questionService.questionsFromUserId(1/*placeholder until authentication is implemented*/);
    render("questions.eta", { questions: questions });
};

const addQuestion = async ({request, response}) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    await questionService.addQuestion(
        1/*placeholder for user_id*/,
        params.get("title"),
        params.get("question_text"),
    );

    response.redirect("/questions")
};

export { listQuestions, addQuestion };