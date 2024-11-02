import { z } from "zod";

export const createProductDTO = z.object({
	name: z.string({
		required_error: "Product name is required",
	}),
	shortDescription: z.string({
		required_error: "Short description is required",
	}),
	description: z
		.string({
			required_error: "Description is required",
		})
		.min(20, "Description must be at least 20 characters"),
	price: z.number({
		required_error: "Price is required",
	}),
	discountedPrice: z.number().optional().nullable(),
	quantity: z
		.number({
			required_error: "Quantity is required",
		})
		.min(1, "Quantity must be at least 1"),
	category: z
		.string({
			required_error: "Category is required",
		})
		.min(2),
	subCategory: z.string().optional(),
	image: z.array(z.string({ required_error: "Image is required" })).min(1),
	isBestSeller: z.boolean().optional(),
});
