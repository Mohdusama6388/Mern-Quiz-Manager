import express from "express";
import { registerUser,loginUser,isUserExist } from '../controllers/auth';
import {body} from 'express-validator'

const router = express.Router();

// Register a new user
router.post('/',[body('name').trim().not().isEmpty().isLength({min:4}).withMessage("please enter a valid name,minimum 4 charecter long"),body('email').trim().isEmail().custom((emailId:String)=>{
    return isUserExist(emailId).then((status:Boolean)=>{
        if(status){
return Promise.reject("User already exist")
        }
        
    })
    .catch((err)=>{
        return Promise.reject(err)
    })
 }).normalizeEmail(),
 body('password').trim().isLength({min:8}).withMessage("Enter at least 8 charecter | password"),body('confirm_Password').trim().custom((value:String,{req})=>{
    if(value!=req.body.password){
        return Promise.reject("password mismatch!")
    }
    return true;
    })
 ] ,registerUser);

//login user
router.post('/login',loginUser)
export default router;
