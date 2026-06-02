// Validation utilities for validator
﻿export class Validator {
    static validateString(
        fieldName: string,
        value: string,
        min?: number,
        max?: number,
        regex?: RegExp
    ): { isValid: boolean; message: string } {
        if (min !== undefined && value.length < min) {
            return { isValid: false, message: `${fieldName} must be at least ${min} characters long` };
        }
        if (max !== undefined && value.length > max) {
            return { isValid: false, message: `${fieldName} must be at most ${max} characters long` };
        }
        if (regex !== undefined && !regex.test(value)) {
            return { isValid: false, message: `Invalid ${fieldName} format` };
        }
        return { isValid: true, message: "" };
    }
}

