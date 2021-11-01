import * as answerService from "../../services/answerService.js";
import { assert } from "../../deps.js";
import { addQuestion, questionsFromUserId } from "../../services/questionService.js";
// tests adding questions to the database
Deno.test({
    name: "Function addAnswer should add an answer that can be retrieved with answersToQuestion", 
    async fn() {
        // make sure there is a question to answer
        await addQuestion(1, "test", "this is a test");
        const question = (await questionsFromUserId(1))[0];
        
        await answerService.addAnswer(1, question.id, "this is a test", true);
        const res = await answerService.answersToQuestion(question.id);
        assert(res.some(obj => obj.option_text === "this is a test"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
}); 

Deno.test({
    name: "Function deleteAnswer should delete the answer option.", 
    async fn() {
        // make sure there is a question
        await addQuestion(1, "test", "this is a test");
        const question = (await questionsFromUserId(1))[0];
        // create an answer option to delete
        await answerService.addAnswer(1, question.id, "this answer will be deleted", true);
        const answers = await answerService.answersToQuestion(question.id);
        
        const answer = answers.find(answer => answer.option_text ===  "this answer will be deleted");

        answerService.deleteAnswer(1, question.id, answer.id);

        const res = await answerService.answersToQuestion(question.id);
            
        assert(!res.some(obj => obj === answer));
    },
    sanitizeResources: false,
    sanitizeOps: false,
}); 
