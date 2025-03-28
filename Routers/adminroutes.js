const express = require('express');
const router=express.Router();
const Users = require('../models/usermodel.js');
const Listing = require('../models/listingsmodel.js');
require('dotenv').config();
// const passport = require("../config/passport");
const wrapAsync = require("../utility/wrapAsyc.js")


router.get("/admin/userdata",wrapAsync(async(req,res)=>{
    const userdata=await Users.find();
    console.log(userdata);
    const listdata=await Listing.find().populate('User');
    console.log(listdata)
    res.json(
        {
            userdata:userdata,
            listdata:listdata
        }
    )
}))
router.get("/admin/userdata/:userid",async(req,res)=>{
       const {userid}=req.params;
            console.log(userid)
            const user=await Users.findById({_id:userid});
            const lists=await Listing.find({'User':userid});
            
            res.json(
                {
                    user,
                    lists
                }
             )
})

//delete post- admin
router.delete("/admin/deletepost/:listid",async(req,res)=>{
    const {listid}=req.params;
    const deletepost=await Listing.findByIdAndDelete({_id:listid});
    res.json(
        {
            success:true,  SuccessMsg:"Post Delete  Successfully!"
        }
    )
})
router.get("/admin/deleteuser/:userid",async(req,res)=>{
    const {userid}=req.params;
    const deleteuser=await Users.findByIdAndDelete({_id:userid});
    res.json(
        {
            success:true,  SuccessMsg:"User Delete  Successfully!"
        }
    )
})

//approve
router.put("/admin/approveproduct/:listid",async(req,res)=>{
    const {listid}=req.params;
    const approvepost=await Listing.findByIdAndUpdate({_id:listid},{ status: "Approve" });
    res.json(
        {
            success:true,  SuccessMsg:"product update  Successfully!"
        }
    )
})
router.put("/admin/rejectproduct/:listid",async(req,res)=>{
    const {listid}=req.params;
    const rejectpost=await Listing.findByIdAndUpdate({_id:listid},{ status: "Reject" });
    res.json(
        {
            success:true,  SuccessMsg:"product update  Successfully!"
        }
    )
})

//block-user
router.put("/admin/blockuser/:userid",async(req,res)=>{
    const {userid}=req.params;
    const rejectpost = await Users.findByIdAndUpdate({ _id: userid }, { status: "Block" });
    const lists =await Listing.updateMany({ "User": userid }, { $set: { status: 'Block' } })
    res.json(
        {
            success:true,  SuccessMsg:"user status update  Successfully!"
        }
    )
})
// unblock-user
router.put("/admin/unblockuser/:userid",async(req,res)=>{
    const {userid}=req.params;
    const rejectpost = await Users.findByIdAndUpdate({ _id: userid }, { status: "Active" });
    const lists =await Listing.updateMany({ "User": userid }, { $set: { status: 'pending' } })

    res.json(
        {
            success:true,  SuccessMsg:"user status update  Successfully!"
        }
    )
})

module.exports=router