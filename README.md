<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ul>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features-required-by-the-course">Features required by the course</a></li>
        <li><a href="#database-schema-used">Database schema used</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
  </ul>
</details>

# About the project
A web application that is used for creating and answering multiple-choice questions. This was created as a project for a web development course.

## Features required by the course
The following is a list of tasks for the project, given as a checklist. Note that a similar checklist is used for self-assessment and peer-reviews.

### Application structure

*  The application is created in a file called app.js, from where it is exported using export { app };. The application can be launched locally using a file called run-locally.js, which is in the root folder.
*  The names of the source code files and the folders are understandable and convey their meaning.
*  The application follows a three-tier architecture.
*  Application uses a layered architecture with views, controllers, services, and database.

### Creating and listing questions

*  GET request to /questions shows a page that has a form for adding a question. The form asks for the title of the question (input type text, name must be title) and for the question text of the question (textarea, name must be question_text). The form is submitted as a POST request to the path /questions, where the question is added to the database.
*  When a question is being added, the content is validated. Both title and question_text must contain at least one character. If validation of the submitted question fails, the page shows validation errors and the entered data is populated to the form fields.
*  If the validation does not fail, the question is stored to the database, and the user is redirected to /questions.
*  In addition to showing a form, the page at /questions lists the questions created by the user. The list contains question titles which are links to specific question pages. Clicking on a link moves the user to the path /questions/:id, where :id refers to the database id of the question whose link was clicked.

### Viewing a question and adding answer options

*  The page at /questions/:id shows the title and question text for the question with database id :id.
*  The page at /questions/:id shows also a form that can be used to add an answer option. The form includes a textarea for option text (textarea name must be option_text) and a checkbox for correctness (input with type checkbox, name must be is_correct). The form is submitted using a POST request to the path /questions/:id/options, where :id refers to the question for which the answer option is being added to.
*  When an answer option is being added, the content is validated. The option_text must contain at least one character. If validation of the submitted answer option fails, the page shows validation errors and the entered data is populated to the form fields.
*  If the validation does not fail, the answer option is stored to the database, and the user is redirected to /questions/:id, where :id refers to the database id of the question for which the answer option is being added. Note! When checking whether a checkbox was selected or not, check whether the particular name (in this case is_correct) is in the request body.
*  In addition to the question details (title and question text) and the form for adding answer options, the page at /questions/:id also lists answer options for the question with database id :id. For each answer option, option text and correctness of the option is shown.

### Removing answer options and questions

*  For each answer option listed at /questions/:id, the page also shows a button with the text "Delete option" that is used to remove the specific answer option. Clicking the button makes a POST request to the address /questions/:questionId/options/:optionId/delete, where :questionId is the database id of the question and :optionId is the database id of the answer option, which leads to the answer option being removed from the database. Removing the answer option redirects the user to /questions/:id. Note! If there question answers, the question answers for the specific answer option are also removed.
*  If there are no answer options, the page at /questions/:id shows a button with the text "Delete question". Clicking the button makes a POST request to the path /questions/:id/delete, where :id is the database id of the question, which leads to the question being deleted. Deleting the question redirects the user to /questions.

### Registration functionality

*  When making a GET request to the path at /auth/register, the application shows a registration form with two fields and a submit button. The registration form asks for email (use input type email, name must be email) and password (use input type password, name must be password). Submitting the form makes a POST request to the path /auth/register.
*  When making a POST request to the path at /auth/register, i.e. attempting to register a user, the submitted data is validated on the server. The email must be a valid email and the password must contain at least 4 characters. If validation fails, the user is shown the registration form with validation errors and the the email field populated. If validation succeeds, a new user is created (the password is hashed using bcrypt) and the user is redirected to /auth/login.

### Login functionality

*  When making a GET request to the path at /auth/login, the application shows a login form with two fields and a submit button. The login form asks for email (use input type email, name must be email) and password (use input type password, name must be password). Submitting the form makes a POST request to the path /auth/login.
*  When making a POST request to the path at /auth/login, i.e. attempting to login, the application verifies the credentials against data in the database. If the entered credentials match those in the database, the user retrieved from the database is added to the session, and the user is redirected to /questions. If the verification of entered credentials fail, the user is shown the login page with an error message.

### Asking questions

