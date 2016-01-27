// Resize content to browser-window
$("#todoPage").css("min-height", $(window).height());

// Logout - Go back to index and delete the authentication token
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
  localStorage.Auth = '';

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
    console.log(taskList);

    for (var i = 0; i < taskList.length; i++) {
      if (taskList[i].completed === true) {
        $("#todoList").append('<li><input type="checkbox" id=' + taskList[i].id + ' name="completed" checked/>' + taskList[i].description + '<button id=' + taskList[i].id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
      } else {
        $("#todoList").append('<li><input type="checkbox" id=' + taskList[i].id + ' name="completed"/>' + taskList[i].description + '<button id=' + taskList[i].id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
      }
      
    }

  })

function addTask(newTask) {
  taskList.push(newTask);
  $("#todoList").append('<li><input type="checkbox" id=' + newTask.id + ' name="completed" checked=' + newTask.completed + ' />' +  newTask.description + '<button id=' + newTask.id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
  $("#newTask").val(""); //  réinitialiser l'input
}

// when the user adds a task
$('#addButton').click(function() {

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

// When the user marks a task as completed
$(document).on('click', 'input[name=completed]', function() {

  var idToUpdate = $(this).attr('id');

  var data = {
    completed: false
  }

  if ($(this).prop('checked')) {
    console.log('checked')
    data.completed = true;
    taskList[idToUpdate].completed = true;
  } else {
    console.log('unchecked');
  }



  var updateToDo = {
    type: "PUT",
    url: '/todos/' + idToUpdate,
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      Auth: localStorage.Auth
    }
  }

  $.ajax(updateToDo)
    .done(function(data, statusText, xhr) {
      console.log('The task number ' + idToUpdate + ' was updated!')
      console.log(xhr.responseText);
    })



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

  // Setup the request to delete the task
  var deleteToDo = {
    type: 'DELETE',
    url: '/todos/' + idToDelete,
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      Auth: localStorage.Auth
    }
  }

  // Send a request to the server to delete the task
  $.ajax(deleteToDo)
    .done(function() {
      console.log('The task number ' + idToDelete + ' was deleted!');

      deleteTask(idToDelete);

    })

  $(this).parent().remove();

})