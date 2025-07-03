import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

let ContactMessage;
try {
  ContactMessage = mongoose.model('ContactMessage');
} catch (e) {
  ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
}

export default ContactMessage; 