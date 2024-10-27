import mongoose, { Document } from "mongoose";

export interface IAddress {
	user: mongoose.Types.ObjectId;
	address: string;
	city: string;
	street: string;
	state: string;
	defaultAddress?: boolean;
}

interface IAddressDocument extends IAddress, Document {}

const AddressSchema = new mongoose.Schema<IAddressDocument>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},

	address: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	street: {
		type: String,
		required: true,
	},
	defaultAddress: {
		type: Boolean,
		default: false,
	},
});

const Address = mongoose.model("Address", AddressSchema);
export default Address;
