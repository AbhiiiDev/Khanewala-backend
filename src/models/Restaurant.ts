import mongoose, { InferSchemaType } from "mongoose";

export const menuItemSchema=new mongoose.Schema({
_id:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    default:()=> new mongoose.Types.ObjectId(),
},
name:{type:String,required:true},
price:{type:Number,required:true},
imageUrl: { type: String },
});

export type MenuItemType=InferSchemaType<typeof menuItemSchema>;


const restaurantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurantName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    deliveryPrice: { type: Number, required: true },
    estimatedDeliveryTime: { type: Number, required: true },
    cuisines: [{ type: String, required: true }],
    menuItems: [menuItemSchema],
    imageUrl: { type: String, required: true },
    lastUpdated: { type: Date, required: true,default:new Date() },
    isApproved:{
        type:String,
        enum:["pending","approved","suspected","rejected"],
        default:"pending",
        required:true,
    }
  });

  const Restaurant= mongoose.model("Restaurant",restaurantSchema);

  export default Restaurant;