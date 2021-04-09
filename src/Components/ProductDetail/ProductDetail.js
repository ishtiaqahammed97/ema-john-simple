import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product, setProduct] = useState({});

    useEffect(()=> {
                fetch('https://warm-oasis-07007.herokuapp.com/product/' + productKey)
                .then(res => res.json())
                .then(data => setProduct(data))
    }, [productKey])

    // const product = fakeData.find(pd => pd.key === productKey); [data used to loaded from fake data]
    return (
        <div>
            <h1>Your Product Details.</h1>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;