import { executeQuery } from "../database/database.js";
import { questionById } from "./questionService.js";

// Function to verify that user_id is the owner of the question
const userOwnsQuestion = async (user_id, question_id) => {
    const res = await questionById(user_id, question_id);

    return res.length > 0;
};

const answersForOwner = async (user_id, question_id) => {
    
    const userIsOwner = userOwnsQuestion(user_id, question_id);

    if (userIsOwner) {
        const res = await executeQuery(
            "SELECT * FROM question_answer_options WHERE question_id=$1;", question_id
        );
        
        return res.rows;
    }
};

const addAnswer = async (user_id, question_id, option_text, is_correct) => {
    
    const userIsOwner = userOwnsQuestion(user_id, question_id);

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

export { answersForOwner, addAnswer };