import { Request, Response } from "express";
import addressService from "./address.service";

class AddressController {
	async createNewAddress(req: Request, res: Response) {
		const { address, city, state, street, isDefault } = req.body;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)._id;

		if (!userId) {
			res.status(401).json({ message: "User session ended. Please Login" });
		}

		try {
			if (isDefault) {
				await addressService.updateAllAddressToFalse(userId);
			}
			const newAddress = await addressService.addNewAddress({
				user: userId,
				address,
				city,
				state,
				street,
				defaultAddress: isDefault,
			});
			res
				.status(201)
				.json({ success: true, message: "Address Added", data: newAddress });
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: "Something went wrong", error });
		}
	}

	async getAllAddresses(req: Request, res: Response) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const userId = (req.user as any)._id;
			const address = await addressService.getAllAddress(userId);
			res
				.status(200)
				.json({ success: true, message: "Address List", data: address });
		} catch (error) {
			res.status(500).json({ error });
		}
	}

	async updateAddress(req: Request, res: Response) {
		const { id } = req.params;
		const { address, city, state, street, isDefault } = req.body;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)._id;
		try {
			if (isDefault) {
				await addressService.updateAllAddressToFalse(userId);
			}
			const updated = await addressService.updateAddress(id, {
				address,
				city,
				state,
				street,
				defaultAddress: isDefault,
			});

			return res.status(200).json({
				success: true,
				message: "Address Updated Successfully",
				data: updated,
			});
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	async deleteAddress(req: Request, res: Response) {
		const { id } = req.params;
		if (!id) {
			return res.json({ success: false, message: "Address Id is required" });
		}
		try {
			const address = await addressService.deleteAddress(id);
			res
				.status(200)
				.json({ success: true, message: "Address Deleted", data: address });
		} catch (error) {
			res.status(500).json({ error });
		}
	}

	async setAsPrimary(req: Request, res: Response) {
		const { id } = req.params;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)._id;
		if (!id) {
			return res.json({ success: false, message: "Address Id is required" });
		}
		try {
			await addressService.updateAllAddressToFalse(userId);

			const address = await addressService.setAsPrimary(id);
			res.status(200).json({
				success: true,
				message: "Address Set as Primary",
				data: address,
			});
		} catch (error) {
			res.status(500).json({ error });
		}
	}
}

const addressController = new AddressController();
export default addressController;
