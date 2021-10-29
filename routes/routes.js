import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerController from "./controllers/answerController.js";
import * as registrationController from "./controllers/registrationController.js";


const router = new Router();

router.get("/", mainController.showMain);

router.get("/questions", questionController.listQuestions);
router.post("/questions", questionController.addQuestion);
router.post("/questions/:id/delete", questionController.deleteQuestion);

router.get("/questions/:id", answerController.listAnswers);
router.post("/questions/:id/options", answerController.addAnswer);
router.post("/questions/:questionId/options/:optionId/delete", answerController.deleteAnswer);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

export { router };
