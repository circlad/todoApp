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
        $("#todoList").append('<li class="task"><input type="checkbox" class="checkbox" id=' + taskList[i].id + ' name="completed" checked/><span class="item" id=' + taskList[i].id + ' style="text-decoration:line-through">' + taskList[i].description + '</span><input type="text" class="edit" style="display:none"><button id=' + taskList[i].id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
      } else {
        $("#todoList").append('<li class="task"><input type="checkbox" class="checkbox" id=' + taskList[i].id + ' name="completed"/><span class="item" id=' + taskList[i].id + '>' + taskList[i].description + '</span><input type="text" class="edit" style="display:none"><button id=' + taskList[i].id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
      }
      
    }

  })

function addTask(newTask) {
  taskList.push(newTask);
  $("#todoList").append('<li class="task"><input type="checkbox" class="checkbox" id=' + newTask.id + ' name="completed"/><span class="item" id=' + newTask.id + '>' +  newTask.description + '</span><input type="text" class="edit" style="display:none"><button id=' + newTask.id + ' class="deleteButton"><img src="images/delete.png"></button></li>');
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

// Press enter instead of click on AddButton
$('#newTask').keypress(function(e){
    if(e.which == 13){//Enter key pressed
        $('#addButton').click();//Trigger search button click event
    }
});

// When the user marks a task as completed
$(document).on('click', 'input[name=completed]', function() {

  var idToUpdate = $(this).attr('id');

  var data = {
    completed: false
  }

  if ($(this).prop('checked')) {
    console.log('checked');
    data.completed = true;
    $(this).siblings(".item").css('text-decoration', 'line-through');
  } else {
    console.log('unchecked');
    $(this).siblings(".item").css('text-decoration', 'none')
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

// When the user edits a task
// Select the task to edit
$(document).on('dblclick', '.item', function(){

  event.preventDefault();

  $(this).hide();
  $(this).siblings(".edit").show().val($(this).text()).focus();

});


// Edit and save the task
$(document).on('focusout', '.edit', function(){

  event.preventDefault();

  $(this).hide();  
  $(this).siblings(".item").show().text($(this).val());

  // Send the edit request to the server
  var taskToEdit = $(this).val()
  console.log($(this).val())

  var data = {
    description: taskToEdit
  }

  var idToEdit = $(this).siblings('span').attr('id');
  console.log($(this).siblings('span').attr('id'))

  var editTask = {
    type: "PUT",
    url: '/todos/' + idToEdit,
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      Auth: localStorage.Auth
    }
  }

  $.ajax(editTask)
    .done(function(data, statusText, xhr) {
      taskList = JSON.parse(xhr.responseText);
      console.log('The task number ' + idToEdit + ' was edited to:' + taskList.description)
    })

});