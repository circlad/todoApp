// Resize content to browser-window
$("#todoPage").css("min-height", $(window).height());

// Go back to index (delete the authentication token)
$("#logout").click(function() {
  localStorage.Auth = "";
  document.location.href = "index.html"
});

// Display the tasks of the user

var taskList = [];

function addTask() {
  taskList.push($("#newTask").val());
  var newTask = $("#newTask").val();
  $("#todoList").append('<li><input type="checkbox"/>' + newTask + '<button class="deleteButton"><img src="images/delete.png"></button></li>');
  $("#newTask").val(""); //  réinitialiser l'input
  console.log(taskList)
}

$(addButton).click(function() {

  event.preventDefault();

  var $description = $("#todoPage").find('input[name=q]').val()

  var dataUser = {
    description: $description
  }

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