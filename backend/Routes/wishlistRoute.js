import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../Controller/wishlistController.js";

const route = express.Router();

route.post('/addtowishlist', addToWishlist);
route.post('/removefromwishlist', removeFromWishlist);
route.post('/getwishlist', getWishlist);

export default route;
