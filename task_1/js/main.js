//********** USERS CONSTRUCTORS **********

function User(name, surname) {
    this.name = name;
    this.surname = surname;
    this.createSimpleTask = function(title, status) {
        return new SimpleTask(title, status)
    }
}


function Student(name, surname, specialization) {
    User.call(this, name, surname);
    this.specialization = specialization;
    this.createHomeTask = function(title, status, description) {
        return new HomeTask(title, status, description);
    }
}

function Developer(name, surname, specialization, jobTitle) {
    Student.call(this, name, surname, specialization);
    this.jobTitle = jobTitle;
    this.createProjcetTask = function(title, status, description, deadline) {
        return new ProjectTask(title, status, description, deadline);
    }
}

//********** TASKS CONSTRUCTORS **********

function SimpleTask(title, status) {
    this.title = title;
    this.status = status;
}

function HomeTask(title, status, description) {
    SimpleTask.call(this, title, status)
    this.description = description;
}

function ProjectTask(title, status, description, deadline) {
    HomeTask.call(this, title, status, description)
    this.deadline = deadline;
}

//********** TASKS CONSTRUCTORS **********

var style = [
    'color: #fff',
    'background-color: rgb(130, 215, 255)',
    'text-transform: uppercase',
    'font-size: 18px',
    'padding: 5px 10px',
    'border-radius: 5px'
].join(';')

// ---------------------------

var user = new User('Alex', 'Brand');
console.group('%c User', style);
console.log(
    user, 
    user.createSimpleTask('User simple task', 'open')
);
console.groupEnd();
console.log('-----------------------------')

// ---------------------------

var student = new Student('Archi', 'Brand', 'Programing')
console.group('%c Student', style);
console.log(
    student, 
    student.createSimpleTask('Student simple task', 'open'),
    student.createHomeTask('Student home task', 'done', 'details...')
);
console.groupEnd();
console.log('-----------------------------')

// ---------------------------

var developer = new Developer('Alex', 'Brand', 'Programing', 'Fron-end')
console.group('%c Developer', style);
console.log(
    developer,
    developer.createSimpleTask('Dev simple task', 'done'),
    developer.createHomeTask('Dev home task', 'open', 'details...'),
    developer.createProjcetTask('Dev project task', 'open', 'details', new Date().getFullYear() + 1)
)
console.groupEnd()