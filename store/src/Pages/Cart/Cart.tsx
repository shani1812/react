import React, { useEffect, useState } from "react";
import { clearCart, getCart, removeItem } from "../../store/slices/cartSlice";
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../store";
import AddToCart from "../../Components/addToCart/addToCart";
import { Delete } from "@mui/icons-material";
import { Address, Item, Order, OrderItems } from "../../types";
import { useMutation } from "react-query";
import { createOrder } from "../../axios/orders";
import { getRecommendations } from "../../axios/items";
import "./styles.css";
import DeleteModal from "../../Components/modals/DeleteModal";

const modalContainerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "pink",
    boxShadow: 50,
    width: "35%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "min(2em, 3vw)",
    p: 4,
};
const button = {
    backgroundColor: "white",
    fontWeight: "800",
};

const Cart = () => {
    const cartItems = useAppSelector(getCart);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
    const { data, mutate: recommendations } = useMutation(() => getRecommendations(cartItems));

    useEffect(() => {
        recommendations();
    }, [cartItems]);

    const [checkout, setCheckout] = useState(false);
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [entrance, setEntrance] = useState("");
    const [submit, setSubmit] = useState(false);
    let order: Order | null = null;

    const cartTotal: number = cartItems
        .map((item: Item) => +item.price * +item.quantity!)
        .reduce((prevValue: number, currValue: number) => prevValue + currValue, 0);

    const { mutate: create } = useMutation(() => createOrder(order));

    const cartQuantity = cartItems.length;

    const dispatch = useAppDispatch();

    const handleRemove = (itemId: String) => {
        dispatch(removeItem(itemId));
        setItemToDelete(null);
    };

    const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmit(true);

        if (city !== "" && street !== "" && houseNumber !== "") {
            let address: Address = { city: city, street: street, houseNumber: +houseNumber };

            if (entrance !== "") {
                address = { ...address, entrance: entrance };
            }
            const orderItems: OrderItems[] = [];
            for (let item of cartItems) {
                orderItems.push({ itemId: item._id!, quantity: item.quantity! });
            }

            order = { address: address, orderItems: orderItems };

            create();
            
            setCheckout(false);
            

            dispatch(clearCart());

            setTimeout(() => {
                window.location.assign("http://localhost:5173");
            }, 5500);

            setSubmit(false);
        }
    };

    return (
        <>
            <div className="centered">
                <div className="parent">
                    <div id="cart">
                        <div className="cart_content">
                            <div className="cart_head">
                                <Typography color="text.primary" variant="h4">
                                    Cart <small>({cartQuantity})</small>
                                </Typography>
                            </div>

                            <div className="cart_body">
                                {cartQuantity === 0 ? (
                                    <Typography color="text.primary" variant="h4">
                                        Cart is empty
                                    </Typography>
                                ) : (
                                    cartItems.map((item: Item) => {
                                        const { _id, name, price, quantity } = item!;
                                        const itemTotal = +price * +quantity!;

                                        return (
                                            <>
                                                <div className="cart_items" key={_id! + ""}>
                                                    <div className="cart_items_info">
                                                        <Typography variant="h5">{name}</Typography>

                                                        <div>
                                                            <Typography display={"inline"} variant="h5">
                                                                ${itemTotal.toLocaleString()}&nbsp;
                                                            </Typography>
                                                            <Typography display={"inline"} variant="h6">
                                                                ({+price}&nbsp;x&nbsp;{+quantity!})
                                                            </Typography>
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <div className="cart_items_quantity">
                                                            <AddToCart item={item} />
                                                        </div>

                                                        <div
                                                            title="Remove Item"
                                                            className="cart_items_delete"
                                                            onClick={() => setItemToDelete(item)}
                                                        >
                                                            <IconButton sx={{ height: "100%" }} aria-label="delete">
                                                                <Delete
                                                                    style={{ color: "rgb(209, 26, 41)" }}
                                                                    fontSize="large"
                                                                />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr />
                                            </>
                                        );
                                    })
                                )}
                            </div>

                            <div className="cart_foot">
                                <Typography variant="h4" color="text.primary">
                                    <small>Total:</small>
                                    <b>$ {cartTotal.toLocaleString()}</b>
                                </Typography>

                                <button
                                    type="button"
                                    className="checkout_btn"
                                    disabled={cartQuantity === 0}
                                    onClick={() => setCheckout(true)}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                    {data && (
                        <div id="cart">
                            <div className="cart_reco_content">
                                <div className="cart_head">
                                    <Typography color="text.primary" variant="h5">
                                        Recommendations
                                    </Typography>
                                </div>

                                <div className="cart_reco_body">
                                    {!data.length ? (
                                        <Typography color="text.primary" variant="h6">
                                            no recommendations
                                        </Typography>
                                    ) : (
                                        data.map((item: Item) => {
                                            const { _id, name, price } = item!;

                                            return (
                                                <>
                                                    <div className="cart_items" key={_id! + ""}>
                                                        <div className="cart_items_info">
                                                            <Typography variant="h5">{name}</Typography>

                                                            <div>
                                                                <Typography variant="h5">
                                                                    ${price.toLocaleString()}&nbsp;
                                                                </Typography>
                                                            </div>
                                                        </div>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <div className="cart_items_quantity">
                                                                <AddToCart item={item} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <hr />
                                                </>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div> 

            {itemToDelete && (
                <DeleteModal
                    itemToDelete={itemToDelete}
                    setItemToDelete={setItemToDelete}
                    handleDelete={() => handleRemove(itemToDelete._id!)}
                    fromCart={true}
                    dataType={"item"}
                />
            )}
            {checkout && (
                <Modal open={true}>
                    <Box sx={modalContainerStyle}>
                        <div style={{ marginTop: "5%" }}>
                            <Typography variant="h4">please add the adress for shipping</Typography>

                            <form onSubmit={(e) => handleCreateOrder(e)}>
                                <TextField
                                    label="city"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setCity(e.target.value)}
                                    margin="normal"
                                    helperText="*required"
                                    error={submit && city === ""}
                                />
                                <TextField
                                    label="street"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setStreet(e.target.value)}
                                    margin="normal"
                                    helperText="*required"
                                    error={submit && street === ""}
                                />
                                <TextField
                                    label="house number"
                                    fullWidth
                                    type="number"
                                    onChange={(e) => setHouseNumber(e.target.value)}
                                    variant="standard"
                                    margin="normal"
                                    helperText="*required"
                                    error={submit && houseNumber === ""}
                                />
                                <TextField
                                    label="entrance"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setEntrance(e.target.value)}
                                    margin="normal"
                                />
                                <Button variant="outlined" sx={button} color="primary" type="submit">
                                    Submit
                                </Button>
                            </form>
                        </div>
                        <button onClick={() => setCheckout(false)} className="x-button">
                            X
                        </button>
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default Cart;
