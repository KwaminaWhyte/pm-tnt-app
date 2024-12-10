import { useState } from 'react';

// useForm Hook for React Native
const useForm = (initialValues: any, validate: any) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<any>({});

    // Handle input changes
    const handleChange = (name: string, value: string | number | undefined) => {
        setValues({
            ...values,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (callback: any) => () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            callback(); // Call the provided callback function (e.g., submit form)
        }
    };

    // Reset form fields
    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
    };
};

export default useForm;
