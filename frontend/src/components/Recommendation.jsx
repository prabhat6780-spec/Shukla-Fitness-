import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Recommendation = ({ productId, title = "You may also like" }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // ✅ FETCH RECOMMENDED
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        if (!productId) return;

        const res = await API.get(
          `/shop/products/recommended/${productId}`
        );

        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommended();
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="pd-recommend-wrapper">
      <div className="pd-recommend">

        <h2 className="pd-rec-title">{title}</h2>

        <div className="pd-recommend-grid">
          {products.map((p) => (
            <div
              key={p._id}
              className="pd-recommend-card"
              onClick={() => navigate(`/store/${p._id}`)}
            >
              <img src={p.images?.[0]?.url} />

              <p className="pd-rec-name">{p.name}</p>

              <div className="product-bottom">
                <div className="shop-product-price-box">
                  <span className="new-price">
                    ₹{p.discountPrice || p.price}
                  </span>

                  {p.discountPrice && p.discountPrice < p.price && (
                    <>
                      <span className="old-price">₹{p.price}</span>
                      <span className="discount">
                        {Math.round(
                          ((p.price - p.discountPrice) / p.price) * 100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


export default Recommendation
