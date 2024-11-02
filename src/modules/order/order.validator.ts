import { z } from "zod";

export const createOrderDTO = z.object({
	firstName: z.string({
		required_error: "First name is required",
	}),
	lastName: z.string({
		required_error: "Last name is required",
	}),
	phone: z.string({
		required_error: "Phone is required",
	}),
	city: z.string({
		required_error: "City is required",
	}),
	street: z.string({
		required_error: "Street is required",
	}),
	products: z.array(
		z.object({
			product: z.string({
				required_error: "Product id is required",
			}),
			quantity: z.number({
				required_error: "Quantity is required",
			}),
		})
	),
});
