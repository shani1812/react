import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Item } from "../../types";
import "./styles.css";
import { useDispatch } from "react-redux";


const AddToCart = (props: { item: Item }) =>{
    const [quantity, setQuantity] = useState<Number>(0);

    const dispatch = useDispatch();

    const handleQuantityChange = (change: number) => {
        if (+quantity + change >= 0) {
            if (+quantity + change <= +props.item.stock) {
                setQuantity(+quantity + change);
                return true;
            } else {
                toast.warn(`there are only ${props.item.stock} items in stock`);

                return false;
            }
        }
    };




    return (
        <div>
            {+props.item.stock > 0 ? (
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button
                        disabled={quantity === 0 ? true : false}
                        className={quantity === 0 ? "prdct-qty-btn-disabled" : "prdct-qty-btn"}
                        type="button"
                       
                    >
                        -
                    </button>
                    <input type="text" className="qty-input-box" value={+quantity} disabled />
                    <button
                        id="increment-btn"
                        className={quantity === props.item.stock ? "prdct-qty-btn-disabled" : "prdct-qty-btn"}
                        type="button"
                       
                    >
                        +
                    </button>
                </div>
            ) : (
                <>
                    <Typography variant="h6" color="error">
                        out of stock
                    </Typography>
                </>
            )}
        </div>
    );
}

export default AddToCart;