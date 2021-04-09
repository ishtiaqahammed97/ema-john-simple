import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import './Shipment.css'

const Shipment = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    const onSubmit = data => {
        const savedCart = getDatabaseCart();
        const orderDetails ={...loggedInUser, products: savedCart, shipment: data, oderTime: new Date()};

        fetch('https://warm-oasis-07007.herokuapp.com/addOrder',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderDetails)
        })
        .then(res => res.json())
        .then(data => {
          if(data){
            processOrder();
            alert('your order placed successfully');
          }
        })

    } 
  
    console.log(watch("example")); // watch input value by passing the name of it
  
    return (
      <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>
        <input name="name" defaultValue={loggedInUser.name} ref={register({ required: true })} placeholder="Your Name" />
        {errors.name && <span className="error">Name is required</span>}

        <input name="email" defaultValue={loggedInUser.email} ref={register({ required: true })} placeholder="Your Email"/>
        {errors.email && <span className="error">email is required</span>}
        
        <input name="address" ref={register({ required: true })}  placeholder="Your Address"/>
        {errors.address && <span className="error">address is required</span>}

        <input name="Phone" ref={register({ required: true })} placeholder="Your Phone" />
        {errors.Phone && <span className="error">Phone Number is required</span>}
        <input type="submit" />
      </form>
    );
};

export default Shipment;