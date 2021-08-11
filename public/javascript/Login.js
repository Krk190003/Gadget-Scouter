import { createDynamicText } from "./lib.js";


var LoginButton = document.querySelector("#Login-Button");





function failMessage(text) {


    if (document.getElementById("ErrMessage") == null) {
        createDynamicText(text, "SignupContent", "Login-Form");
    }
    else if (document.getElementById("ErrMessage").textContent != text) {
        document.getElementById("ErrMessage").remove();
        createDynamicText(text, "SignupContent", "Login-Form");

    }






}


LoginButton.addEventListener("click", async () => {
    let buttonText = document.getElementById("Button_Text");
    let loadIcon = document.getElementById("Loader");


    if (document.getElementById("Username").value == "" || document.getElementById("Password").value == "") {
        failMessage("Please Enter Username and Password")

    }
    else {
        buttonText.remove();
        loadIcon.setAttribute("class", "spinner-border");


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
        result = await result.json()

        if (result.status != 200) {
            failMessage("Incorrect Username/Password")

            document.getElementById("Password").value = null;
            loadIcon.setAttribute("class", null);
            document.getElementById("Login-Button").appendChild(buttonText);
        }

        else {
            location.href = "/Home";

        }

    }







})



export {createDynamicText};








