import axios from "axios";

async function userReduceBalance(reduceAmount, uID){
    console.log(reduceAmount)
    //payAmount = payAmount.trim()
    // if(payAmount.length === 0){
    //     alert("All fields must be filled out")
    //     return false
    // }
    
    if(Number.isNaN(reduceAmount)) return false
    
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/user/reduceFunds`, {reduceAmount, uID})
    .then(result => {
        console.log(result)
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

export default userReduceBalance