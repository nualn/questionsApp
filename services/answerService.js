import { executeQuery } from "../database/database.js";
import { questionById } from "./questionService.js";

// Function to verify that user_id is the owner of the question
const userOwnsQuestion = async (user_id, question_id) => {
    const res = await questionById(question_id);

    return res.user_id === user_id;
};

const answersToQuestion = async (question_id) => {
    const res = await executeQuery(
        "SELECT * FROM question_answer_options WHERE question_id=$1;", question_id
    );
    
    return res.rows;
};

const answersForOwner = async (user_id, question_id) => {
    
    const userIsOwner = await userOwnsQuestion(user_id, question_id);

    if (userIsOwner) {
        const res = await answersToQuestion(question_id)
        return res;
    }
};

const addAnswer = async (user_id, question_id, option_text, is_correct) => {
    
    const userIsOwner = await userOwnsQuestion(user_id, question_id);

    if (userIsOwner) {
        await executeQuery(
            "INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($1,$2,$3)",
            question_id,
            option_text,
            is_correct,
        );
    }
    return userIsOwner
};

const deleteAnswer = async (user_id, question_id, option_id) => {

    const userIsOwner = await userOwnsQuestion(user_id, question_id);

    if (userIsOwner) {
        await executeQuery(
            "DELETE FROM question_answer_options WHERE question_id=$1 AND id=$2;",
            question_id,
            option_id,
        );
    }
    return userIsOwner
};

const getSingleAnswer = async (answerId) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE id=$1;", answerId);
    return res.rows[0];
};

// adds attempts to answer questions to the database
const answerQuestion = async (user_id, question_id, question_answer_option_id, correct) => {
    await executeQuery(
        `INSERT INTO 
        question_answers (user_id, question_id, question_answer_option_id, correct)
        VALUES ($1, $2, $3, $4);`,
        user_id, 
        question_id, 
        question_answer_option_id, 
        correct,
    );
};


export { answersForOwner, addAnswer, deleteAnswer, answersToQuestion, getSingleAnswer, answerQuestion };