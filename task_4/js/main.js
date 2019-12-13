//********** DOM - USER **********

var formUser = document.getElementById('form_user');
var userName = document.getElementById('name');
var userSurname = document.getElementById('surname');
var specialization = document.getElementById('specialization');
var jobTitle = document.getElementById('job_title');
var userType = document.getElementById('user_type');

if(userType.value === 'user') {
    specialization.disabled = true;
    specialization.classList.add('disabled');

    jobTitle.disabled = true;
    jobTitle.classList.add('disabled');
}

userType.addEventListener('change', function() {
    var value = userType.value
    if(value === 'user') {
        specialization.disabled = true;
        specialization.classList.add('disabled');
    
        jobTitle.disabled = true;
        jobTitle.classList.add('disabled');
    } else if(value === 'student') {
        specialization.disabled = false;
        specialization.classList.remove('disabled');

        jobTitle.disabled = true;
        jobTitle.classList.add('disabled');
    } else if(value === 'developer') {
        specialization.disabled = false;
        specialization.classList.remove('disabled');

        jobTitle.disabled = false;
        jobTitle.classList.remove('disabled');
    }
})

//********** DOM - TASK **********

var tabs = document.querySelector('.tabs')
var tabItem = document.querySelectorAll('.tab_item')
var taskForm = document.querySelectorAll('.task_form')

tabs.addEventListener('click', function(e) {
    for(var i = 0; i < tabItem.length; i++) {
        tabItem[i].classList.remove('active')
        taskForm[i].classList.remove('active')
    }

    if(e.target.innerText === 'Simple task') {
        e.target.classList.add('active')
        taskForm[0].classList.add('active')
    } else if(e.target.innerText === 'Home task') {
        e.target.classList.add('active')
        taskForm[1].classList.add('active')
    } else if(e.target.innerText === 'Project task') {
        e.target.classList.add('active')
        taskForm[2].classList.add('active')
    }
})


//********** USERS CONSTRUCTORS **********

function User(name, surname) {
    this.name = name;
    this.surname = surname;
}

function Student(name, surname, specialization) {
    User.call(this, name, surname);
    this.specialization = specialization;
}

function Developer(name, surname, specialization, jobTitle) {
    Student.call(this, name, surname, specialization);
    this.jobTitle = jobTitle;
}

//********** TASKS CONSTRUCTORS **********

function SimpleTask(title, status) {
    this.id = taskId;
    this.title = title;
    this.status = status;
}

function HomeTask(title, status, description) {
    SimpleTask.call(this, title, status)
    this.id = taskId;
    this.description = description;
}

function ProjectTask(title, status, description, deadline) {
    HomeTask.call(this, title, status, description)
    this.id = taskId;
    this.deadline = deadline;
}

//********** METHODS **********

Student.prototype = Object.create(User.prototype);
Student.prototype.constructor = Student;

Developer.prototype = Object.create(Student.prototype);
Developer.prototype.constructor = Developer;

User.prototype.createSimpleTask = function(title, status) {
    return new SimpleTask(title, status);
}

Student.prototype.createHomeTask = function(title, status, description) {
    return new HomeTask(title, status, description);
}

Developer.prototype.createProjcetTask = function(title, status, description, deadline) {
    return new ProjectTask(title, status, description, deadline);
}

//********** EXECUTION **********
// --------- CREATE USER ---------
var currentUser;

formUser.addEventListener('submit', function(e) {
    e.preventDefault();
    var type = userType.value;

    if(type === 'user') {
        if(userName.value === '' || userSurname.value === '') {
            alert('Fill in all the fields first!');
            return
        }
        currentUser = new User(userName.value, userSurname.value);
    } else if(type === 'student') {
        if(userName.value === '' || userSurname.value === '' || specialization.value === '') {
            alert('Fill in all the fields first!');
            return
        }
        currentUser = new Student(userName.value, userSurname.value, specialization.value);
        specialization.value = '';
    } else if(type === 'developer') {
        if(userName.value === '' || userSurname.value === '' || specialization.value === '' || jobTitle.value === '') {
            alert('Fill in all the fields first!');
            return
        }
        currentUser = new Developer(userName.value, userSurname.value, specialization.value, jobTitle.value);
        specialization.value = '';
        jobTitle.value = '';
    }

    console.log(currentUser);
    userName.value = '';
    userSurname.value = '';
})

//********** RENDER TODOS **********

var todosOutput = document.querySelector('.todos_output');
var tasks = []
var taskId = 0;

