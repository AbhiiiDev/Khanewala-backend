import { ObjectId } from "mongodb";
import mongoose,{InferSchemaType} from "mongoose";
import { menuItemSchema } from "./Restaurant";

const cartItemSchema=new mongoose.Schema({},{_id:false})
cartItemSchema.add(menuItemSchema);
cartItemSchema.add({
    quantity:{type:Number,required:true,min:1}
})

const CartSchema=new mongoose.Schema({
    userId:ObjectId,
    restaurantId:ObjectId,
    items:[
        cartItemSchema
    ],
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

const Cart=mongoose.model("Cart",CartSchema);
export default Cart;