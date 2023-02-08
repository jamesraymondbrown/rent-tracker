import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

const PriceDetails = () => {

  const id = useParams().priceid
  const [price, setPrice] = useState(null)
  const [isPending, setIsPending] = useState(false);
  const history = useHistory()

  useEffect(() => {
  axios.get(`http://localhost:8000/prices/${id}`)
    .then((response) => {
      setPrice(response.data)
    })
  }, [id]);

  const handleClick = () => {
    console.log("Clicked Delete")
    setIsPending(true)
    axios.delete(`http://localhost:8001/prices/${id}`)
      .then((response) => {
        console.log('Price Deleted', response.data);
        setTimeout(function () {
          setIsPending(false)
 	        history.push('/admin')
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  return (    
    <li>
      {price && (
        <div>
          <h3>{price.property_id}, {price.admin_status}</h3>          
          <h3>{price.property_type}, {price.square_footage}</h3>
          <h3>{price.number_of_bedrooms},{price.number_of_bathrooms}</h3>
          { !isPending && <button onClick={handleClick}>Delete</button> }
          { isPending && <button disabled>Deleting Price...</button> }
        </div>  
      )}
    </li>    
  );
}

export default PriceDetails;