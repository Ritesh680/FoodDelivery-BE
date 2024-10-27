import express from "express";
import addressController from "./address.controller";

const addressRouter = express.Router();

addressRouter.post("/", addressController.createNewAddress);
addressRouter.put("/:id", addressController.updateAddress);
addressRouter.get("/", addressController.getAllAddresses);
addressRouter.post("/:id/setAsPrimary", addressController.setAsPrimary);
addressRouter.delete("/:id", addressController.deleteAddress);
export default addressRouter;
