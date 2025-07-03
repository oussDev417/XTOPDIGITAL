import mongoose from 'mongoose';

const ContactDetailSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    mapEmbedUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

let ContactDetail;
try {
  ContactDetail = mongoose.model('ContactDetail');
} catch (e) {
  ContactDetail = mongoose.model('ContactDetail', ContactDetailSchema);
}

export default ContactDetail; 