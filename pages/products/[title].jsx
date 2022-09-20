import React, { useState, useEffect } from "react"
import Head from "next/head";
import Axios from "axios"
import Card from "../../components/Card";
import { cart } from "../../store/reducers/cartReducer.js"
import { useSelector, useDispatch } from "react-redux"
import Cookies from 'js-cookie';



const SingleProduct = ({ _product }) => {
  const dispatch = useDispatch()

  const [product, setProduct] = useState(_product)
  const [quantity, setQuantity] = useState(1)
  const [availability, setAvailability] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [flag, setFlag] = useState(false);
  const quantityAvailable = product.variants[0].quantityAvailable

  useEffect(() => {
    if (quantityAvailable == 0) {
      setAvailability("Out of stock")
    } else if (quantityAvailable <= 4) {
      setAvailability("Low in stock")
    } else  {
      setAvailability("In stock")
    }
  }, [])

  const addToCart = async () => {
    const productId = product.variants[0].id;
    setFlag(true);
    if (quantityAvailable > 0) {
      try {
        const { data } = await Axios.post(`/api/cart/add`, { productId, quantity })
        const { cart } = data
        setIsLoading(true);

        dispatch({ type: "SET_CART", payload: cart })
      } catch (error) {
        console.log(error)
        setFlag(false);
      }
    }
  };

  const handleOnChange = (e) => {
    setQuantity(e.target.value);
    if (quantity === quantityAvailable) {
      setDisabled(true);
    }
    console.log(quantityAvailable, quantity);
  }

  return (
    <div >
      <Head>
        <title>{product.title} || Amazing Soaps</title>
      </Head>

      <section className="container product">
        {product.images[0]?.src && (
          <img
            className="prod_img"
            src={product.images[0].src}
            alt={product.images[0].altText}
          />
        )}
        <article className="product-details">
          <h1>{product.title}</h1>
          <p style={{ padding: "10px 0px" }}>{product.description}</p>
          <p style={{ fontWeight: "700" }}>{product.variants[0].priceV2.amount + product.variants[0].priceV2.currencyCode}</p>
          <section className="buy-product">
            <input
              type="number"
              style={{
                marginRight: "10px",
                padding: "5px 5px",
                border: "1px solid black"
              }}
              min={quantityAvailable > 0 ? 1 : 0}
              max={quantityAvailable}
              value={quantityAvailable > 0 ? quantity : 0}
              onChange={handleOnChange}
              disabled={disabled}
            />
            <div className="cart-icon" 
            onClick={addToCart}>
              <i
                style={{ color: "black" }}
                className="fas fa-shopping-cart"
                />
            </div>
          </section>
          {quantityAvailable > 0 ?
            <small style={{ fontSize: "14px" }}>{availability}</small>
            : <small style={{ color: "red" }}>{availability}</small>
          }
          <article className="add-to-cart-loader">
          {!flag 
          ? ""
          : <>
            {isLoading 
            ? <h4>Added to cart</h4>
            : <div style={{transform: "scale(1.2"}}
            className="loadingio-spinner-ripple-hb4ksrtc1us"><div className="ldio-uua8zfoilp">
            <div></div><div></div>
            </div></div> 
            } 
          </>
          }
           {quantity == quantityAvailable ? 
           <> {!flag ?  <h4>You've reached the available quantity of this product.</h4>  : ""}
           </>
           : ""}
          <article>
           
          </article>
          </article>
        </article>
      </section>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  let productTitle = ctx.query?.title
  productTitle = encodeURIComponent(productTitle)

  let _product = null

  try {
    const { data } = await Axios.get(`http://localhost:3000/api/product/${productTitle}`)
    
    if (data.product) {
      _product = data.product
    } else {
      // Return 404
      return {
        notFound: true,
      }
    }
  } catch (err) {
    // Return 404
    return {
      notFound: true,
    }
  }

  return {
    props: { _product }
  }
}

export default SingleProduct


