<template>
    <div>
        <form @submit.prevent="onSubmit">
            <input type="password" v-model="newPassword" v-bind="newPasswordAttrs" placeholder="password" /><br>
            <small class="error" v-for="error in newPasswordAttrs.errors">
                {{ error }}<br>
            </small> <br>
            <input type="password" v-model="confirmPassword" v-bind="confirmPasswordAttrs" placeholder="confirm password" /><br>
            <small class="error" v-for="error in confirmPasswordAttrs.errors">
                {{ error }}<br>
            </small> <br>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const oldPassword = '12345678';

const { handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            newPassword: yup
                .string()
                .required()
                .min(8)
                .max(16)
                .default('')
                .test('password', 'Password must be different from the old password', (value) => value !== oldPassword),
            confirmPassword: yup
                .string()
                .required()
                .oneOf([yup.ref('newPassword')], 'Passwords must match')
                .default('')

        })
    )
});

const onSubmit = handleSubmit((values) => {
    // do something with the values
    alert(`values: ${JSON.stringify(values)}`);
});

const [newPassword, newPasswordAttrs] = defineField(
    'newPassword',
    {
        props: (state) => ({
            errors: state.errors
        })
    }
);
const [confirmPassword, confirmPasswordAttrs] = defineField(
    'confirmPassword',
    {
        props: (state) => ({
            errors: state.errors
        })
    }
);

</script>

<style scoped>
.error {
    color: red;
}
</style>