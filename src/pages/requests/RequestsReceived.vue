<template>
    <div>
        <base-dialog :show="!!error" title="An error occured!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <header>
                    <h2>Requests Received</h2>
                </header>
                <base-spinner v-if="isLoading"></base-spinner>
                <ul v-else-if="hasRequests && !isLoading">
                    <request-item 
                        v-for="request in receivedRequests" 
                        :key="request.id" 
                        :email="request.userEmail" 
                        :message="request.message"
                    >
                    </request-item>
                </ul>
                <h3 v-else>You haven't received any requests yet!</h3>
            </base-card>
        </section>
    </div>    
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import RequestItem from '../../components/requests/RequestItem.vue';

export default {
    components: {
        RequestItem
    },
    data() {
        return {
            error: null,
            isLoading: false
        };
    },
    computed: {
        ...mapGetters(['hasRequests', 'requests']),
        receivedRequests() {
            return this.requests;
        }
    },

    created() {
        this.loadRequests();
    },

    methods: {
        ...mapActions(['fetchRequests']),

        handleError() {
            this.error = null;
        },

        async loadRequests() {
            this.isLoading = true;

            try {
                await this.fetchRequests();
            } catch(e) {
                this.error = e.message || 'Something went wrong!';
            }

            this.isLoading = false;
        }
    },

    
    
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>