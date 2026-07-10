export default {
    state() {
        return {
            lastFetch: null,
            coaches: [
                {
                    id: 'c1',
                    firstName: 'Maximilian',
                    lastName: 'Schwarzmuller',
                    areas: ['frontend', 'backend', 'career'],
                    description: "I'am Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
                    hourlyRate: 30
                },
                {
                    id: 'c2',
                    firstName: 'Julie',
                    lastName: 'Jones',
                    areas: ['frontend', 'career'],
                    description: "I'am Julie and as a senior developer in a big tech company, I can help you ",
                    hourlyRate: 30
                }
            ]
        }
    },
    mutations: {
        addCoach(state, payload) {
            state.coaches.push(payload);
        },

        setCoaches(state, payload) {
            state.coaches = payload;
        },

         setFetchTimestamp(state) {
            state.lastFetch = new Date().getTime();
         }
    },
    actions: {
        async loadCoaches(context, payload) {
            if (!payload.forceRefresh && !context.getters.shouldUpdate) return;

            const res = await fetch(`https://find-a-coach-a96fe-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`);

            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(resData.message || 'Failed to fetch.');
                throw error;
            }

            const coaches = [];

            for (const id in resData) {
                const coach = {
                    id: id,
                    firstName: resData[id].firstName,
                    lastName: resData[id].lastName,
                    description: resData[id].description,
                    hourlyRate: resData[id].hourlyRate,
                    areas: resData[id].areas
                }
                coaches.push(coach);
            }

            context.commit('setCoaches', coaches);
            context.commit('setFetchTimestamp');
        },

        async registerCoach(context, data) {
            const userId = context.rootGetters.userId;
            const coachData = {
                firstName: data.first,
                lastName: data.last,
                description: data.desc,
                hourlyRate: data.rate,
                areas: data.areas
            };

            const res = await fetch(`https://find-a-coach-a96fe-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=${context.rootGetters.token}`, {
                method: 'PUT',
                body: JSON.stringify(coachData)
            });

            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(resData.message || 'Failed to reqister a coach.');
                throw error;
            }

            context.commit('addCoach', {
                ...coachData,
                id: userId
            });
        }
    },
    getters: {
        coaches: (state) => state.coaches,
        hasCoaches: (state) => state.coaches && state.coaches.length > 0,
        isCoach (state, getters, rootState, rootGetters) {
            const coaches =  getters.coaches;
            const userId = rootGetters.userId;

            return coaches.some(coach => coach.id === userId);
        },

        shouldUpdate: (state) => {
            const lastFetch = state.lastFetch;
            if (!lastFetch) return true;

            const currTimestamp = new Date().getTime();
            return (currTimestamp - lastFetch) / 1000 > 60;
        }
    }
};