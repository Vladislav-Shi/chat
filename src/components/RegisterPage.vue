<template>
    <div class="row content">
        <div class="title">
            <h1>Регистрация</h1>
        </div>
        <div class="col-2"></div>
        <div class="col">
            <!-- Pills navs -->
            <div class="btn-group btns">
                <router-link to="/signin/" class="btn btn-secondary btn-lg">Login</router-link>
                <a href="#" class="btn btn-secondary btn-lg active">Register</a>
            </div>

            <!-- Pills content -->
            <div class="">
                <div class="">
                    <form>
                        <!-- Username input -->
                        <div class="form-outline mb-4">
                            <input type="text" v-model="username" id="registerUsername" class="form-control" />
                            <label class="form-label" for="registerUsername">Username</label>
                        </div>

                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <input type="email" v-model="email" id="registerEmail" class="form-control" />
                            <label class="form-label" for="registerEmail">Email</label>
                        </div>

                        <!-- Password input -->
                        <div class="form-outline mb-4">
                            <input type="password" v-model="password1" id="registerPassword" class="form-control" />
                            <label class="form-label" for="registerPassword">Password</label>
                        </div>

                        <!-- Repeat Password input -->
                        <div class="form-outline mb-4">
                            <input type="password" v-model="password2" id="registerRepeatPassword" class="form-control" />
                            <label class="form-label" for="registerRepeatPassword">Repeat password</label>
                        </div>

                        <!-- Checkbox -->
                        <div class="form-check d-flex justify-content-center mb-4">
                            <input class="form-check-input me-2" type="checkbox" value="" id="registerCheck" checked aria-describedby="registerCheckHelpText" />
                            <label class="form-check-label" for="registerCheck">
                                I have read and agree to the terms
                            </label>
                        </div>

                        <!-- Submit button -->
                    </form>
                    <button :disabled="submit" @click="register" class="btn btn-secondary btn-block mb-3 btn-lg">Sign in</button>
                </div>
            </div>
        </div>
        <div class="col-2"></div>

    </div>
</template>

<style>
.content {
    margin-top: 30px;
}
</style>

<script>
export default {
    name: 'RegisterPage',
    data() {
        return {
            username: '',
            email: '',
            password1: '',
            password2: '',
        }
    },
    computed: {
        submit() { return !(this.username.length && this.password1.length && this.email.length && (this.password1 == this.password2)) }
    },
    methods: {
        register() {
            let username = this.username
            let email = this.email
            let password1 = this.password1
            let password2 = this.password2

            this.$store.dispatch('register', {
                username: username,
                password1: password1,
                email: email,
                password2: password2
            })
                .then(() => this.$router.push('/'))
                .catch(err => console.log(err))
        }
    },
}
</script>

<style>
.title {
    text-align: center;
}

.btns {
    width: 100%;
    margin-bottom: 20px;
}
</style>