import axios from "axios";

async function userPayRequest(payAmount, uID){
    console.log(payAmount)
    //payAmount = payAmount.trim()
    // if(payAmount.length === 0){
    //     alert("All fields must be filled out")
    //     return false
    // }
    
    if(Number.isNaN(payAmount)) return false
    
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/user/addFunds`, {payAmount, uID})
    .then(result => {
        console.log(result)
        alert("Funding successful")
        return result.data.message
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

export default userPayRequest