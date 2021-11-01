import { app } from "../../app.js";
import { superoak } from "../../deps.js";

Deno.test({
    name: "Unauthorized GET requests to /questions, /quiz and /statistics should redirect to /auth/login.", 
    async fn() {
        const testClient1 = await superoak(app);
        await testClient1.get("/questions")
            .expect(302)
            .expect("Location", "/auth/login");

        const testClient2 = await superoak(app);
        await testClient2.get("/quiz")
            .expect(302)
            .expect("Location", "/auth/login");

        const testClient3 = await superoak(app);
        await testClient3.get("/statistics")
            .expect(302)
            .expect("Location", "/auth/login");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});