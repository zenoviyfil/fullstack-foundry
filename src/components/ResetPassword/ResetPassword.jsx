import css from './ResetPassword.module.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { resetPassword } from '../../redux/auth/operations';
import icon from '../../assets/icons.svg';
import { toast, Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Repeat Password is required'),
});

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [inputTypePassword, setTypePassword] = useState('password');
  const [inputTypeRePassword, setTypeRePassword] = useState('password');
  const [iconPassword, setIconPassword] = useState('eye-off');
  const [iconRePassword, setIconRePassword] = useState('eye-off');

  const { token } = useParams();
  if(token){
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < new Date().getTime()) {
      console.log("Token expired.");
    } else {
      console.log("Valid token");
    }
  }

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async formData => {
    try {
      await dispatch(resetPassword(formData)).unwrap();
      toast.success('Password has been successfully changed! Please sign in.');
      reset();
      navigate('/signin');
    } catch (error) {
      toast.error(error || 'Failed to reset password. Please try again later.');
    }
  };

  const toggleShowPassword = () => {
    setTypePassword(prevType =>
      prevType === 'password' ? 'text' : 'password'
    );
    setIconPassword(prevIcon => (prevIcon === 'eye-off' ? 'eye' : 'eye-off'));
  };

  const toggleShowRePassword = () => {
    setTypeRePassword(prevType =>
      prevType === 'password' ? 'text' : 'password'
    );
    setIconRePassword(prevIcon => (prevIcon === 'eye-off' ? 'eye' : 'eye-off'));
  };

  return (
    <div className={css.signUpWrap}>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <h2 className={css.formTitle}>Change password</h2>
        <input type='hidden' name='token' id='token' value={token} />

        <label className={css.label}>Password</label>
        <div className={css.inputWrapper}>
          <input
            className={`${css.input} ${errors.password ? css.inputError : ''}`}
            {...register('password')}
            type={inputTypePassword}
            placeholder="Enter your password"
            autoComplete='off'
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className={css.iconButton}
          >
            {iconPassword === 'eye' ? (
              <svg className={css.icon}>
                <use href={`${icon}#eye`} />
              </svg>
            ) : (
              <svg className={css.icon}>
                <use href={`${icon}#eye-off`} />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className={css.errorMessage}>{errors.password.message}</p>
        )}

        <label className={css.label}>Repeat password</label>
        <div className={css.inputWrapper}>
          <input
            className={`${css.input} ${
              errors.repeatPassword ? css.inputError : ''
            }`}
            {...register('repeatPassword')}
            type={inputTypeRePassword}
            placeholder="Repeat password"
          />
          <button
            type="button"
            onClick={toggleShowRePassword}
            className={css.iconButton}
          >
            {iconRePassword === 'eye' ? (
              <svg className={css.icon}>
                <use href={`${icon}#eye`} />
              </svg>
            ) : (
              <svg className={css.icon}>
                <use href={`${icon}#eye-off`} />
              </svg>
            )}
          </button>
        </div>
        {errors.repeatPassword && (
          <p className={css.errorMessage}>{errors.repeatPassword.message}</p>
        )}

        <button className={css.button} type="submit">
          Reset password
        </button>
      </form>
      <p className={css.text}>
        Already have an account?{' '}
        <Link to="/signin">
          <span className={css.spanLink}>Sign In</span>
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
