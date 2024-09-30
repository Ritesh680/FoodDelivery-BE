import express from "express";
import { bodyValidator } from "../../middleware/zod.validator";
import { createLandingPage } from "./landingpage.validation";
import landingPageController from "./landingpage.controller";
const landingPage = express.Router();

landingPage.post(
	"/",
	bodyValidator(createLandingPage),
	landingPageController.createLandingPage
);
landingPage.get("/", landingPageController.getLandingPage);
landingPage.put("/", landingPageController.updateLandingPage);

export default landingPage;
