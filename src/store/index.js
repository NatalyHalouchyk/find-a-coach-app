import { createStore } from 'vuex';

import auth from './modules/auth.js';
import coaches from './modules/coaches.js';
import requests from './modules/requests.js';

const store = createStore({
    modules: {
        auth,
        coaches, 
        requests
    }
});

export default store;