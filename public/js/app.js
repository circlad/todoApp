$("#loginPage").css("min-height", $(window).height());

$(document).ready(function() {

	$("#loginBox").submit(function(event) {

		event.preventDefault();

		var $email = $("#loginBox").find('input[name=email]')
		var $password = $("#loginBox").find('input[name=password]')

		var body = {
			email: $email.val(),
			password: $password.val()
		}


		// Check Email Validity

		var errorMessage = ""

		function isValidEmailAddress(emailAddress) {
			var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
			return pattern.test(emailAddress);
		};

		if (!isValidEmailAddress($("#email").val())) {

			errorMessage = "Please enter a valid email address.";

		}

		if (errorMessage == "") {

			// Set up the login request
			var login = {
				type: "POST",
				url: '/users/login',
				data: JSON.stringify(body),
				contentType: 'application/json'
			}

			// Setup the creation of a new user request
			var createUser = {
				type: "POST",
				url: '/users',
				data: JSON.stringify(body),
				contentType: 'application/json'
			}

			// Fires up the JQuery request
			$.ajax(login)
				.fail(function() {
					$.ajax(createUser)
						.done(function(data, statusText, xhr) {
							console.log(data);
							alert("Congrats! You're now registered!");
							$.ajax(login)
							document.location.href = '/todo.html';
						})
				})
				.done(function(data, statusText, xhr) {
					var status = xhr.status;
					var header = xhr.getResponseHeader('Auth');
					console.log(header);
					document.location.href = '/todo.html';
				})

		} else {

			$("#error").html(errorMessage);

		}

	});

})