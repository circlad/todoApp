var Pierre = {
	name: 'Pierre',
	age: 29
}

var Minh = Pierre;

function Update (person) {
	person.name = 'Minh'
}

Update(Minh);
console.log("Nom de Minh: " + Minh.name);
console.log("Nom de Pierre: " + Pierre.name);