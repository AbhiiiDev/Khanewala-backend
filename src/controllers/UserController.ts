import Restaurant from "../models/Restaurant";
import User from "../models/User";
import {Request,Response} from 'express';


const getUser=async(req:Request,res:Response)=>{
try {
    const currentUser=await User.findOne({_id:req.userId});

    if(!currentUser)
        {
            return res.status(404).json({message:'User not found'});
        }
            let restaurantId=null;
            if(currentUser.role==='restaurant')
            {
                        const restaurant = await Restaurant.findOne({ user: currentUser._id });
                        restaurantId=restaurant?._id;

            }
        res.json({currentUser,restaurantId});
} catch (error) {
    res.status(400).json({message:'Error while finding user'})
}
}


const createUser =async(req:Request,res:Response)=>{

try {
    console.log('inside create user controller')
    const {auth0Id}=req.body;
    const existingUser=await User.findOne({auth0Id});


    if(existingUser)
        {
            console.log('existing user is there')
            let restaurantId=null;
            if(existingUser.role==='restaurant')
            {
                        const restaurant = await Restaurant.findOne({ user: existingUser._id });
                        restaurantId=restaurant?._id;

            }
            return res.status(200).json({message:"User already exists",existingUser,restaurantId});
        }

        const newUser=new User(req.body);
        await newUser.save();
                    console.log('new user created')

        return res.status(201).json({message:'User created Successfully'})
} catch (error) {
    return res.status(400).json({
        error:error,
        message:"problem creating user"
    })
}
}

const updateUser=async(req:Request,res:Response)=>{

try {
    
const {name,addressLine1,country,city,state,postalCode}=req.body;

const user=await User.findById(req.userId);

if(!user)
{
    return res.status(404).json({message:'User not found'});
}

user.name=name;
user.addressLine1=addressLine1;
user.city=city;
user.state=state;
user.postalCode=postalCode;
user.country=country;

await user.save();
res.send(user);

} catch (error) {
    res.status(400).json({message:'Error occured while updating User'});
}


}


export default {
    createUser,
    updateUser,
    getUser
}