// controllers/authController.js — Register, Login, Logout ve Current User (/me) Controller'ı (Web + API)
const UserModel = require('../models/userModel');
const AuthViews = require('../views/authViews');
const { getNavItemsForUser } = require('../utils/navigationHelper');
const {
    signToken,
    revokeToken,
    extractToken,
    setAuthCookie,
    clearAuthCookie
} = require('../utils/tokenHelper');

class AuthController {
    // ================= WEB: REGISTER =================
    static renderRegisterPage(req, res) {
        const html = AuthViews.renderRegisterPage({
            errorMessage: req.query.error,
            successMessage: req.query.success,
            currentUser: req.user || null
        });
        return res.status(200).send(html);
    }

    static registerWeb(req, res, next) {
        const {
            firstName, lastName, name, email, password, confirmPassword,
            role, department, graduationYear, company, jobTitle
        } = req.body || {};

        const preservedForm = { firstName, lastName, email, role, department, graduationYear, company, jobTitle };

        try {
            if (confirmPassword !== undefined && password !== confirmPassword) {
                const html = AuthViews.renderRegisterPage({
                    errorMessage: 'Girilen şifreler birbiriyle uyuşmuyor.',
                    formData: preservedForm,
                    currentUser: req.user || null
                });
                return res.status(400).send(html);
            }

            const newUser = UserModel.register({
                firstName, lastName, name, email, password,
                role, department, graduationYear, company, jobTitle
            });

            const html = AuthViews.renderRegisterPage({
                successMessage: `Hoş geldiniz ${newUser.name}! (${newUser.role}) hesabınız güvenle oluşturuldu.`,
                currentUser: req.user || null
            });
            return res.status(201).send(html);
        } catch (error) {
            if (error.statusCode === 400 || error.statusCode === 409) {
                const cleanMessage = error.message.replace(/^(VALIDATION_ERROR|EMAIL_EXISTS):\s*/, '');
                const html = AuthViews.renderRegisterPage({
                    errorMessage: cleanMessage,
                    formData: preservedForm,
                    currentUser: req.user || null
                });
                return res.status(error.statusCode).send(html);
            }
            return next(error);
        }
    }

    // ================= WEB: LOGIN =================
    static renderLoginPage(req, res) {
        const nextPath = (req.query && typeof req.query.next === 'string' && req.query.next.startsWith('/') && !req.query.next.startsWith('//'))
            ? req.query.next
            : '';

        const html = AuthViews.renderLoginPage({
            errorMessage: req.query ? req.query.error : null,
            successMessage: req.query ? req.query.success : null,
            nextPath,
            currentUser: req.user || null
        });
        return res.status(200).send(html);
    }

    static loginWeb(req, res, next) {
        const { email, password, next: nextPath } = req.body || {};
        const safeNext = (typeof nextPath === 'string' && nextPath.startsWith('/') && !nextPath.startsWith('//'))
            ? nextPath
            : '';

        try {
            const user = UserModel.authenticate(email, password);
            const token = signToken({ id: user.id, email: user.email, role: user.role });
            setAuthCookie(res, token);

            if (safeNext) {
                return res.redirect(safeNext);
            }

            return res.redirect('/login?success=' + encodeURIComponent(`Hoş geldiniz ${user.name}! (${user.role}) olarak giriş yaptınız.`));
        } catch (error) {
            if (error.statusCode === 400 || error.statusCode === 401) {
                const cleanMessage = error.message.replace(/^(VALIDATION_ERROR|INVALID_CREDENTIALS):\s*/, '');
                const html = AuthViews.renderLoginPage({
                    errorMessage: cleanMessage,
                    email: email || '',
                    nextPath: safeNext,
                    currentUser: null
                });
                return res.status(error.statusCode).send(html);
            }
            return next(error);
        }
    }

    // ================= WEB: LOGOUT =================
    static logoutWeb(req, res) {
        const previousName = req.user ? req.user.name : null;
        const token = extractToken(req);
        if (token) {
            revokeToken(token);
        }
        clearAuthCookie(res);

        const html = AuthViews.renderLogoutPage({ userName: previousName });
        return res.status(200).send(html);
    }

    // ================= API: REGISTER =================
    static registerApi(req, res, next) {
        try {
            const newUser = UserModel.register(req.body);
            return res.status(201).json({
                message: 'Kullanıcı kaydı başarıyla oluşturuldu!',
                user: newUser
            });
        } catch (error) {
            if (error.statusCode === 400 || error.statusCode === 409) {
                return res.status(error.statusCode).json({
                    status: error.statusCode,
                    error: error.statusCode === 409 ? 'Conflict' : 'Bad Request',
                    reason: error.message.replace(/^(VALIDATION_ERROR|EMAIL_EXISTS):\s*/, '')
                });
            }
            return next(error);
        }
    }

    // ================= API: LOGIN =================
    static loginApi(req, res, next) {
        try {
            const { email, password } = req.body || {};
            const user = UserModel.authenticate(email, password);
            const token = signToken({ id: user.id, email: user.email, role: user.role });
            setAuthCookie(res, token);

            return res.status(200).json({
                message: 'Giriş başarılı!',
                token,
                user
            });
        } catch (error) {
            if (error.statusCode === 400 || error.statusCode === 401) {
                return res.status(error.statusCode).json({
                    status: error.statusCode,
                    error: error.statusCode === 401 ? 'Unauthorized' : 'Bad Request',
                    reason: error.message.replace(/^(VALIDATION_ERROR|INVALID_CREDENTIALS):\s*/, '')
                });
            }
            return next(error);
        }
    }

    // ================= API: LOGOUT =================
    static logoutApi(req, res) {
        const token = extractToken(req);
        if (token) {
            revokeToken(token);
        }
        clearAuthCookie(res);

        return res.status(200).json({
            message: 'Başarıyla çıkış yapıldı ve oturum token\'ı iptal edildi.'
        });
    }

    // ================= API: CURRENT USER (/api/auth/me) =================
    static getCurrentUserApi(req, res) {
        if (!req.user) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                reason: req.authError || 'Bu endpoint için geçerli bir oturum (Bearer Token veya Cookie) gereklidir.'
            });
        }

        return res.status(200).json({
            authenticated: true,
            user: req.user,
            navItems: getNavItemsForUser(req.user)
        });
    }

    // ================= API: ROLE-BASED NAVIGATION (/api/auth/navigation) =================
    static getNavigationApi(req, res) {
        const user = req.user || null;
        return res.status(200).json({
            authenticated: Boolean(user),
            role: user ? user.role : 'guest',
            user,
            navItems: getNavItemsForUser(user)
        });
    }
}

module.exports = AuthController;
