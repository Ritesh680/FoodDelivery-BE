import mongoose from "mongoose";
import Address, { IAddress } from "./address.model";

class AddressService {
	address = Address;
	async addNewAddress(address: IAddress) {
		const newAddress = new this.address(address);
		await newAddress.save();
		return newAddress;
	}

	async getAllAddress(userId: string) {
		return this.address.find({ user: new mongoose.Types.ObjectId(userId) });
	}

	async updateAddress(id: string, address: Partial<IAddress>) {
		const updatedAddress = await this.address.updateOne(
			{ _id: new mongoose.Types.ObjectId(id) },
			address
		);
		return updatedAddress;
	}

	async deleteAddress(addressId: string) {
		return this.address.deleteOne({
			_id: new mongoose.Types.ObjectId(addressId),
		});
	}

	async setAsPrimary(addressId: string) {
		return await this.address.updateOne(
			{ _id: new mongoose.Types.ObjectId(addressId) },
			{ defaultAddress: true }
		);
	}

	async updateAllAddressToFalse(userId: string) {
		return await this.address.updateMany(
			{ user: new mongoose.Types.ObjectId(userId) },
			{ defaultAddress: false }
		);
	}
}

const addressService = new AddressService();
export default addressService;
