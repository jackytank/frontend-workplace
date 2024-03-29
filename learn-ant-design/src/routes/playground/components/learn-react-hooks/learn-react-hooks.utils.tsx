import { Button, InputNumber, Space, message } from "antd";
import { MousePosition } from "antd/es/modal/interface";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import axiosClient from "../../../../api/axios-client";
import { Config } from "../../../../config";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import FormItem from "antd/es/form/FormItem";

export const BasicHookFormWithYup = ({
    onSubmit
}: {
    onSubmit: (values: FormValues) => Promise<void>;
}) => {
    const schemaYup = Yup.object().shape({
        firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .matches(/^[A-Za-z]+$/i, 'Invalid first name')
            .required('First name is required'),
        lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .matches(/^[A-Za-z]+$/i, 'Invalid last name')
            .required('Last name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        age: Yup.number()
            .typeError('Age must be a number')
            .required('Age is required')
            .min(18, 'Min age is 18')
            .max(99, 'Max age is 99'),
        gender: Yup.mixed<GenderEnum>()
            .oneOf(Object.values(GenderEnum))
            .required('Gender is required'),
        favoriteColor: Yup.string()
            .notRequired()
    });

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            firstName: 'hehe',
            lastName: 'hihi',
            email: 'hoho@asd.asd',
            age: 21,
            gender: GenderEnum.female,
        },
        resolver: yupResolver(schemaYup) as Resolver<FormValues, any>
    });
    console.log(watch('firstName'));
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <input
                type="text"
                placeholder="First name"
                {...register('firstName')}
            />
            {errors.firstName && <span role='alert'>{errors.firstName.message}</span>}
            <br />
            <input
                type="text"
                placeholder="Last name"
                {...register('lastName')}
            />
            {errors.lastName && <span role='alert'>{errors.lastName.message}</span>}
            <br />
            <input
                type="number"
                placeholder="Age"
                {...register('age')}
            />
            {errors.age && <span role='alert'>{errors.age.message}</span>}
            <br />
            <input
                type="text"
                placeholder="Email"
                {...register('email')}
            />
            {errors.email && <span role='alert'>{errors.email.message}</span>}
            <br />
            <select {...register("gender")}>
                <option value="female">female</option>
                <option value="male">male</option>
                <option value="other">other</option>
            </select>
            <br />
            <Button htmlType="submit">Submit</Button>
        </form>
    );

};

export const BasicHookForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            firstName: 'defaultFirst',
            lastName: 'defaultLast',
            email: 'default@gmail.com',
            age: 18,
            gender: GenderEnum.male,
        }
    });
    const { onSubmit } = useLearnFormik();
    console.log(watch('firstName'));
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <input
                type="text"
                placeholder="First name"
                {...register('firstName', {
                    required: 'First name is required',
                    maxLength: {
                        message: 'First name is too long',
                        value: 10
                    }
                })}
            />
            {errors.firstName && <span role='alert'>{errors.firstName.message}</span>}
            <br />
            <input
                type="text"
                placeholder="Last name"
                {...register('lastName', {
                    required: 'Last name is required',
                    pattern: {
                        message: 'Last name is not valid',
                        value: /^[A-Za-z]+$/i
                    }
                })}
            />
            {errors.lastName && <span role='alert'>{errors.lastName.message}</span>}
            <br />
            <input
                type="number"
                placeholder="Age"
                {...register('age', {
                    min: {
                        message: 'Min age is 18',
                        value: 18
                    },
                    max: {
                        message: 'Max age is 99',
                        value: 99
                    },
                    required: 'Age is required'
                })}
            />
            {errors.age && <span role='alert'>{errors.age.message}</span>}
            <br />
            <input
                type="text"
                placeholder="Email"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        message: 'Email is not valid',
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                    }
                })}
            />
            {errors.email && <span role='alert'>{errors.email.message}</span>}
            <br />
            <select {...register("gender")}>
                <option value="female">female</option>
                <option value="male">male</option>
                <option value="other">other</option>
            </select>
            <br />
            <Button htmlType="submit">Submit</Button>
        </form>
    );

};

export const FullFormik = () => {
    const { initialValues, validationSchema, onSubmit } = useLearnFormik();
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form>
                <FormItem>
                    <label htmlFor="firstName">FirstName</label>
                    <Field name='firstName' type='text' />
                    <ErrorMessage name="firstName" />
                </FormItem>
                <FormItem>
                    <label htmlFor="lastName">LastName</label>
                    <Field name='lastName' type='text' />
                    <ErrorMessage name="lastName" />
                </FormItem>
                <FormItem>
                    <label htmlFor="email">Email</label>
                    <Field name='email' type='email' />
                    <ErrorMessage name="email" />
                </FormItem>
                <FormItem>
                    <label htmlFor="favoriteColor">Favorite Color</label>
                    <Field name='favoriteColor' as='select'>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                    </Field>
                </FormItem>
                <FormItem>
                    <Button htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        </Formik>
    );
};

