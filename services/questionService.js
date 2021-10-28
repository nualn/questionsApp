import { executeQuery } from "../database/database.js";

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

export { questionsFromUserId, addQuestion };