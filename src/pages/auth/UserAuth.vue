<template>
    <div>
        <base-dialog :show="!!error" title="An error occured" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" fixed title="Authenticating...">
            <base-spinner></base-spinner>    
        </base-dialog>
        <base-card>
            <form @submit.prevent="submitForm">
                <div class="form-control" :class="{invalid: !email.isValid}">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model.trim="email.val" @blur="clearValidity('email')">
                    <p v-if="!email.isValid">Invalid email</p>
                </div>
                <div class="form-control" :class="{invalid: !password.isValid}">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model.trim="password.val" @blur="clearValidity('password')">
                    <p v-if="!password.isValid">{{ passwordErrorMessage }}</p>
                </div>
                <base-button>{{ submitBtnCaption }}</base-button>
                <base-button type="button" mode="flat" @click="swithAuthForm">{{ switchModeBtnCaption }}</base-button>
            </form>
        </base-card>  
    </div>    
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            email: {
                val: '',
                isValid: true                
            },
            error: null,
            formIsValid: true,
            isLoading: false,
            mode: 'login',
            password: {
                val: '',
                isValid: true
            },
        };
    },

    computed: {
        passwordErrorMessage () {
            if(this.mode === 'signup') {
                return 'Password must contain at least one lowercase letter, one uppercase letter, one digit and be between 8 and 16 characters long.';
            }
            return 'Password must be between 8 and 16 characters long.';
        },

        submitBtnCaption() {
            if(this.mode === 'login') return 'Login';
            else return 'Signup';
        },

        switchModeBtnCaption() {
            if(this.mode === 'login') return 'Signup instead';
            else return 'Login instead';
        }
    },

    methods: {
        ...mapActions(['login', 'signup']),

        clearValidity(input) {
            this[input].isValid = true;
        },

        handleError() {
            this.error = null;
        },

        async submitForm() {
            this.validateForm();

            if(!this.formIsValid) return false;

            this.isLoading = true;

            const payload = {
                email: this.email.val,
                password: this.password.val
            }

            try {
                if(this.mode === 'signup') {
                    await this.signup(payload);
                } else {
                    await this.login(payload);
                }
                const redirectURL = '/' + (this.$route.query.redirect || 'coaches');
                this.$router.replace(redirectURL);
            } catch (error) {
                this.error = error.message || 'Failed to authenticate, try later.';
            }

            this.isLoading = false;
        },

        swithAuthForm() {
            if (this.mode === 'login') this.mode = 'signup';
            else this.mode = 'login';
        },

        validateForm() {
            this.formIsValid = true;
           
            if (!this.email.val || !this.email.val.match(/[\w.]+@[a-z]+\.[a-z]{2,}/i)) {
                this.email.isValid = false;
                this.formIsValid = false;
            }

            if (this.mode === 'signup') {
               if (!this.password.val || !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(this.password.val)) {
                    this.password.isValid = false;
                    this.formIsValid = false;
                } 
            } else {
                if (!this.password.val || this.password.val.length < 8 || this.password.val.length > 16) {
                    this.password.isValid = false;
                    this.formIsValid = false;
                } 
            }
            
        }
    }
}
</script>

<style scoped>
form {
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>