var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

function addLine(dataUser) {

    console.log(dataUser);

    var tr = document.createElement("tr");

    tr.innerHTML = `
        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${dataUser.admin}</td>
        <td>${dataUser.birth}</td>
        <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
    `;

    document.getElementById("table-users").appendChild(tr);
}

// document.querySelectorAll("button").forEach(function(){

//     this.addEventListener("click", function(){
//         console.log("clicou");
//     })
// })

// document.getElementById("form-user-create").addEventListener("submit", function(){
//     alert("oi botao submit");
// })

document.getElementById("form-user-create").addEventListener("submit", function (e) {
    e.preventDefault();

    fields.forEach(function (field, index) {

        if (field.name == "gender") {
            if (field.checked) {
                user[field.name] = field.value;
            }
        } else {
            user[field.name] = field.value;
        }
    });

    var objectUser = new User(
        user.name, 
        user.gender, 
        user.birth, 
        user.country, 
        user.email, 
        user.password, 
        user.photo, 
        user.admin
    );

    addLine(objectUser);
});

