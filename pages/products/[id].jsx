import React, { useState } from "react"
import Head from "next/head";
import Axios from "axios"
import Card from "../../components/Card";
// import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { FaShoppingCart } from 'react-icons/fa';


const SingleProduct = ({ _product }) => {
  const [product, setProduct] = useState(_product)

  // add to cart by product id
  const addToCart = (e) => {
    e.preventDefault()

    Axios.post(`http://localhost:3000/api/cart/add/${product.id}`)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  };
  return (
    <div >
      <Head>
        <title>{product.title} || Amazing Soaps</title>
      </Head>

      <section className="product">
        {product.images[0]?.src && (
          <img
            className="prod_img"
            src={product.images[0].src}
            alt={product.images[0].altText}
          />
        )}
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p>{product.variants[0].priceV2.amount + product.variants[0].priceV2.currencyCode}</p>

        <div className="add_btn">
          <i className="fas fa-shopping-cart"></i>
          <p onClick={(e) => {
            addToCart(e);
          }}>
            ADD TO CART
          </p>
        </div>
      </section>
    </div>
  );
}
// This gets called on every request
export async function getServerSideProps(ctx) {
  const productId = ctx.query?.id
  let _product = null

  try {
    const { data } = await Axios.get(`http://localhost:3000/api/product/${productId}`)

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


