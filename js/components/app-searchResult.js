const searchResult = {
    template:
        `
    <div class="container mt-5" id="searchResult">
    <h2 class="mb-4">Search Results</h2>
        <div v-if="searchResults.length === 0">
            <p>No results found for "{{ searchQuery }}".</p>
        </div>

        <div v-else>
            <div class="row">
                <div class="col-md-4 mb-4" v-for="article in searchResults">
                    <div class="card">
                        <img class="card-img-top" :src="article.urlToImage" alt="">
                        <div class="card-body">
                            <h5 class="card-title">{{ article.title }}</h5>
                            <p class="card-text">{{ article.description }}</p>
                            <a :href="article.url" target="_blank" class="btn btn-primary">Read more</a>

                            <input @click="like(article)" type="checkbox" class="btn-check" :id="'btn-check-2-outlined'  + article.url.replace(/[^a-zA-Z0-9]/g, '')" autocomplete="off" :checked="isLiked(article)">
                            <label class="btn btn-outline-secondary" :for="'btn-check-2-outlined' + article.url.replace(/[^a-zA-Z0-9]/g, '')">Likes: {{ getLikeCount(article) }}</label><br>

                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
    `,
    props: {
        searchInput: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            searchResults: [], // to store search resutl

            // Social function like and unlike
            likes: {},
            // manage user likes
            userLikes: {},
        };
    },
    mounted() {
        this.fetchSearchResults();

        // display number of likes from local storage
        this.loadLikes();
    },
    watch: {
        searchInput: 'fetchSearchResults'
    },
    methods: {
        fetchSearchResults() {
            fetch(`https://newsapi.org/v2/everything?q=${this.searchInput}&sortBy=publishedAt&apiKey=6d9c90bee93d417a9e02cda2b6350693`)
                .then(response => response.json())
                .then(data => {
                    this.searchResults = data.articles;
                })
                .catch(error => console.error('Error fetching search results:', error));
        },

        // display likes number from local storage
        loadLikes() {
            this.likes = JSON.parse(localStorage.getItem('article_likes')) || {};
            const username = localStorage.getItem('username');
            if (username) {
                this.userLikes = JSON.parse(localStorage.getItem(`${username}_userLikes`)) || {};
            }
        },

        // saved likes number to local storage
        saveLikes() {
            localStorage.setItem('article_likes', JSON.stringify(this.likes));
            const username = localStorage.getItem('username');
            if (username) {
                localStorage.setItem(`${username}_userLikes`, JSON.stringify(this.userLikes));
            }
        },

        // social function like article
        like(article) {
            const url = article.url;
            const username = localStorage.getItem('username');

            // If user didn't like one specific article
            if (!this.userLikes[username]) {
                this.userLikes[username] = {};
            }

            // If user liked one specific article
            if (this.userLikes[username][url]) {
                this.likes[url]--;                      //Reduce the number of likes of the post by 1
                delete this.userLikes[username][url];   //Remove user's like status for this post
            } else {
                this.likes[url] = (this.likes[url] || 0) + 1;    // Increase the number of likes of the post by 1
                this.userLikes[username][url] = true;            // Record the user's like status for this post
            }

            this.saveLikes();
        },

        // get like number for an article to display
        getLikeCount(article) {
            return this.likes[article.url] || 0;
        },

        isLiked(article) {
            const username = localStorage.getItem('username');
            return username && this.userLikes[username] && this.userLikes[username][article.url];
        },

    }
}