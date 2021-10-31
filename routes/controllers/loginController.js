import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const processLogin = async ({ request, response, state, render }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const userFromDatabase = await userService.findUserByEmail(
        params.get("email"),
    );

    const errorMessage = { validationErrors: { credentials: { invalid: "Login failed: Invalid email or password" }}};

    if (userFromDatabase.length != 1) {
        render("login.eta", errorMessage);
        return;
    }

    const user = userFromDatabase[0];
    const passwordMatches = await bcrypt.compare(
        params.get("password"),
        user.password,
    );

    if (!passwordMatches) {
        render("login.eta", errorMessage);
        return;
    }

    await state.session.set("user", user);
    response.redirect("/questions");
};

const logout = async ({response, state}) => {
    await state.session.set("user", null);
  
    response.redirect("/");
  }

const showLoginForm = ({ render }) => {
    render("login.eta");
};

export { processLogin, showLoginForm, logout };