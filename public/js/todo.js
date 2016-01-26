// Resize content to browser-window
$("#todoPage").css("min-height", $(window).height());

// Go back to index (delete the authentication token)
$("#logout").click(function() {

  var deleterUserLogin = {
    type: 'GET',
    url: '/users/login',
    dataType: 'json',
    headers: {
      Auth: localStorage.Auth
    }
  }

  $.ajax(deleterUserLogin)
    .done(function() {
      console.log('Token destroyed');
    })

  // inits localStorage
  localStorage.Auth = "";

  document.location.href = "index.html"
});

// Setup the request to retrieve the user's todolist
var getTodolist = {
  type: "GET",
  url: '/todos',
  dataType: 'json',
  headers: {
    Auth: localStorage.Auth
  }
}

var taskList = [];

// Display the tasks of the user
$.ajax(getTodolist)
  .done(function(data, statusText, xhr) {
    taskList = JSON.parse(xhr.responseText);
    // console.log(taskList);

    for (var i = 0; i < taskList.length; i++) {
      $("#todoList").append('<li><input type="checkbox"/>' + taskList[i].description + '<button id=' + taskList[i].id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
    }

  })

function addTask(newTask) {
  taskList.push(newTask);
  $("#todoList").append('<li><input type="checkbox"/>' + newTask.description + '<button id=' + newTask.id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
  $("#newTask").val(""); //  réinitialiser l'input
}

// when the user adds a task
$(addButton).click(function() {

  event.preventDefault();

  var $description = $("#todoPage").find('input[name=q]').val()

  var dataUser = {
    description: $description
  }

  // Setup the request to the server
  var createTodo = {
    type: "POST",
    url: '/todos',
    data: JSON.stringify(dataUser),
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      Auth: localStorage.Auth
    }
  }

  // Send request to the server to create the task
  $.ajax(createTodo)
    .done(function(data, statusText, xhr) {

      var newTask = JSON.parse(xhr.responseText);
      console.log(statusText + '! The task was created: ' + newTask.description);
      addTask(newTask);
    })
    .fail(function(data, statusText, xhr) {
      console.log('Erreur: ' + JSON.stringify(dataUser));
    });
})

// When the user deletes a task
function deleteTask(idToDelete) {

  for (var i = 0; i < taskList.length; i++) {
    if (taskList[i].id == idToDelete) {
      console.log('Task successfully removed!');
      taskList.splice(i, 1);
    }
  }
}

$(document).on('click', '.deleteButton', function() {

  event.preventDefault();

  // var $this = $(this);
  var idToDelete = $(this).attr('id');

  var deleteToDo = {
    type: 'DELETE',
    url: '/todos/' + idToDelete,
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      Auth: localStorage.Auth
    }
  }

  $.ajax(deleteToDo)
    .done(function(data, statusText, xhr) {
      console.log('The task number ' + idToDelete + ' was deleted!');

      deleteTask(idToDelete);

    })

  $(this).parent().remove();

})