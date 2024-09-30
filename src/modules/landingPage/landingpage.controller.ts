import { Request, Response } from "express";
import LandingPage from "./landingpage.model";

class LandingPageController {
	landingPage = LandingPage;
	createLandingPage = async (req: Request, res: Response) => {
		const { images, banner } = req.body;
		if (!images || !banner) {
			return res
				.status(400)
				.json({ success: false, message: "Images and banner are required" });
		}
		try {
			const landingPage = new this.landingPage({ images, banner });
			await landingPage.save();
			res.json({ success: true, data: landingPage });
		} catch (error) {
			res.status(500).json({ success: false, message: error });
		}
	};
	getLandingPage = async (req: Request, res: Response) => {
		try {
			const landingPage = await this.landingPage.aggregate([
				{
					$addFields: {
						images: {
							$map: {
								input: "$images",
								as: "image",
								in: { $toObjectId: "$$image" },
							},
						},
					},
				},
				{
					$lookup: {
						from: "images",
						localField: "images",
						foreignField: "_id",
						as: "images",
					},
				},
			]);
			res.json({ success: true, data: landingPage });
		} catch (error) {
			res.status(500).json({ success: false, message: error });
		}
	};

	updateLandingPage = async (req: Request, res: Response) => {
		const { images, banner } = req.body;
		if (!images || !banner) {
			return res.status(400).json({
				success: false,
				message: "Images and banner are required update",
			});
		}
		try {
			const landingPage = await this.landingPage
				.findOneAndUpdate({}, { images, banner }, { new: true })
				.exec();
			res.json({ success: true, data: landingPage });
		} catch (error) {
			res.status(500).json({ success: false, message: error });
		}
	};
}
const landingPageController = new LandingPageController();
export default landingPageController;
