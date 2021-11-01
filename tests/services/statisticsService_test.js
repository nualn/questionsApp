import { answerQuestion, answersToQuestion } from "../../services/answerService.js";
import { randomQuestion } from "../../services/questionService.js";
import { addAnswer } from "../../services/answerService.js";
import * as statisticsService from "../../services/statisticsService.js";
import { assert } from "../../deps.js";

Deno.test({
    name: "the value of allAnswersByUser of the object returned by getUserStatistics should increase by one when the answerQuestion function is called.", 
    async fn() {
        const before = (await statisticsService.getUserStatistics(1)).allAnswersByUser

        const randQuestion = await randomQuestion();
        // make sure there is an answer option
        await addAnswer(randQuestion.user_id, randQuestion.id, "option text", true);
        const answerOption = (await answersToQuestion(randQuestion.id))[0]
        await answerQuestion(1,randQuestion.id, answerOption.id, true);
        const after = (await statisticsService.getUserStatistics(1)).allAnswersByUser;
        
        assert(after - before == 1);
    },
    sanitizeResources: false,
    sanitizeOps: false,
}); 