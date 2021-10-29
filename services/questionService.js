import { executeQuery } from "../database/database.js";
import { answersToQuestion } from "./answerService.js";

const questionsFromUserId = async (user_id) => {
    const res = await executeQuery(
        "SELECT * FROM questions WHERE user_id=$1;", user_id
    );
    
    return res.rows;
};

const addQuestion = async (user_id, title, question_text) => {
    await executeQuery(
        "INSERT INTO questions (user_id, title, question_text) VALUES ($1,$2,$3)",
        user_id,
        title,
        question_text,
    );
};

const questionById = async (user_id, question_id) => {
    const res = await executeQuery(
        "SELECT * FROM questions WHERE id=$1 AND user_id=$2;",
        question_id,
        user_id,
    );
    
    return res.rows;
}

const hasAnswerOptions = async (question_id) => {
    const res = await answersToQuestion(question_id);
    return res.length > 0; 
};

const deleteQuestion = async (user_id, question_id) => {
    const res = await questionById(user_id, question_id);
    const userOwnsQuestion = res.length > 0; // will separate this functionality to a middleware.
    // this is repeated too much at the moment.
    const noAnswerOptions = !(await hasAnswerOptions(question_id));

    if (userOwnsQuestion && noAnswerOptions) {
        await executeQuery(
            "DELETE FROM questions WHERE id=$1;",
            question_id,
            );
    }

    return userOwnsQuestion;
};

export { questionsFromUserId, addQuestion, questionById, deleteQuestion };