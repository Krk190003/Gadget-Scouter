
import { createDynamicText } from "./lib.js";

let signupButton = document.getElementById("Register-Button");

signupButton.addEventListener("click", async () => {
    let email = document.getElementById("Email").value;
    let userName = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;


    //Check to see if all forms are filled
    if (email == "" || userName == "" || password == "") {
        createDynamicText("Please fill out every field", "SignupContent", "SignUp-Form")
    }

    else {
        let buttonText = document.getElementById("Button-Text");
        let loadIcon = document.getElementById("Loader");
        buttonText.remove();
        loadIcon.setAttribute("class", "spinner-border");
        //Checks to see if the Email is already used 


        //Checks to see if the Username is already taken 
       
       
       
        //Registers Users to the Database
        let result = await fetch("/Sign-In", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                Email: email,
                Username: userName,
                Password: password,
            }),


        })
        result = await result.json();

        if(result.status == 409){
            loadIcon.setAttribute("class", null);
            document.getElementById("Register-Button").appendChild(buttonText);
            if (document.getElementById("ErrMessage") == null) {
                createDynamicText(result.msg, "SignupContent", "SignUp-Form");
            }
            else {
                document.getElementById("ErrMessage").remove();
                createDynamicText(result.msg, "SignupContent", "SignUp-Form");

            }
        }

        else if (result.status != 200) {
            loadIcon.setAttribute("class", null);
            document.getElementById("Register-Button").appendChild(buttonText);
            if (document.getElementById("ErrMessage") == null) {
                createDynamicText("Registration Error", "SignupContent", "SignUp-Form");
            }
            else {
                document.getElementById("ErrMessage").remove();
                createDynamicText("Registration Error", "SignupContent", "SignUp-Form");

            }
        }

        else {
            //If Registration is successful, Logs the newly created user in
            let result = await fetch("/login", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    Username: document.getElementById("Username").value,
                    Password: document.getElementById("Password").value,
                }),


            })

            result = await result.json();
            
            if (result.status != 200) {
                loadIcon.setAttribute("class", null);
                document.getElementById("Register-Button").appendChild(buttonText);

                if (document.getElementById("ErrMessage") == null) {
                    createDynamicText("Registration Error", "SignupContent", "SignUp-Form");
                }
                else {
                    document.getElementById("ErrMessage").remove();
                    createDynamicText("Registration Error", "SignupContent", "SignUp-Form");

                }

            }
            else {
                location.href = "/Home";
            }

        }

    }




})