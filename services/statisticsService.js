import { executeQuery } from "../database/database.js";

const getUserStatistics = async (user_id) => {
    const allAnswersByUser = await executeQuery("SELECT COUNT(id) as count FROM question_answers WHERE user_id=$1;",
    user_id,
    );
    
    const correctAnswersByUser = await executeQuery("SELECT COUNT(id) as count FROM question_answers WHERE user_id=$1 AND correct=true;",
    user_id,
    );

    const answersToQuestionsByUser = await executeQuery(`
        SELECT COUNT(question_answers.id) as count
        FROM (question_answers JOIN questions 
            ON questions.id=question_answers.question_id)
        WHERE questions.user_id=$1;
        `,
        user_id
    );

    

    return {
        allAnswersByUser: allAnswersByUser.rows[0].count,
        correctAnswersByUser: correctAnswersByUser.rows[0].count,
        answersToQuestionsByUser: answersToQuestionsByUser.rows[0].count,
    }
}; 

const getTopFive = async () => {
    const topFiveAnswerers = await executeQuery(`
            SELECT users.email as email, COUNT(question_answers.id) as count
            FROM (users JOIN question_answers
                ON users.id=question_answers.user_id)
            GROUP BY users.id, users.email
            ORDER BY count DESC
            LIMIT 5;
    `);

    return topFiveAnswerers.rows;
};

export { getUserStatistics, getTopFive};