import { z } from "zod";

export const createLandingPage = z.object({
	images: z.array(z.string({ required_error: "Image is required" })),
	banner: z.array(z.string({ required_error: "Banner is required" })),
});
