// Resize content to browser-window
$("#todoPage").css("min-height", $(window).height());

// Add a task
// var taskList = [];

event.preventDefault();

var $description = $("#test").find('input[name=q]').val()

var data = {
  completed: false,
  description: $description
}

// console.log(localStorage.Auth);

var createTodo = {
  type: "POST",
  url: '/todos',
  data: JSON.stringify(data),
  contentType: 'application/json',
  headers: {
    Auth: localStorage.Auth
  }
}

$(addButton).click(function () {
  console.log($description);
  $.ajax(createTodo)
    .done(function(data, statusText, xhr) {
      alert(data);
      var status = xhr.status;
      var header = xhr.getAllResponseHeaders();
      localStorage.Auth = xhr.getResponseHeader('Auth');
      console.log(status);
      console.log(header);
    })
    .fail(function (data, statusText, xhr) {
      console.log("Erreur");
    });
})



// function addTask() {

//   taskList.push($("#description").val());
//   var newTask = $("#description").val();
//   $("#todoList").append('<li><input type="checkbox"/>' + newTask + '<button class="deleteButton"><img src="images/delete.png"></button></li>');
//   $("#description").val(""); //  réinitialiser l'input
//   console.log(taskList)
// }
// $(addButton).click(addTask)

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