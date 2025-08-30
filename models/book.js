import mongoose from 'mongoose';

const bookschema= new mongoose.Schema({
title:{
type:String,
required:true,
trim:true
},
author:{
    type:String,
    required:true,
    trim:true
},
isbn:{
    type:String,
    unique:true,
    required:true,
    trim:true
},
quantity:{
    type:Number,
    required:true,
    min:0
},
available:{
    type:Number,
    required:true,
    min:0
}
});

const book= mongoose.model('book',bookschema);
export default book;