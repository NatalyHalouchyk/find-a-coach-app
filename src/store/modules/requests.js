export default {
    state() {
        return {
            requests: []
        };
    },

    mutations: {
        addRequest(state, payload) {
            state.requests.push(payload);
        },

        setRequests(state, payload) {
            state.requests = payload;
        }
    },

    actions: {
        async fetchRequests(context) {
            const coachId = context.rootGetters.userId;

            const res = await fetch(`https://find-a-coach-a96fe-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=${context.rootGetters.token}`);    
            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(res.message || 'Failed to fetch requests.');
                throw error;
            }

            const requests = [];
            for (let id in resData) {
                const request = {
                    id: id,
                    coachId: coachId,
                    userEmail: resData[id].userEmail,
                    message: resData[id].message
                };

                requests.push(request);
            }
        
            await context.commit('setRequests', requests);
        },

        async sendRequestToCoach(context, payload) {
            const newRequest = {
                
                userEmail: payload.email,
                message: payload.message
            };

            const res = await fetch(`https://find-a-coach-a96fe-default-rtdb.europe-west1.firebasedatabase.app/requests/${newRequest.coachId}.json`, {
                method: 'POST',
                body: JSON.stringify(newRequest)
            });    
            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(res.message || 'Failed to send request.');
                throw error;
            }

            newRequest.id = resData.name;
            newRequest.coachId = payload.coachId,         
            await context.commit('addRequest', newRequest);


        }
    },

    getters: {
        hasRequests: (state, getters) => {
            return getters.requests && getters.requests.length > 0
        },
        requests: (state, getters, rootState, rootGetters) => state.requests.filter(request => request.coachId === rootGetters.userId)
    }
}