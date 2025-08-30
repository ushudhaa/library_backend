import mongoose from 'mongoose';

const borrowschema= new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
required: true
    },
    bookid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'book',
        required: true
    },
    borrowdate:{
        type:Date,
        required:true
},
returnDate:{
    type:Date,
    required: true
}
});

const Borrow= mongoose.model('borrow',borrowschema);
export default Borrow;