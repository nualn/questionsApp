import { app } from "../../../app.js";
import { superoak } from "../../../deps.js";
import { executeQuery } from "../../../database/database.js";
import { addQuestion, randomQuestion } from "../../../services/questionService.js";
import { addAnswer, answersToQuestion } from "../../../services/answerService.js";

Deno.test({
    name: "GET request to /api/questions/random should return empty json.", 
    async fn() {
        await executeQuery("DELETE FROM question_answer_options; DELETE FROM questions;");

        const testClient = await superoak(app);
        await testClient.get("/api/questions/random")
            .expect(200)
            .expect("Content-Type", new RegExp("application/json"))
            .expect({});
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test("GET request to /api/questions/random should return a question as a json.", async () => {
    await addQuestion(1, "title", "text");
    const question = await randomQuestion();

    await addAnswer(1, question.id, "Correct option", true);
    const answers = await answersToQuestion(question.id);
    const answer = answers[0];

    const testClient = await superoak(app);
    await testClient.get("/api/questions/random")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))
        .expect({ questionId: question.id, questionTitle: question.title, questionText: question.question_text, answerOptions: [{ optionId: answer.id, optionText: answer.option_text }] });
});

Deno.test("POST request to /api/questions/answer should return a document with attribute correct and value of the answers correctness.", async () => {
    const question = await randomQuestion();

    const answers = await answersToQuestion(question.id);
    const answer = answers[0];

    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
        .set("Content-Type", "application/json")
        .send({ questionId: answer.question_id, optionId: answer.id })
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))
        .expect({ correct: answer.is_correct });
});
