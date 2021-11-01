import { assert } from "../../deps.js";
import * as questionService from "../../services/questionService.js";

// tests adding questions to the database
Deno.test({
    name: "Function addQuestion should add a question that can be retrieved with questionsFromUserId", 
    async fn() {
        // make duplicates unlikely
        const testTitle = Math.floor(Math.random() * 10000).toString();
        await questionService.addQuestion(1, testTitle, "this is a test");
        const res = await questionService.questionsFromUserId(1);
        assert(res.some(obj => obj.title === testTitle));
    },
    sanitizeResources: false,
    sanitizeOps: false,
}); 

Deno.test({
    name: "Function deleteQuestion should delete the question.", 
    async fn() {
        // make sure there is a question to be deleted
        await questionService.addQuestion(1, "test", "this is a test");
        // get question to delete
        const question = (await questionService.questionsFromUserId(1))[0];
        // delete question
        await questionService.deleteQuestion(1, question.id);

        // check that question was deleted
        const res = await questionService.questionsFromUserId(1);
        assert(!res.some(obj => obj === question));
    },
    sanitizeResources: false,
    sanitizeOps: false,
}); 


