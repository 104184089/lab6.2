const Signup = {
    data: () => ({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        repassword: "",
        email: "",
        show: false,
        error: "",
        success: "",
        nameRules: [
            (v) => !!v || "Required",
            v => /^[a-zA-Z ]+$/.test(v) || "Letters only"
        ],
        userNameRules: [
            (v) => !!v || 'Required',
            (v) => v.length >= 3 || 'Username must be at least 3 characters',
        ],
        pwsdRules: [
            (v) => !!v || 'Password required',
            (v) => v.length >= 8 || 'Password must be at least 8 characters',
            (v) => /[$%^&*]/.test(v) || 'Password must contain at least 1 special character ($, %, ^, or *)',
        ],
        emailRules: [
            (v) => !!v || 'Email required',
            (v) => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(v) || 'Email must be valid',
        ],
    }),

    methods: {
        toggle() {
            this.show = !this.show
        },
        validate() {
            if (this.$refs.myForm.validate()) {
                this.register();
            }
        },
        register() {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: this.firstname,
                    lastname: this.lastname,
                    username: this.username,
                    password: this.password,
                    email: this.email
                })
            };
            fetch("api-database/signup.php", requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.success = "Registration successful. Please login.";
                        this.error = "";
                    } else {
                        this.error = data.message || "Registration failed.";
                        this.success = "";
                    }
                })
                .catch(error => {
                    this.error = "Error: " + error;
                    this.success = "";
                });
        }
    },

    template:
        `
    <v-container fill-height>
        <v-card class="form-container">
            <h2 class="text-center mb-4">Registration</h2>
            <v-form ref="myForm" @submit.prevent="validate" class="signupForm">
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="firstname" :rules="nameRules" label="First Name" required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="lastname" :rules="nameRules" label="Last Name" required></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="username" :rules="userNameRules" label="User Name" required></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="password" :rules="pwsdRules" label="Password" type="password" required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="repassword" :rules="[(v) => !!v || 'Re-enter password is required',
                        (v) => v === password || 'Passwords do not match']" label="Re-password" type="password" required></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="error">
                    <v-col cols="12">
                        <v-alert type="error" dismissible>{{ error }}</v-alert>
                    </v-col>
                </v-row>
                <v-row v-if="success">
                    <v-col cols="12">
                        <v-alert type="success" dismissible>{{ success }} <router-link to="/login">Login</router-link></v-alert>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="btn-container">
                        <v-btn color="primary" @click="toggle">Terms and Condition</v-btn>
                        <v-btn type="submit" color="success">Submit</v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="show">
                    <v-col cols="12">
                        <v-card class="terms-card">
                            <v-card-title>Terms and Condition</v-card-title>
                            <v-card-text>
                                Please read these terms and conditions of use carefully before accessing,
                                using or obtaining any materials, information, products or services.
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <p>Have an account? <router-link to="/login">Log in here</router-link></p>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-container>
    `,
}
