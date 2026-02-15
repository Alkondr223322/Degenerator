import axios from "axios";

async function userChangePassword(oldPassword, newPassword, uID){
    oldPassword = oldPassword.trim()
    newPassword = newPassword.trim()
    if(newPassword.length === 0 || oldPassword.length === 0){
        alert("All fields must be filled out")
        return false
    }

    if(newPassword.length < 8){
        alert("Password must be at least 8 characters long")
        return false
    }
    
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/auth/pwdChange`, {oldPassword, newPassword, uID})
    .then(result => {
        console.log(result)
        alert("Password change successful")
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
    // axios.post('http://localhost:3000/auth/login', {userName, userPassword})
    // .then(result => console.log(result))
    // .catch(err => console.log(err))
}

export default userChangePassword