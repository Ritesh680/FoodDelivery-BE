import { z } from "zod";

export const createCategoryDTO = z.object({
	name: z.string({
		required_error: "Product name is required",
	}),

	image: z.string({ required_error: "Product image is required" }),
});