function reRenderTodos() {
    console.log(tasks)
    var taskNumber = 0;
    todosOutput.innerHTML = '';
    tasks.forEach(todo => {
        if(todo.constructor.name === 'SimpleTask') {
            taskNumber++
            todosOutput.innerHTML += `
                <div class="todo">
                    ${taskNumber} - type: simple; title: ${todo.title}; status: ${todo.status};
                    <div class="remove_todo" data-todo="${todo.id}">
                        <div></div>
                        <div></div>
                    </div>
                </div> 
            `
        } else if(todo.constructor.name === 'HomeTask') {
            taskNumber++
            todosOutput.innerHTML += `
                <div class="todo">
                    ${taskNumber} - type: home; title: ${todo.title}; status: ${todo.status}; description: ${todo.description};
                    <div class="remove_todo" data-todo="${todo.id}">
                        <div></div>
                        <div></div>
                    </div>
                </div> 
            `
        } else if(todo.constructor.name === 'ProjectTask') {
            taskNumber++
            todosOutput.innerHTML += `
                <div class="todo">
                    ${taskNumber} - type: project; title: ${todo.title}; status: ${todo.status}; description: ${todo.description}; deadline: ${todo.deadline}
                    <div class="remove_todo" data-todo="${todo.id}">
                        <div></div>
                        <div></div>
                    </div>
                </div> 
            `
        }
    })
}

// --------- CREATE SIMPLE TASK ---------


taskForm[0].addEventListener('submit', function(e) {
    e.preventDefault()
    var title = document.getElementById('title_simple');
    var status = document.getElementById('status_simple');

    var inputs = [title, status];

    if(title.value === '' || status.value === '') {
        alert('Fill in all the fields first!')
        return
    }

    if(currentUser !== undefined) {
        try {
            if(tasks.length !== 0) {
                taskId = tasks[tasks.length - 1].id + 1
            } else {
                taskId++
            }
            tasks.push(currentUser.createSimpleTask(title.value, status.value)); 
            reRenderTodos() 
        } catch (error) {
            alert(`${currentUser.constructor.name}s don't have permission to create this type of task!`)
            console.error(error)
        }
    } else {
        alert('You forgot to create user')
    }

    for(var i = 0; i < inputs.length; i++) {
        inputs[i].value = ''
    }
})

// --------- CREATE HOME TASK ---------

taskForm[1].addEventListener('submit', function(e) {
    e.preventDefault()
    var title = document.getElementById('title_home');
    var status = document.getElementById('status_home');
    var description = document.getElementById('description_home');

    var inputs = [title, status, description];

    if(title.value === '' || status.value === '' || description.value === '') {
        alert('Fill in all the fields first!')
        return
    }

    if(currentUser !== undefined) {
        try {
            if(tasks.length !== 0) {
                taskId = tasks[tasks.length - 1].id + 1
            } else {
                taskId++
            }
            tasks.push(currentUser.createHomeTask(title.value, status.value, description.value))
            reRenderTodos()
        } catch (error) {
            alert(`${currentUser.constructor.name}s don't have permission to create this type of task!`)
            console.error(error)
        }
    } else {
        alert('You forgot to create user')
    }

    for(var i = 0; i < inputs.length; i++) {
        inputs[i].value = ''
    }
})

// --------- CREATE PROJECT TASK ---------

taskForm[2].addEventListener('submit', function(e) {
    e.preventDefault()
    var title = document.getElementById('title_project');
    var status = document.getElementById('status_project');
    var description = document.getElementById('description_project');
    var deadline = document.getElementById('deadline');
    
    var inputs = [title, status, description];

    if(title.value === '' || status.value === '' || description.value === '') {
        alert('Fill in all the fields first!')
        return
    }

    if(currentUser !== undefined) {
        try {
            if(tasks.length !== 0) {
                taskId = tasks[tasks.length - 1].id + 1
            } else {
                taskId++
            }
            tasks.push(currentUser.createProjcetTask(title.value, status.value, description.value, deadline.value))
            reRenderTodos()
        } catch (error) {
            alert(`${currentUser.constructor.name}s don't have permission to create this type of task!`)
            console.error(error)
        }
    } else {
        alert('You forgot to create user')
    }

    for(var i = 0; i < inputs.length; i++) {
        inputs[i].value = ''
    }
})

//********** REMOVE TODO **********

todosOutput.addEventListener('click', function(e) {
    if(e.target.className === 'remove_todo') {    
        for(let i = 0; i < tasks.length; i++) {
            if(tasks[i].id === Number(e.target.dataset.todo)) {
                tasks.splice(i, 1)
            }
        }
        reRenderTodos()
    }    
})