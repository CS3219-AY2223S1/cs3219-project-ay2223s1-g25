function checkPasswordHelper(password) {
    var passwordPolicy = [];
    passwordPolicy.lowercase = "Password must contain a lower case letter";
    passwordPolicy.uppercase = "Password must contain an upper case letter";
    passwordPolicy.number = "Password must contain a number";
    passwordPolicy.special = "Password must contain a special character";
    var passwordLength = 8;
    passwordPolicy.lengthCheck = "Password must contain at least 8 characters";

    var requireLowerletter = false;
    var requireUpperletter = false;
    var requireNumber = false;
    var requireSymbol = false;
    var requireLength = false;

    if (password) {

        if (/[a-z]/.test(password)) {
            $(".check-lowerletter").html("&#10003;");
            $(".checkPasswordText-lowerletter").html(passwordPolicy.lowercase);
            $(".checkPassword-lowerletter").addClass("passwordCheck-valid-customizable").removeClass(
                "passwordCheck-notValid-customizable");
            requireLowerletter = true;
        } else {
            $(".check-lowerletter").html("&#10005;");
            $(".checkPasswordText-lowerletter").html(passwordPolicy.lowercase);
            $(".checkPassword-lowerletter").addClass("passwordCheck-notValid-customizable").removeClass(
                "passwordCheck-valid-customizable");
            requireLowerletter = false;
        }

        if (/[A-Z]/.test(password)) {
            $(".check-upperletter").html("&#10003;");
            $(".checkPasswordText-upperletter").html(passwordPolicy.uppercase);
            $(".checkPassword-upperletter").addClass("passwordCheck-valid-customizable").removeClass(
                "passwordCheck-notValid-customizable");
            requireUpperletter = true;
        } else {
            $(".check-upperletter").html("&#10005;");
            $(".checkPasswordText-upperletter").html(passwordPolicy.uppercase);
            $(".checkPassword-upperletter").addClass("passwordCheck-notValid-customizable").removeClass(
                "passwordCheck-valid-customizable");
            requireUpperletter = false;
        }
        
        if (/[-!$%^&*()_|~`{}\[\]:\/;<>?,.@#'"]/.test(password) || password.indexOf('\\') >= 0) {
            $(".check-symbols").html("&#10003;");
            $(".checkPasswordText-symbols").html(passwordPolicy.special);
            $(".checkPassword-symbols").addClass("passwordCheck-valid-customizable").removeClass(
                "passwordCheck-notValid-customizable");
            requireSymbol = true;
        } else {
            $(".check-symbols").html("&#10005;");
            $(".checkPasswordText-symbols").html(passwordPolicy.special);
            $(".checkPassword-symbols").addClass("passwordCheck-notValid-customizable").removeClass(
                "passwordCheck-valid-customizable");
            requireSymbol = false;
        }

        if (/[0-9]/.test(password)) {
            $(".check-numbers").html("&#10003;");
            $(".checkPasswordText-numbers").html(passwordPolicy.number);
            $(".checkPassword-numbers").addClass("passwordCheck-valid-customizable").removeClass(
                "passwordCheck-notValid-customizable")
            requireNumber = true;
        } else {
            $(".check-numbers").html("&#10005;");
            $(".checkPasswordText-numbers").html(passwordPolicy.number);
            $(".checkPassword-numbers").addClass("passwordCheck-notValid-customizable").removeClass(
                "passwordCheck-valid-customizable");
            requireNumber = false;
        }

        if (password.length < passwordLength) {
            $(".check-length").html("&#10005;");
            $(".checkPasswordText-length").html(passwordPolicy.lengthCheck);
            $(".checkPassword-length").addClass("passwordCheck-notValid-customizable").removeClass(
                "passwordCheck-valid-customizable");
            requireLength = false;
        } else {
            $(".check-length").html("&#10003;");
            $(".checkPasswordText-length").html(passwordPolicy.lengthCheck);
            $(".checkPassword-length").addClass("passwordCheck-valid-customizable").removeClass(
                "passwordCheck-notValid-customizable");
            requireLength = true;
        }
    }

    return requireLowerletter && requireUpperletter && requireNumber && requireSymbol && requireLength;
}

function checkPasswordMatch() {
    var password = $('#new_password').val();
    $('button[name="submitButton"]').prop("disabled",!checkPasswordHelper(password));
}

function checkConfirmPasswordMatch() {
    var password = $('#new_password').val();
    var confirmPassword = false;
    if (password !== $('#confirm_password').val()) {
        $(".check-confirmPassword").html("&#10005;");
        $(".checkPasswordText-confirmPassword").html("Password does not match");
        $(".checkPassword-confirmPassword").addClass("passwordCheck-notValid-customizable").removeClass(
            "passwordCheck-valid-customizable");
            confirmPassword = false;
    } else {
        $(".check-confirmPassword").html("&#10003;");
        $(".checkPasswordText-confirmPassword").html("Password match");
        $(".checkPassword-confirmPassword").addClass("passwordCheck-valid-customizable").removeClass(
            "passwordCheck-notValid-customizable");
        confirmPassword = true;
    }
    $('button[name="submitButton"]').prop("disabled",!(checkPasswordHelper(password) && confirmPassword));
}
