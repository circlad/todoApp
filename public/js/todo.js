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
    .done(function () {
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

var userTaskList = [];

// Display the tasks of the user
$.ajax(getTodolist)
  .done(function (data, statusText, xhr) {
    userTaskList = JSON.parse(xhr.responseText);

    for (var i = 0; i < userTaskList.length; i++) {
      console.log(userTaskList[i].description);
      $("#todoList").append('<li><input type="checkbox"/>' + userTaskList[i].description + '<button class="deleteButton"><img src="images/delete.png"></button></li>');
    }
  })

var taskList = [];

function addTask() {
  taskList.push($("#newTask").val());
  var newTask = $("#newTask").val();
  $("#todoList").append('<li><input type="checkbox"/>' + newTask + '<button class="deleteButton"><img src="images/delete.png"></button></li>');
  $("#newTask").val(""); //  réinitialiser l'input
  console.log(taskList)
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
      var status = xhr.status;
      var header = xhr.getAllResponseHeaders();
      console.log(statusText + '! The task was created: ' + xhr.responseText);
    })
    .fail(function(data, statusText, xhr) {
      console.log('Erreur: ' + JSON.stringify(dataUser));
    });

  // Add a task
  addTask();

})



// Delete a task
// function deleteTask() {
//   $(this).parent().remove();
//   $(taskList).index(this);
//   if (index > -1) {
//     array.splice(index, 1);
//   }
//   console.log(index);
// }
// $(document).on('click', '.deleteButton', deleteTask)