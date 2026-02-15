import axios from "axios";

async function userForgotPassword(userMail){
    userMail = userMail.trim()
    if(userMail.length === 0){
        alert("All fields must be filled out")
        return false
    }
    
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/auth/pwdForgot`, {userMail})
    .then(result => {
        console.log(result)
        alert("Your temporary password has been sent to your email")
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

export default userForgotPassword