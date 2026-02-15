import {Button} from "react-bootstrap";

function MyModalBtn(props) {  
    return (
      <>
      <Button variant="outline-dark" onClick={props.handleShow} hidden={props.isHidden}>{props.btnText}</Button>
      
      </>
  );
}

export default MyModalBtn;