function ready(cb) {
    /in/.test(document.readyState)
    ? setTimeout(ready.bind(null, cb), 90)
    : cb();


};
var App = {};
ready(function(){

    App = {
        "init": function() {
            this._isMobile = mobileAndTabletcheck();
            if(this._isMobile){
                document.querySelector('body').classList.add('isMobile');
            }
            var self = this;
            this._unitTesting = false; // Unit Testing the features in ApplicationDbContext or not
            this._widthHandlebarsAndLoDash = true; // Use Handlebars Template Engine And LoDash or Not
            this._activityTypes = [];
            this._locations= {
                parken: [],
                hondentoilet: [],
                freezone: [],
                overige: [],
            }
            this._initialLoad = true;
            this._frmLogin = document.querySelector('#frm-login'); // Cache Form Login
            this._frmRegister = document.querySelector('#frm-register'); // Cache Form Register
            this._frmProfile = document.querySelector('#frm-profile'); // Cache Form Profile
            this.registerEventListeners(); // Register the Event Listeners for all present elements

			this._hbsCache = {};// Handlebars cache for templates
			this._hbsPartialsCache = {};// Handlebars cache for partials

        },

        "registerEventListeners": function() {

            // Register all other forms
            this.registerForms();
        },
        "registerForms": function() {

            // Event Listeners for Form Login
            if(this._frmLogin != null) {
                var self = this; // Hack for this keyword within an event listener of another object

                this._frmLogin.addEventListener('submit', function(ev) {
                    ev.preventDefault();
                    document.querySelector('[name="login_email"]').classList.remove('error');
                    document.querySelector('[name="login_password"]').classList.remove('error');
                    var error = false;
                    var errorMessages = [];
                    var email = Utils.trim(this.querySelectorAll('[name="login_email"]')[0].value);
                    var passWord = Utils.trim(this.querySelectorAll('[name="login_password"]')[0].value);

                    if(!(email !== 'undefined' && email.length > 4 && isValidEmailAddress(email))){document.querySelector('[name="login_email"]').className += ' error'; error = true; errorMessages.push('Please enter a valid email.')}
                    if(!(passWord !== 'undefined' && passWord.length > 5)){document.querySelector('[name="login_password"]').className += ' error'; error = true; errorMessages.push('Please enter a password of at least 6 characters.')}
                    if(!error){
                        var login = {
                            password: passWord,
                            email:email
                        };
                        signIn(login);
                    } else {
                        var message = prepErrors(errorMessages);
                        console.log(message);
                    }

                    return false;
                });
            }
            // Event Listeners for Form Register
            if(this._frmRegister != null) {
                var self = this; // Hack for this keyword within an event listener of another object

                this._frmRegister.addEventListener('submit', function(ev) {
                    ev.preventDefault();
                    
                    document.querySelector('[name="register_email"]').classList.remove('error');
                    document.querySelector('[name="register_firstName"]').classList.remove('error');
                    document.querySelector('[name="register_lastName"]').classList.remove('error');
                    document.querySelector('[name="register_username"]').classList.remove('error');
                    document.querySelector('[name="register_password"]').classList.remove('error');
                    var error = false;
                    var errorMessages = [];
                    var email = Utils.trim(this.querySelectorAll('[name="register_email"]')[0].value);
                    var firstName = Utils.trim(this.querySelectorAll('[name="register_firstName"]')[0].value);
                    var lastName = Utils.trim(this.querySelectorAll('[name="register_lastName"]')[0].value);
                    var username = Utils.trim(this.querySelectorAll('[name="register_username"]')[0].value);
                    var passWord = Utils.trim(this.querySelectorAll('[name="register_password"]')[0].value);

                    if(!(email !== 'undefined' && email.length > 4 && isValidEmailAddress(email))){document.querySelector('[name="register_email"]').className += ' error'; error = true; errorMessages.push('Please enter a valid email.')}
                    if(!(passWord !== 'undefined' && passWord.length > 5)){document.querySelector('[name="register_password"]').className += ' error'; error = true; errorMessages.push('Please enter a password of at least 6 characters.')}
                    if(!(username !== 'undefined' && username.length > 4)){document.querySelector('[name="register_username"]').className += ' error'; error = true; errorMessages.push('Please pick a username of at least 4 characters.')}
                    if(!(lastName !== 'undefined' && lastName.length > 0)){document.querySelector('[name="register_lastName"]').className += ' error'; error = true; errorMessages.push('Please enter a surname.')}
                    if(!(firstName !== 'undefined' && firstName.length > 0)){document.querySelector('[name="register_firstName"]').className += ' error'; error = true; errorMessages.push('Please enter a first name.')}
                    if(!error){
                        var register = {
                            password: passWord,
                            email:email,
                            firstName: firstName,
                            lastName:lastName,
                            username:username,
                            avatar: "https://www.mautic.org/media/images/default_avatar.png"
                        };
                        handleSignUp(register);
                    } else {
                        var message = prepErrors(errorMessages);
                        toastr.options.timeOut = 5000 * errorMessages.length;
                        toastr.error(message, 'You have some errors!');
                    }

                    return false;
                });
            }

            // Event Listeners for Form Profile
            if(this._frmProfile != null) {
                var self = this; // Hack for this keyword within an event listener of another object

                this._frmProfile.addEventListener('submit', function(ev) {
                    ev.preventDefault();
                    document.querySelector('[name="profile_email"]').classList.remove('error');
                    document.querySelector('[name="profile_firstName"]').classList.remove('error');
                    document.querySelector('[name="profile_lastName"]').classList.remove('error');
                    document.querySelector('[name="profile_username"]').classList.remove('error');
                    var error = false;
                    var errorMessages = [];
                    var email = Utils.trim(this.querySelectorAll('[name="profile_email"]')[0].value);
                    var firstName = Utils.trim(this.querySelectorAll('[name="profile_firstName"]')[0].value);
                    var lastName = Utils.trim(this.querySelectorAll('[name="profile_lastName"]')[0].value);
                    var username = Utils.trim(this.querySelectorAll('[name="profile_username"]')[0].value);

                    if(!(email !== 'undefined' && email.length > 4 && isValidEmailAddress(email))){document.querySelector('[name="profile_email"]').className += ' error'; error = true; errorMessages.push('Please enter a valid email.')}
                    if(!(username !== 'undefined' && username.length > 4)){document.querySelector('[name="profile_username"]').className += ' error'; error = true; errorMessages.push('Please pick a username of at least 4 characters.')}
                    if(!(lastName !== 'undefined' && lastName.length > 0)){document.querySelector('[name="profile_lastName"]').className += ' error'; error = true; errorMessages.push('Please enter a surname.')}
                    if(!(firstName !== 'undefined' && firstName.length > 0)){document.querySelector('[name="profile_firstName"]').className += ' error'; error = true; errorMessages.push('Please enter a first name.')}
                    if(!error){
                        var profile = {
                            email:email,
                            firstName: firstName,
                            lastName:lastName,
                            username:username,
                            score:App._profile.score,
                        };
                        updateUserProfile(profile);
                    } else {
                        var message = prepErrors(errorMessages);
                        toastr.options.timeOut = 5000 * errorMessages.length;
                        toastr.error(message, 'You have some errors!');
                    }

                    return false;
                });

            }

            // Event Listeners for Form forgot
            if(this._frmForgot != null) {
                var self = this; // Hack for this keyword within an event listener of another object

                this._frmForgot.addEventListener('submit', function(ev) {
                    ev.preventDefault();
                    document.querySelector('[name="forgot_email"]').className = document.querySelector('[name="forgot_email"]').className.replace(new RegExp('(?:^|\\s)'+ 'error' + '(?:\\s|$)'), ' ');
                    var error = false;
                    var errorMessages = [];
                    var email = Utils.trim(this.querySelectorAll('[name="forgot_email"]')[0].value);

                    if(!(email !== 'undefined' && email.length > 4 && isValidEmailAddress(email))){document.querySelector('[name="forgot_email"]').className += ' error'; error = true; errorMessages.push('Please enter a valid email.')}
                    if(!error){
                        sendPasswordReset(email);
                    } else {
                        var message = prepErrors(errorMessages);
                        toastr.options.timeOut = 5000 * errorMessages.length;
                        toastr.error(message, 'You have some errors!');
                    }

                    return false;
                });

            }
        },
        "updateUI":function(type){
            
        },
        resetUI:function(){
            
        },
    };
    App.init();
});