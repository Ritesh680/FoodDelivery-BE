class CustomError extends Error {
	status: number;
	constructor(error: { message: string; status: number }) {
		super(error.message);
		this.status = error.status;
	}
}

export default CustomError;
