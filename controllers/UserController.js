class UserController {

    constructor(formCreateId, formUpdateId, tableId) {

        //this.formCreate = document.getElementById(formCreateId);
        this.formUpdate = document.getElementById(formUpdateId);
        //this.table = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        
        this.selectAll();
    }

    onEdit() {

        let form = document.querySelector("#form-user-update");
        let table = document.querySelector("#table-users");

        form.querySelector(".btn-cancel").addEventListener("click", e => {

            this.showPanelCreate();

        });

        form.addEventListener("submit", e => {

            e.preventDefault();

            let btn = form.querySelector("[type=submit");

            btn.disabled = true;

            let user = this.getUser(form);

            console.log("user", user)

            let index = form.dataset.trIndex;

            let tr = table.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            console.log("userOld", userOld);

            let userAssign = Object.assign({}, userOld, user);

            

            
            this.getPhoto(this.formUpdate).then(

                (content) => {

                    if (!user.photo) {
                        userAssign._photo = userOld._photo;
                    } else {
                        userAssign._photo = content;
                    }
        
                    console.log("userAssign", userAssign);
        
                    tr.dataset.user = JSON.stringify(userAssign);
        
                    //console.log(tr.dataset.user);
        
                    tr.innerHTML = `
                        <td><img src="${userAssign._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${userAssign._name}</td>
                        <td>${userAssign._email}</td>
                        <td>${(userAssign._admin) ? "Sim" : "Não"} </td>
                        <td>${Utils.formatDate(userAssign._register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;
        
                    this.addEventsTr(tr);
        
                    this.updateCount();
        
                    btn.disabled = false;
        
                    form.reset();
        
                    this.showPanelCreate();                    
                }
            )
        });
    }

    getUser(form) {

        let user = {};
        let isValid = true;

        let elements = form.elements;

        //Spread de elements
        [...elements].forEach(function (field, index) {

            // if (['name', 'email', 'password'].indexOf(field.name) > -1
            //     && !field.value) {
            //         field.parentElement.classList.add('has-error');
            //         isValid = false;
            //     }

            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name == "admin") {
                user[field.name] = field.checked;
            }

            else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            return false;
        }

        user = new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

        return user;
    }

    onSubmit() {

        let form = document.querySelector("#form-user-create");

        form.addEventListener("submit", event => {

            event.preventDefault();

            let btnSubmit = form.querySelector("[type=submit");

            btnSubmit.disabled = true;

            let user = this.getUser(form);

            if (!user) return false;

            this.getPhoto(form).then(
                (content) => {
                    user.photo = content;

                    this.insert(user);

                    this.addLine(user);

                    form.reset();

                    btnSubmit.disabled = false;
                },
                (e) => {
                    console.error(e);
                }

            );
        });
    }

    getPhoto(form) {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            //Spread
            let elements = [...form.elements];

            let photos = elements.filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = photos[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) => {
                reject(e);
            };

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve("dist/img/boxed-bg.jpg");
            }

        })


    }    

    addLine(dataUser) {

        let tr = document.createElement("tr");

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"} </td>
            <td>${Utils.formatDate(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        let table = document.querySelector("#table-users");

        table.appendChild(tr);

        this.updateCount();
    }

    addEventsTr(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if(confirm("Deseja realmente excluir?")) {

                tr.remove();

                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");

            form.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {

                let nameInput = "[name=" + name.replace("_", "") + "]";

                let field = form.querySelector(nameInput);

                if (field) {

                    switch (field.type) {

                        case "file":
                            continue;
                            break;

                        case "radio":
                            //console.dir(field);

                            //field.value = json[name];

                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            //field = form.querySelector("[name=gender][value=F");

                            field.checked = true;

                            //console.dir(field);

                            break;

                        case "checkbox":
                            field.checked = json[name];
                            break;

                        default:
                            field.value = json[name];
                    }
                }
            }

            form.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();
        });
    }


    showPanelCreate() {

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    showPanelUpdate() {

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount() {

        let numUsers = 0;
        let numAdms = 0;

        let table = document.querySelector("#table-users");

        [...table.children].forEach(tr => {

            numUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numAdms++;
        });

        document.querySelector("#num-users").innerHTML = numUsers;
        document.querySelector("#num-adms").innerHTML = numAdms;
    }

    insert(data) {

        let users = this.getUsersStorage();

        users.push(data);

        sessionStorage.setItem("users", JSON.stringify(users));
    }

    getUsersStorage() {

        let users = [];

        let item = sessionStorage.getItem("users");

        if  (item) {

            users = JSON.parse(item);
        }

        return users;
    }

    selectAll() {

        let users = this.getUsersStorage();

        users.forEach(dataUser => {

            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);
        });
    }
}