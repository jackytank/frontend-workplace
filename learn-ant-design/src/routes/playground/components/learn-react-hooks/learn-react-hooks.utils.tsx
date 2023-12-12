import { Button, InputNumber, Space, message } from "antd";
import { MousePosition } from "antd/es/modal/interface";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import axiosClient from "../../../../api/axios-client";
import { Config } from "../../../../config";
import FormItem from "antd/es/form/FormItem";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';


export const BasicHookForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
    const { onSubmit } = useLearnFormik();
    console.log(watch('firstName'));
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                placeholder="First name"
                {...register('firstName', { required: true })}
            />
            {errors.firstName && <span>First name is required</span>}
            <br />
            <input
                type="text"
                placeholder="Last name"
                {...register('lastName', { required: true })}
            />
            {errors.lastName && <span>Last name is required</span>}
            <br />
            <input
                type="text"
                placeholder="Email"
                {...register('email', { required: true })}
            />
            {errors.email && <span>Email is required</span>}
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

type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    gender?: string;
    favoriteColor?: string;
};

const useLearnFormik = () => {
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
