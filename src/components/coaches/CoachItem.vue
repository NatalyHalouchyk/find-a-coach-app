<template>
    <li>
        <h3>{{ fullName }}</h3>
        <h4>${{ rate }}/hour</h4>
        <div>
            <base-badge 
                v-for="area in coachData.areas" 
                :key="area" 
                :text="area"
                :type="area"
            >
            </base-badge>
        </div>
        <div class="actions">
            <base-button mode="outline" link :to="coachContactLink">Contact</base-button>
            <base-button link :to="coachDetailsLink">Details</base-button>
        </div>
    </li>
</template>

<script>
export default {
    props: {
        coachData: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        coachContactLink() {
            return `${this.$route.path}/${this.coachData.id}/contact`;
        },

        coachDetailsLink() {
            return `${this.$route.path}/${this.coachData.id}`;
        },

        fullName() {
            return `${this.coachData.firstName} ${this.coachData.lastName}`;
        },

        rate() {
            return this.coachData.hourlyRate;
        }
    }
}
</script>


<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>