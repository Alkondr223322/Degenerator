import axios from "axios";

async function userLogin(userName, userPassword){
    userName = userName.trim()
    userPassword = userPassword.trim()
    if(userName.length === 0 || userPassword.length === 0){
        alert("All fields must be filled out")
        return false
    }
    console.log(process.env.REACT_APP_SERVER_PATH)
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/auth/login`, {userName, userPassword})
    .then(result => {
        console.log(result)
        alert("Login successful")
        return result.data.token
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

export default userLogin