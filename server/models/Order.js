import mongoose from 'mongoose';



const itemSchema = new mongoose.Schema({

user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

name: { type: String, required: true },

quantity: { type: Number, required: true },

link: { type: String }, // optional: product link



});



const orderSchema = new mongoose.Schema({

initiatedBy: {

type: mongoose.Schema.Types.ObjectId,

ref: 'User',

required: true

},

hostel: {

type: String,

required: true

},

platform: {

type: String,

required: true

},




upiId: {

type: String

},

optionalMessage: {

type: String

},

qrImage: {

type: String

},

items: [itemSchema],

status: {

type: String,

enum: ['Open', 'Locked'],

default: 'Open'

},
lockedAt: { type: Date },

joinedUsers: [

{

type: mongoose.Schema.Types.ObjectId,

ref: 'User'

}

]

}, {

timestamps: true

});



export default mongoose.model('Order', orderSchema);

