let timer;

export default {
    state() {
        return {
            didAutoLogout: false,
            token: null,
            userId: null           
        };
    },

    mutations: {
        setAutoLogout(state) {
            state.didAutoLogout = true;
        },
        setUser(state, payload) {
            state.userId = payload.userId;
            state.token = payload.token;
            state.didAutoLogout = false;
        }
    },
    actions: {
        async auth(context, payload) {
            const mode = payload.mode;
            let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.VUE_APP_API_KEY}`;

            if (mode === 'signup') {
                url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.VUE_APP_API_KEY}`;
            }

            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true
                })
            });

            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(resData.message || 'Failed to login. Check your email and password.');
                throw error;
            }

            // +resData.expiresIn converts it into number
            const expiresIn = +resData.expiresIn * 1000;
            const expirationDate = new Date().getTime() + expiresIn;
            
            // to store user data, because every time the /auth route is reached, browser is refreshed, app starts and all vuex data are lost
            localStorage.setItem('token', resData.idToken);
            localStorage.setItem('userId', resData.localId);
            localStorage.setItem('tokenExpiration', expirationDate);

            timer = setTimeout(() => {
                context.dispatch('autoLogout');
            }, expiresIn);

            context.commit('setUser', {
                userId: resData.localId,
                token: resData.idToken
            });
        },

        autoLogin(context) {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const tokenExpiration = localStorage.getItem('tokenExpiration');

            const expiresIn = +tokenExpiration - new Date().getTime();

            if (expiresIn < 0) {
                return;
            }

            timer = setTimeout(() => {
                context.dispatch('autoLogout');
            }, expiresIn)

            if (token && userId) {
                context.commit('setUser', {
                    userId: userId,
                    token: token
                });
            }
        },

        autoLogout(context) {
            context.dispatch('logout');
            context.commit('setAutoLogout');
        },

        async login(context, payload) {
            return context.dispatch('auth', {
                ...payload,
                mode: 'login'
            });
        },

        logout(context) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenExpiration');

            clearTimeout(timer);

            context.commit('setUser', {
                userId: null,
                token: null
            });
        },

        async signup(context, payload) {            
            return context.dispatch('auth', {
                ...payload,
                mode: 'signup'
            });
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        didAutoLogout: (state) => state.didAutoLogout,
        userId: (state) => state.userId,
        token: (state) => state.token,
    }
}