import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/questions", questionController.listQuestions);
router.post("/questions", questionController.addQuestion);

export { router };
