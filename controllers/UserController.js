class UserController {

    constructor(formId, tableId) {

        //this.formEl = document.getElementById(formId);
        //this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
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

            console.log(user)

            let index = form.dataset.trIndex;

            let tr = table.rows[index];

            tr.dataset.user = JSON.stringify(user);

            console.log(tr.dataset.user);

            tr.innerHTML = `
                <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${(user.admin) ? "Sim" : "Não"} </td>
                <td>${Utils.formatDate(user.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;

            this.addEventsTr(tr);

            this.updateCount();

            btn.disabled = false;
        });
    }

    getUser(formEl) {

        let user = {};
        let isValid = true;

        let elements = formEl.elements;

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

            this.getPhoto().then(
                (content) => {
                    user.photo = content;
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

    getPhoto() {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let form = document.querySelector("#form-user-create");

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
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        let table = document.querySelector("#table-users");

        table.appendChild(tr);

        this.updateCount();
    }

    addEventsTr(tr) {

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
}