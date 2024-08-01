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

                            <button @click="addToReadingList(article)" class="btn btn-success">Add to Reading List</button>
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

        // Get article to reading list
        addToReadingList(article) {
            const username = localStorage.getItem('username');    // get username from local storage
            // define the user who is logging and create reading list for them
            if (username) {
                // create object importArticle include information of article to save to database
                const importArticle = {
                    username: username,
                    article_url: article.url,
                    title: article.title,
                    image_url: article.urlToImage,
                    author: article.author,
                    published_at: article.publishedAt,
                    note: "Article added to reading list"
                };
        
                fetch("api-database/add-reading-list.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(importArticle)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Article added to reading list:', article); // Just to test whether added right article or not
                        alert("Add To Reading List Successfully!");
                    } else {
                        alert("Failed to add to reading list: " + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("An error occurred while adding to reading list.");
                });
            } else {
                alert("You must be logged in to add to the reading list.");
            }
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