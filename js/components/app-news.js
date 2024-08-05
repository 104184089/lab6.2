const News = {
    components: {
        paginate: VuejsPaginateNext,
    },
    data() {
        return {
            articles: [],    // store article from api
            currentStartIndex: 0,

            // Other article with pagination
            otherArticles: [],
            currentPage: 1,
            perPage: 8,

            // Social function like and unlike
            likes: {},
            // manage user likes
            userLikes: {},
        };
    },
    computed: {
        topArticles() {
            return this.articles.filter(article => 
                article.urlToImage && article.title && article.author && article.publishedAt && article.url
            ).slice(this.currentStartIndex, this.currentStartIndex + 4);
        },

        // Get the number of article for each page
        paginateArticles() {
            return this.otherArticles.filter(article =>
                article.urlToImage && article.title && article.author && article.publishedAt && article.url
            ).slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
        },
        pageCount() {
            return Math.ceil(this.otherArticles.length / this.perPage);
        }
    },
    methods: {
        fetchArticles() {
            // fetch api to get data
            fetch("https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=6d9c90bee93d417a9e02cda2b6350693")
                .then(response => response.json())
                .then(data => {
                    this.articles = data.articles;
                })
                .catch(error => console.error('Error fetching articles:', error));
        },

        // fetch other topic of article using API
        fetchOtherArticles(page = 1) {
            fetch("https://newsapi.org/v2/everything?q=apple&sortBy=popularity&apiKey=6d9c90bee93d417a9e02cda2b6350693")
                .then(response => response.json())
                .then(data => {
                    this.otherArticles = data.articles;
                })
                .catch(error => console.error('Error fetching other articles:', error));
        },

        // For next button in news page
        nextArticles() {
            if (this.currentStartIndex + 4 < this.articles.length) {
                this.currentStartIndex += 4;
            }
        },
        // For previuos button in news page
        prevArticles() {
            if (this.currentStartIndex - 4 >= 0) {
                this.currentStartIndex -= 4;
            }
        },

        // For pagination of others article
        clickCallback(pageNum) {
            this.currentPage = Number(pageNum);
        },

        // Function to add the article to reading list
        // Add article to reading list, is saved in database through API reading-list.php
        addToReadingList(article) {
            const username = localStorage.getItem('username');
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

    },
    mounted() {
        // fetch articles when the component is mounted
        this.fetchArticles();

        // fetch other topic of articles when component is mounted
        this.fetchOtherArticles();

        // display number of likes from local storage
        this.loadLikes();
    },


    template: `
    <div id="news-component">
        <div class="container mt-5">

            <div class="row">

                <div class="col">

                    <h2 class="mb-4">Latest News about Tesla</h2>

                    <div class="d-flex justify-content-between align-items-center" id="topArticles">
                        <button class="btn btn-primary" @click="prevArticles">&#8592;</button>
                            <div class="d-flex overflow-hidden" style="width: 95%;" >
                                <div class="d-flex">
                                <!-- Loop through the first 4 articles -->
                                    <a v-for="article in topArticles" :href="article.url" target="_blank" class="card-link">
                                        <div class="card mr-3" id="card-article">
                                            <img :src="article.urlToImage" class="card-img-top" alt="">
                                            <div class="card-body">
                                                <h5 class="card-title">{{ article.title }}</h5>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        <button class="btn btn-primary" @click="nextArticles">&#8594;</button>
                    </div>

                </div>
            </div>


            <div class="row">
                <div class="col">
                <h2 class="mt-5">Other Articles</h2>
                    <div id="other-articles">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col" class="col-md-3">Image</th>
                                <th scope="col" class="col-md-3">Title</th>
                                <th scope="col" class="col-md-1">Author</th>
                                <th scope="col" class="col-md-2">Published At</th>
                                <th scope="col" class="col-md-1">View Article</th>
                                <th scope="col" class="col-md-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="article in paginateArticles">
                                <td>
                                    <img :src="article.urlToImage" alt="" class="img-fluid">
                                </td>
                                <td id="other-article-title">{{ article.title }}</td>
                                <td id="other-article-author">{{ article.author }}</td>
                                <td>{{ article.publishedAt }}</td>
                                <td id="other-article-readmore">
                                    <a :href="article.url" target="_blank">Read more</a>
                                </td>
                                <td>
                                    <button @click="addToReadingList(article)" class="btn btn-success">Add to Reading List</button>
                                    

                                    <input @click="like(article)" type="checkbox" class="btn-check" :id="'btn-check-2-outlined'  + article.url.replace(/[^a-zA-Z0-9]/g, '')" autocomplete="off" :checked="isLiked(article)">
                                    <label class="btn btn-outline-secondary" :for="'btn-check-2-outlined' + article.url.replace(/[^a-zA-Z0-9]/g, '')">Likes: {{ getLikeCount(article) }}</label><br>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>

                    <!-- Vue Paginate template -->
	                <paginate 
		                :page-count="pageCount"    
		                :page-range="5" 
		                :margin-pages="1"
		                :click-handler="clickCallback"
		                :prev-text=" 'Prev Page' "	
		                :next-text="'Next Page'" 
		                :container-class="'pagination'" 
		                :active-class="'currentPage'"
                        :page-class="'page-item'"
                        :page-link-class="'page-link'"
		                >
	                </paginate>
                </div>
            </div>
        </div>
    </div>
    `,
};