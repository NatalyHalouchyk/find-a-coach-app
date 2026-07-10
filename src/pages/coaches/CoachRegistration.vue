<template>
    <section>
        <base-card>
            <h2>Register as a coach now!</h2>
            <coach-form @save-data="saveData"></coach-form>
        </base-card>        
    </section>
</template>

<script>
import { mapActions } from 'vuex';
import CoachForm from '../../components/coaches/CoachForm.vue';

export default {
    components: {
        CoachForm
    },

    methods: {
        ...mapActions(['registerCoach']),

        saveData(data) {
            this.registerCoach(data);
            this.$router.replace('/coaches');
        }
    }

}
</script>