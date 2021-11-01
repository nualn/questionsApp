import * as userService from "../../services/userService.js";
import { assert } from "../../deps.js";

Deno.test({
    name: "Function addUser should add an answer that can be retrieved with findUserByEmail", 
    async fn() {
        // to make duplicates unlikely in case of repeated tests
        const rand = Math.floor(Math.random() * 10000).toString();
        await userService.addUser(rand, "password");
        const search = await userService.findUserByEmail(rand);
        assert(search.length > 0);
    },
    sanitizeResources: false,
    sanitizeOps: false,
}); 