import api from './axios';

export const registerUser = (data) =>{
    return api.post('/auth/register',data);
}

export const loginUser = (data) =>{
    return api.post('/auth/login',data);
}

export const verifyEmail = (token) => {
    return api.get(`/auth/verify-email?token=${token}`);
};

export const resendVerificationEmail = (email) =>{
    return api.post("/auth/resend-verification", null, {
        params: { email },
    });
}

export const getverificationStatus = (email) =>{
    return api.get(`/auth/verification-status?email=${email}`);
}

export const forgotPassword = (email) => {
    return api.post("/auth/forgot-password", {email});
};

export const resetPassword = (token,password) => {
    return api.post("/auth/reset-password", {
        token,
        password
    });
};

export const validateResetToken = (token) => {
    return api.get("/auth/validate-reset-token",{
        params:{token},
    });
};


export const getPasswordResetStatus = (email) => {
    return api.get("/auth/password-reset-status",{
        params: {email},
    })
}

