class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }

    getObjectUser() {

        let user = {};

        let elements = this.formEl.elements;

        //Spread de elements
        [...elements].forEach(function (field, index) {

            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else {
                user[field.name] = field.value;
            }
        });

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

            let user = this.getObjectUser();

            this.getPhoto().then(
                (content) => {
                    user.photo = content;
                    this.addLine(user);
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

            fileReader.onerror = (e)=>{
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

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        document.getElementById(this.tableEl.id).appendChild(tr);
    }
}