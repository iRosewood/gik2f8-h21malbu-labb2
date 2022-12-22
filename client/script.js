todoForm.title.addEventListener("input",(e) => validateField(e.target));
todoForm.title.addEventListener("blur",(e) => validateField(e.target));
todoForm.description.addEventListener("input",(e) => validateField(e.target));
todoForm.description.addEventListener("blur",(e) => validateField(e.target));
todoForm.dueDate.addEventListener("input",(e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur",(e) => validateField(e.target));

todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById("todoList");

let titleValid = false;
let descriptionValid = false;
let dueDateValid = false;

const api = new Api("http://localhost:5000/tasks")

function validateField(field){
    const {name, value} = field;
    let validationMessage="";

    switch(name){
        case "title":{
            if(value.length < 1){
                validationMessage ="Fältet 'Title' måste innehålla minst två tecken";              
            }
            else if(value.length > 100){
                validationMessage ="Fältet 'Title' måste innehålla mindre än 100 tecken";
            }
            else{
                titleValid = true
            }
            
            break;
        }

        case "description":{
            if(value.length > 450){
                validationMessage="Fältet 'Beskrivning' får inte innehålla mer än 500 tecken";
            }
            else{
                descriptionValid = true;
            }

            break;
        }

        case "dueDate":{
            if(value.length === 0 ){
                validationMessage="Fältet 'Slutförd senast' är obligatorisk";
            }
            else{
                dueDateValid = true;
            }

            break;
        }
    }

    field.previousElementSibling.innerText = validationMessage;
    field.previousElementSibling.classList.remove("hidden")
}

function onSubmit(e){
    e.preventDefault();
    
    if (titleValid && descriptionValid && dueDateValid) {
        saveTask(); 
        titleValid=false;
        descriptionValid=false;
        dueDateValid=false  
    }
    else{
        alert("Fyll i fälten på ett korrekt sätt!");
    }
}

function saveTask(){
    const task = {
        title: todoForm.title.value,
        description: todoForm.description.value,
        dueDate: todoForm.dueDate.value,
        completed: false
    };
    
    api.create(task).then((task) => {
        if(task){
            renderList()
        }
    });

    todoForm.title.value="" ;
    todoForm.description.value="" ;
    todoForm.dueDate.value="";
}

function renderList(){
    console.log("rendering");
    api.getAll().then((tasks) =>{
        todoListElement.innerHTML = "";
        if(tasks && tasks.length > 0){

            tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

            tasks.sort((a, b) => new Date(a.completed) - new Date(b.completed));

            tasks.forEach(task => {todoListElement.insertAdjacentHTML("beforeend", renderTask(task));});
        }
    });
}

function renderTask({id, title, description, dueDate, completed}){
    const now = new Date();

    let html =`
    <li  class="select-none mt-2 py-2 border-b bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg `;
    if (!completed)
    {
        html+= `bg-gradient-to-br from-amber-500 to-amber-600 `  
    }
    else
    {
        html += `bg-gradient-to-br from-teal-700 to-teal-800 `;
    }
    html+= `">
        <div class="flex items-center p-2 m-1">
            <div flex-1 class="inline-block text-black">
                <input type="checkbox" value="${id}" onclick="checkBox(event)"`; 
                completed && (html += `checked`);
                html+= ` ">
                <label for="${id}"><b>Klar</b></label>
            </div>
            <h3 class="mb-3 flex-1 text-xl font-bold text-center text-black">${title}</h3> 
            <div>
                <span>
                    ${dueDate}
                </span>
                <button onclick="deleteTask(${id})" class="inline-block m-2 rounded-md bg-yellow-500 hover:bg-yellow-400 px-4 py-1">Ta bort</button>
            </div>
        </div> `;
        description && ( html+=`<p class="ml-8 pb-2">${description}</p>`);
    html+=`
    </li>
    `;    
    
    return html;
}

function deleteTask(id){
    api.remove(id).then((result) => renderList() );
}

function checkBox(e){

    api.update(e.target.value).then((result) => renderList());

}

renderList();