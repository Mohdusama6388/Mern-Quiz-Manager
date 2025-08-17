import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user"; 
import ProjectError from "../helper/error";
import { validationResult } from "express-validator";
import {ReturnResponse} from "../utils/interfaces"
 const registerUser = async (req: Request, res: Response ,next:NextFunction) => {
  let resp: ReturnResponse;
  try {
    const validationError=validationResult(req);
    if(!validationError.isEmpty()){
      const err= new ProjectError('validation failed');
      err.statusCode=422;
      err.data=validationError.array();
      throw err;
    }
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      resp = { status: "error", message: "All fields are required", data: {} };
      return res.status(400).json(resp);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      resp = { status: "error", message: "Email already exists", data: {} };
      return res.status(409).json(resp);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, password: hashedPassword });
    const result = await newUser.save();

    resp = {
      status: "success",
      message: "Registration successful",
      data: { userId: result._id },
    };
    res.status(201).json(resp);
  } catch (error) {
    next(error)
  }
};

const loginUser = async (req: Request, res: Response, next:NextFunction) => {
  let resp: ReturnResponse;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      resp = {
        status: "error",
        message: "Email and password are required",
        data: {},
      };
      return res.status(400).json(resp);
    }

    const user = await User.findOne({ email });
    if (!user) {
      const err= new ProjectError("No user exist");
      err.statusCode=401;
      throw err;
    }

    const status = await bcrypt.compare(password, user.password);
    if (status) {
      const token =jwt.sign({userId:user._id},"secretmyverysecretkey",{expiresIn:'1h'})
      resp={status:"success",message:"logged in",data:{token}};
      res.status(200).send(resp);
    } else{
      const err=new ProjectError("Credential mismatch");
      err.statusCode=401;
      throw err;
    }
  } catch(error){
    next(error);
  }

}
const isUserExist= async(email:String)=>{
  const user= await User.findOne({email});
  if(!user){
    return false;
  }
  return true;
}
export {loginUser,registerUser,isUserExist };
