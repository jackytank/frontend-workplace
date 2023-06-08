import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField } from '@mui/material';

const SignupForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInputs>();
    const onSubmit: SubmitHandler<IFormInputs> = data => alert(JSON.stringify(data, null, 2));
    console.log(watch("firstName"));
    console.log(watch("lastName"));
    console.log(watch("password"));
    console.log(watch("age"));
  
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField type='text' placeholder='First name' {...register("firstName", { required: true, maxLength: 20 })} /> <br />
          {errors.firstName?.type === 'required' && <p role='alert'>First name is required</p>}
  
          <TextField type='text' placeholder='Last name' {...register("lastName", { required: true, pattern: /^[A-Za-z]+$/i })} /> <br />
          <TextField type='password' placeholder='Password' {...register("password", { required: true, min: 8, max: 100 })} /> <br />
          {errors.password?.type === 'required' && <p role='alert'>Password is required</p>}
          
          <TextField type='number' placeholder='Age' {...register("age", { required: true, min: 18, max: 99 })} /> <br />
          {errors.age?.type === 'required' && <p role='alert'>Age is required</p>}
          <Button type='submit' variant='outlined'>Signup</Button>
        </form>
      </>
    );
}

export default SignupForm