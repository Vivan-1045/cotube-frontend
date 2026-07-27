import api from './axios';

export const registerUser = (data) =>{
    return api.post('/auth/register',data);
}

export const loginUser = (data) =>{
    return api.post('/auth/login',data);
}

export const verifyEmail = (token) => {
    return api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
};

export const resendVerificationEmail = (email) =>{
    return api.post('/auth/resend-verification',{email});
}

