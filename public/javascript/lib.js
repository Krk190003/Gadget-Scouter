function createDynamicText(text, parentSelector, selector) {
    let failedLoginMsg = document.createElement("div");
    let failedLoginTxt;
    failedLoginTxt = document.createTextNode(text);
    let parentDiv = document.getElementsByClassName(parentSelector)[0];
    failedLoginMsg.setAttribute("id", "ErrMessage");
    failedLoginMsg.appendChild(failedLoginTxt);
    parentDiv.insertBefore(failedLoginMsg, document.getElementById(selector))
    
}


export {createDynamicText};