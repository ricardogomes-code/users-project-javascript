class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEditCancel();
    }

    onEditCancel() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

            //this.showPanelCreate();

            console.log("clicou em cancelar");
        });
    }

    getObjectUser() {

        let user = {};
        let isValid = true;

        let elements = this.formEl.elements;

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

        let objectUser = new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
        return objectUser;
    }

    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type=submit");

            btnSubmit.disabled = true;

            let user = this.getObjectUser();

            if (!user) return false;

            this.getPhoto().then(
                (content) => {
                    user.photo = content;
                    this.addLine(user);

                    this.formEl.reset();
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

            let formElementsCollection = this.formEl.elements;

            //Spread
            let formElementsArray = [...formElementsCollection];

            let photoElementArray = formElementsArray.filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = photoElementArray[0].files[0];

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

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            console.log(JSON.parse(tr.dataset.user));

            document.querySelector("#box-user-create").style.display = "none";
            document.querySelector("#box-user-update").style.display = "block";
        })

        document.getElementById(this.tableEl.id).appendChild(tr);

        this.updateCount();
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

        [...this.tableEl.children].forEach(tr => {

            numUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numAdms++;
        });

        document.querySelector("#num-users").innerHTML = numUsers;
        document.querySelector("#num-adms").innerHTML = numAdms;
    }
}