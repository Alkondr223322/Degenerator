import axios from "axios";
// import Alert from 'react-bootstrap/Alert';

async function userRegister(userName, userMail, userPassword){
    userName = userName.trim()
    userMail = userMail.trim()
    userPassword = userPassword.trim()
    if(userName.length === 0 || userMail.length === 0 || userPassword.length === 0){
        alert("All fields must be filled out")
        return false
    }


    if(userPassword.length < 8){
        alert("Password must be at least 8 characters long")
        return false
    }
    
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/auth/register`, {userName, userMail, userPassword})
    .then(result => {
        console.log(result)
        alert(result.data.message)
        return true
    })
    .catch(err => {
        console.log(err)
        let str = err.message
        if(err.response.data && err.response.data.message){
            str+='\n' + err.response.data.message
        }
        alert(str)
        return false
    })
    return res
}

export default userRegister