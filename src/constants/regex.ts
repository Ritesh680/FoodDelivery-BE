/**
 * Regex for email validation
 */
export const REGEX_EMAIL =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Regex for phone number validation
 */
export const REGEX_PHONE_NUMBER =
	/^(?:(?:\+)?\d{1,3}(?:\s|-|\.)?)?\(?\d{3}\)?(?:\s|-|\.)?\d{3}(?:\s|-|\.)?\d{3,4}$/;

export const REGEX_NUMBER_FORMAT =
	/^(?!^[.,])(?!.*\.\.)(?!.*\.,)-?\d*(?:\.\d*)*(?:,\d*)?$/;