export const BasicUseFormik = () => {
    const { initialValues, validationSchema, onSubmit } = useLearnFormik();

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: onSubmit
    });

    return (
        <Space direction="vertical">
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input
                    id="firstName"
                    type='text'
                    {...formik.getFieldProps('firstName')}
                />
                <br />
                {formik.touched.firstName && formik.errors.firstName ? (
                    <div>{formik.errors.firstName}</div>
                ) : null}
                <label htmlFor="lastName">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    {...formik.getFieldProps('lastName')}
                />
                <br />
                {formik.touched.lastName && formik.errors.lastName ? (
                    <div>{formik.errors.lastName}</div>
                ) : null}
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                />
                <br />
                {formik.touched.email && formik.errors.email ? (
                    <div>{formik.errors.email}</div>
                ) : null}
                <label htmlFor="gender">Gender</label>
                <Space direction="horizontal">
                    <input
                        id="male"
                        type="radio"
                        {...formik.getFieldProps('gender')}
                    />
                    <label htmlFor="male">Male</label>
                    <input
                        id='female'
                        type="radio"
                        {...formik.getFieldProps('gender')}
                    />
                    <label htmlFor="female">Female</label>
                </Space>
                {formik.touched.gender && formik.errors.gender ? (
                    <div>{formik.errors.gender}</div>
                ) : null}
                <button type="submit">Submit</button>
            </form>
        </Space >
    );
};
enum GenderEnum {
    female = "female",
    male = "male",
    other = "other",
}

type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    gender?: GenderEnum;
    favoriteColor?: string;
};

export const useLearnFormik = () => {
    const initialValues: FormValues = {
        firstName: 'asd',
        lastName: 'asd',
        email: 'asd@asd.asd',
    };
    const colors = ['red', 'blue', 'green'];
    const validationSchema = Yup.object({
        firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
        lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
        gender: Yup.string()
            .notRequired(),
        favoriteColor: Yup.string()
            .oneOf(colors, 'Invalid color'
            )
            .default(colors[0])
            .notRequired()
    });
    const onSubmit = async (values: FormValues) => {
        console.log(values);
        const res = await axiosClient.post(Config.API_PATH.COMMENTS, values);
        if (res) {
            message.success('Create comment success');
        }
    };
    return { initialValues, validationSchema, onSubmit };
};

export const MousePositionRenderProps = ({ render }: {
    render: (props: { mousePosition: MousePosition; rgbColor: { r: number; g: number; b: number; }; }) => JSX.Element;
}) => {
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
    });
    const [rgbColor, setRgbColor] = useState({
        r: 0,
        g: 0,
        b: 0
    });
    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setRgbColor({
                r: e.clientX > 255 ? 255 : e.clientX,
                g: e.clientY > 255 ? 255 : e.clientY,
                b: (e.clientX + e.clientY) / 2 > 255 ? 255 : (e.clientX + e.clientY) / 2
            });
        };
        document.addEventListener("mousemove", updateMousePosition);
        return () => document.removeEventListener("mousemove", updateMousePosition);
    });
    return render({ mousePosition, rgbColor });
};

export const PanelMouseLoggerUsingRenderProps = () => {
    return (
        <Space direction="vertical">
            <p>Mouse position: </p>
            <MousePositionRenderProps
                render={({ mousePosition, rgbColor }) => (
                    <p>
                        ({mousePosition?.x}, {mousePosition?.y})
                        <div style={{
                            backgroundColor: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
                            padding: '10px',
                            border: '1px solid black'
                        }}>
                            Color: {JSON.stringify(rgbColor)}
                        </div>
                    </p>
                )}
            />
        </Space>
    );
};

type TemperatureInputProps = {
    renderKelvin: (props: { value: number; }) => JSX.Element;
    renderFahrenheit: (props: { value: number; }) => JSX.Element;
};
export const TemperatureInput = (props: TemperatureInputProps) => {
    const [value, setValue] = useState<number>(0);

    return (
        <>
            <InputNumber
                defaultValue={0}
                value={value}
                onChange={e => setValue(e as number)}
            />
            {props.renderKelvin({ value: value + 273.15 })}
            {props.renderFahrenheit({ value: (value * 9) / 5 + 32 })}
        </>
    );
};

export const PanelMouseLoggerUsingHOC = ({
    mousePosition
}: {
    mousePosition: MousePosition;
}) => {
    return (
        <div>
            Mouse position: {JSON.stringify(mousePosition)}
        </div>
    );
};


export const PointMouseLoggerUsingHOC = ({
    mousePosition
}: {
    mousePosition: MousePosition;
}) => {
    if (!mousePosition) {
        return null;
    }
    return (
        <p>
            ({mousePosition.x}, {mousePosition.y})
        </p>
    );
};
