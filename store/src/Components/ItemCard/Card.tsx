import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./styles.css";
import Button from "@mui/material/Button";
import { Item } from "../../types";
import AddToCart from "../addToCart/addToCart";

interface props {
    item: Item;
    handleOpen: Function;
    chosenItem: Item;
    setChosenItem: Function;
}

const ItemCard = (prop: props)=> {
    const handle = () => {
        prop.setChosenItem(prop.item);
        prop.handleOpen();
    };

    return (
        <>
            <Card sx={{ overflowX: "auto" }} className="card" color="text.primary">
                <CardContent>
                    <text className="text">{prop.item.name}</text>
                    <Typography variant="h5">{prop.item.price + ""} $</Typography>
                </CardContent>
                <CardActions>
                    <Button sx={{ color: "rgb(1, 9, 99)", margin: 1 }} size="medium" onClick={() => handle()}>
                        more details
                    </Button>
                    <div>
                        {+prop.item.stock > 0 && <Typography textAlign={"center"}>add to cart</Typography>}
                        <AddToCart item={prop.item} />
                    </div>
                </CardActions>
            </Card>
        </>
    );
}

export default ItemCard;
