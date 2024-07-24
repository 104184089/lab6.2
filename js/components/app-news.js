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
        };
    },
    computed: {
        topArticles() {
            return this.articles.slice(this.currentStartIndex, this.currentStartIndex + 4);
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
            fetch("https://newsapi.org/v2/everything?q=tesla&from=2024-06-21&sortBy=publishedAt&apiKey=6d9c90bee93d417a9e02cda2b6350693")
                .then(response => response.json())
                .then(data => {
                    this.articles = data.articles;
                })
                .catch(error => console.error('Error fetching articles:', error));
        },

        // fetch other topic of article using API
        fetchOtherArticles(page = 1) {
            fetch("https://newsapi.org/v2/everything?q=apple&from=2024-07-20&to=2024-07-20&sortBy=popularity&apiKey=6d9c90bee93d417a9e02cda2b6350693")
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
    },
    mounted() {
        // fetch articles when the component is mounted
        this.fetchArticles();

        // fetch other topic of articles when component is mounted
        this.fetchOtherArticles();
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
                                <th scope="col" class="col-md-4">Image</th>
                                <th scope="col" class="col-md-3">Title</th>
                                <th scope="col" class="col-md-2">Author</th>
                                <th scope="col" class="col-md-2">Published At</th>
                                <th scope="col" class="col-md-1">View Article</th>
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