import {Button} from "react-bootstrap";

function MyLogoutBtn(props) {  
    return (
      <>
      <Button variant="outline-dark" onClick={()=>{props.setToken(''); props.setBalance(0)}} hidden={props.isHidden}>{props.btnText}</Button>
      
      </>
  );
}

export default MyLogoutBtn;