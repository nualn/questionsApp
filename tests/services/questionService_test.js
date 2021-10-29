import { assert, assertEquals } from "../../deps.js";
import * as questionService from "../../services/questionService.js";

// tests adding questions to the database
Deno.test({
    name: "Function addQuestion should add a question that can be retrieved with questionsFromUserId", 
    async fn() {
        const testTitle = toString(Math.floor(Math.random() * 10000));
        await questionService.addQuestion(1, testTitle, "this is a test");
        const res = await questionService.questionsFromUserId(1);
        assert(res.some(obj => obj.title === testTitle));
    },
    sanitizeResources: false,
    sanitizeOps: false,
}); 