*  When making a GET request to the path at /quiz, a random question is chosen from the database, and the user is redirected to /quiz/:id, where :id refers to the database id of the randomly chosen question. The random question is chosen from all questions, also those not created by the user. If there are no questions, the user is informed that there are no questions so far.
*  When making a GET request to the path at /quiz/:id, where :id refers to the database id of a specific question, the user is shown the question text and the answer options. Each answer option has a button with text "Choose". Clicking on the button makes a POST request to the path /quiz/:id/options/:optionId, where :id is the database identifier of the question and :optionId is the id of the selected answer option.
*  When a POST request is made to the path /quiz/:id/options/:optionId, the question answer with the identifier of the user is stored to the database. Then, if the chosen answer option was correct, the user is redirected to /quiz/:id/correct where the user is shown a page with the text "Correct!". The page also has a link with the text "Next question" that moves the user to the path /quiz. On the other hand, if the chosen answer option was incorrect, the user is redirected to /quiz/:id/incorrect where the user is shown a page with the text "Incorrect!". The page also has the text for the correct answer option, e.g. stating that "The correct option was option text", where option text is the text for the correct option. The page also has a link with the text "Next question" that moves the user to the path /quiz.

### Statistics

*  When making a GET request to the path at /statistics, the user is shown the number of answers the user has given (i.e. total number of times the user has answered a question; each answer, even if made to the same question, counts), and the total number of correct answers. In addition, the page shows the number of answers given to the questions created by the user. Finally, the page also lists five users with the most answered questions (showing email and number of answers for each user).

### Access control

*  Only authorized users can visit the pages that start with /questions, /quiz, or /statistics. Non-authorized users are redirected to /auth/login.
*  Anyone can visit the root page of the application (i.e. /) and the paths that start with /auth.

### Authorization

*  Requests to path that start with /questions show only questions that belong to the currently authenticated user. In addition, the currently authenticated user must not be able to e.g. POST answer options to questions created by other users.

### Styles

*  The application uses a CSS framework for styling the application. The CSS framework is used through a CDN.
*  The styles from the CSS framework are used consistently throughout the application. That is, make sure that all form fields etc are styled.

### Main page and navigation

*  The main page that the user enters at first contains a brief description of the application as well as links for registration and login.
*  The application must have a navigation (e.g. a navbar) that provides logged in users links to creating questions, answering questions, and statistics.

### API

*  The application provides an API that allows asking for a random question and for answering the random question. The API does not record the answers to the database.
*  GET requests made to the path /api/questions/random return a randomly selected question as an JSON document. The document has attributes questionId, questionTitle, questionText, and answerOptions. The attribute answerOptions is a list that contains answer options. Each answer option has attributes optionId and optionText. As an example, a document received as a response could look as follows:

```
{
  "questionId": 1,
  "questionTitle": "Some arithmetics",
  "questionText": "How much is 1+1?",
  "answerOptions": [
    { "optionId": 1, "optionText": "2" },
    { "optionId": 2, "optionText": "4" },
    { "optionId": 3, "optionText": "6" },
  ]
}
```
If there are no questions, the returned document is empty.
*  POST requests made to the path /api/questions/answer with a JSON document that contains the id of the question and the id of the answer option are processed by the server, verifying whether the response was correct or not. For example, the posted document could look as follows.
```
{
  "questionId": 1,
  "optionId": 3,
}
```
The response to the POST request is also a JSON document that has one attribute correct. The value for the attribute is either true or false, depending on whether the submitted answer was correct or not.

### Specifics

*  Passwords must not be stored in plaintext format to the database
*  Database credentials are not included in the submission code

### Documentation

*  The submission zip includes a text file (or a markdown file) that briefly describes the application, describes the create table statements needed to create the tables used to run the application, describes any additional features created to the application, describes the command needed to run the application locally, describes the command(s) needed to test the application, and includes a link to an online location where the application can be run at.

### Testing

*  The application has at least ten meaningful automatic tests.
*  Guidelines for running the tests are included (these may include expecting the user to create a database and set credentials).

### Running, deployment and documentation

*  By default, when the application is launched using run-locally.js, the application launches on the port 7777.
*  Application is available and working in an online location (e.g. Heroku) at an address provided in the documentation.
*  Application can be run locally following the guidelines in documentation.

### Usability

*  The application has descriptive texts that outline the use of the application.
*  All form fields have labels that describe the purpose of the data that is being entered.
*  The application feels intuitive and easy to use.

## Additional features

* When no user is logged in, the navigation bar has options to log in or register.
* A get request to /auth/logout logs out the current user (if one is logged in). The log out functionality can be accessed from the navigation bar.
* Additional styling to the navigation bar and error messages applied on top of the milligram framework. The styles are located in /static/css/style.css.

## Database schema used
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password CHAR(60)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(256) NOT NULL,
  question_text TEXT NOT NULL
);

CREATE TABLE question_answer_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false
);

CREATE TABLE question_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  question_answer_option_id INTEGER REFERENCES question_answer_options(id) ON DELETE CASCADE,
  correct BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX ON users((lower(email)));
```
## Usage
You can try out the application on [heroku](https://question-ap.herokuapp.com/).
### Running locally

Once you have the files in a local directory, run 
```
deno run --allow-read --allow-net --unstable  run-locally.js
```
in the directory

### Running tests

To run the tests use the command
```
deno test --allow-net --allow-read --unstable 
```
