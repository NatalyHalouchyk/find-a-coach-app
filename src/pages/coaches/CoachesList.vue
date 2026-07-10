<template>
    <div>
        <base-dialog :show="!!error" title="An error occured!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <coach-filter
                @change-filter="setFilters"
            ></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="controls">
                    <base-button mode="outline" @click="load(true)">Refresh</base-button>
                    <base-button v-if="!isAuthenticated" link to="/auth?redirect=register">Login to Register as a Coach</base-button>
                    <base-button v-if="isAuthenticated && !isCoach && !isLoading" link to="/register">Register as a Coach</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner ></base-spinner>
                </div>            
                <ul v-else-if="hasCoaches">
                    <coach-item 
                        v-for="coach in filteredCoaches" 
                        :key="coach.id" 
                        :coach-data="coach">
                    </coach-item>
                </ul>
                <h3 v-else>No coaches found</h3>
            </base-card>
        </section>  
    </div>    
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import CoachFilter from '../../components/coaches/CoachFilter.vue';
import CoachItem from '../../components/coaches/CoachItem.vue';

export default {
    components: {
        CoachFilter,
        CoachItem       
    },
    data() {
        return {
            activeFilters: {
                frontend: true,
                backend: true,
                career: true
            },
            error: null,
            isLoading: false
        };
    },
    computed: {
        ...mapGetters([
            'coaches',
            'hasCoaches',
            'isAuthenticated',
            'isCoach'
        ]),
        filteredCoaches() {
            return this.coaches.filter(coach => {
                if (this.activeFilters.frontend && coach.areas.includes('frontend')) return true;
                if (this.activeFilters.backend && coach.areas.includes('backend')) return true;
                if (this.activeFilters.career && coach.areas.includes('career')) return true;
                return false;
            });
        }
    },
    created() {
        this.load();
    },
    methods: {
        ...mapActions(['loadCoaches']),

        handleError() {
          this.error = null;  
        },

        async load(forceRefresh = false) {
            this.isLoading = true;
            try {
                await this.loadCoaches({ forceRefresh: forceRefresh });
            } catch(error) {
                this.error = error.message || 'Something went wrong!';
            }           

            this.isLoading = false;
        },

        setFilters(updatedFilters) {
            this.activeFilters = updatedFilters;
        }
    }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>

