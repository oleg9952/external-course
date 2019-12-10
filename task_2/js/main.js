//********** DOM **********

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

//********** EXECUTION **********

formUser.addEventListener('submit', function(e) {
    e.preventDefault();
    var type = userType.value;
    var createdUser;

    if(type === 'user') {
        createdUser = new User(userName.value, userSurname.value);
    } else if(type === 'student') {
        createdUser = new Student(userName.value, userSurname.value, specialization.value);
        specialization.value = '';
    } else if(type === 'developer') {
        createdUser = new Developer(userName.value, userSurname.value, specialization.value, jobTitle.value);
        specialization.value = '';
        jobTitle.value = '';
    }

    console.log(createdUser);
    userName.value = '';
    userSurname.value = '';
})