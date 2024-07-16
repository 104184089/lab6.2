// Creating the VueRouter

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        {
            path: '/login',
            component: Login,
            name: "login"
        },
        {
            path: '/logout',
            name: "logout"
        },
        {
            path: '/home',
            component: Home,
            name: 'home'
        },
        {
            path: '/signup',
            component: Signup,
            name: 'signup'
        },
    ],
    scrollBehavior() {
        return { 
            x: 0, 
            y: 0 
        };
    }
})

const app = Vue.createApp({
    data() {
        return {
            authenticatedUser: '',
            authenticated: false,
            error: false,
            errorMsg: '',
        }
    },

    mounted() {
        const isAuthenticated = localStorage.getItem('authenticated');
        if (isAuthenticated) {
            this.authenticated = true;
            this.$router.replace({ name: "home" });
        } else {
            this.$router.replace({ name: "login" });
        }
    },

    methods: {
        setAuthenticated(status) {
            this.authenticated = status;
            // Lưu trạng thái đăng nhập vào localStorage
            localStorage.setItem('authenticated', status);
        },
        logout() {
            this.authenticated = false;
            localStorage.removeItem('authenticated');
            this.$router.replace({ name: "login" });
        }
    },

})


app.component('nav-bar', {
    template: 
    `
    <div class="container-fluid">
        <div class="row">
            <nav id="nav_bar" class="w-100">
                <div class="nav-content">
                    <ul class="nav nav-underline">
                        <li class="nav-item logo-item">
                            <router-link class="nav-link" to="/home">
                                <img src="img/logo.png" alt="Logo" class="nav-logo">THE NEWS
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :class="{ active: $route.path === '/news' }" to="/news">News</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :class="{ active: $route.path === '/about' }" to="/about">About</router-link>
                        </li>
                    </ul>
                    <div class="nav-right">
                        <input type="text" class="form-control search-input" placeholder="Search...">
                        <router-link class="btn btn-outline-primary btn-login" to="/login" v-on:click="logout()">Log out<v-icon>mdi-logout</v-icon></router-link>
                    </div>
                </div>
            </nav>
        </div>
    </div>
    `,
    methods: {
        logout() {
            this.$root.logout();
        }
    }
});


const vuetify = Vuetify.createVuetify()
app.use(vuetify)
app.use(router)
app.mount('#app')