import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup/dist/yup';
import '../LoginForm.css'

export type UserLoginForm = {
    email: string;
    password: string;
};

function LoginForm({onSubmit}: {onSubmit: (data: UserLoginForm) => void}) {
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        password: Yup.string()
            .required('Password is required')
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<UserLoginForm>({
        resolver: yupResolver(validationSchema),
        defaultValues:
            {
                email: '',
                password: ''
            }
    });

    return <form onSubmit={handleSubmit(onSubmit)} className='form-container' data-testid='form'>
        <div className='form-group'>
            <label className='form-label text-sm-start ' id='email'>Email</label>
            <input
                aria-labelledby='email'
                type='text'
                placeholder='email@example.com'
                {...register('email')}
                data-testid='email-input'
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email ?
                <div className='invalidfeedback text-sm-center text-small' id='emailError'>{errors.email?.message}</div>:
                <div className='gap'/>}
        </div>
        <div className='form-group'>
            <label className='form-label text-sm-start' id='password'>Password</label>
            <input
                aria-labelledby='password'
                placeholder='Password'
                type='password'
                {...register('password')}
                data-testid='password-input'
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password ?
                <div className='invalidfeedback text-sm-center text-small' id='passwordError'>{errors.password?.message}</div>:
                <div className='gap'/>}
        </div>
        <div className='form-group'>
            <button type='submit' className='btn btn-primary' data-testid='login'>
                Log in
            </button>
        </div>
    </form>
}

export default LoginForm;