var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');


var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
})

// GET

app.get('/todos', function (req, res) {
	res.json(todos);
})

// GET /todos/:id

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId})

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
})

// POST /todos

app.post('/todos', function (req, res) {

	// Use _pick to only pick description and completed

	var body = _.pick(req.body, 'description', 'completed');


	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	// Set body.description to be trimmed value

	body.description = body.description.trim();

	// add id field

	body.id = todoNextId++;

	// push body into aray
	todos.push(body);

	console.log('description: ' + body.description);

	res.json(body);
})

// DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(400).json({"error": " no todo found with that id"});
	}
})

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
})