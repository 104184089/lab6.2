const News = {
    data() {
        return {
            articles: [],    // store article from api
            currentStartIndex: 0
        };
    },
    computed: {
        topArticles() {
            return this.articles.slice(this.currentStartIndex, this.currentStartIndex + 4);
        }
    },
    methods: {
        fetchArticles() {
            // fetch api to get data
            fetch("https://newsapi.org/v2/everything?q=tesla&from=2024-06-14&sortBy=publishedAt&apiKey=f9828bb35207403990393bb3090b06d4")
                .then(response => response.json())
                .then(data => {
                    this.articles = data.articles;
                })
                .catch(error => console.error('Error fetching articles:', error));
        },
        nextArticles() {
            if (this.currentStartIndex + 4 < this.articles.length) {
                this.currentStartIndex += 4;
            }
        },
        prevArticles() {
            if (this.currentStartIndex - 4 >= 0) {
                this.currentStartIndex -= 4;
            }
        }
    },
    mounted() {
        // fetch articles when the component is mounted
        this.fetchArticles();
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
                                <div class="d-flex" style="width: 100%; overflow-x: auto; white-space: nowrap;">
                                <!-- Loop through the first 4 articles -->
                                    <div v-for="article in topArticles" class="card mr-3" id="card-article">
                                    <img :src="article.urlToImage" class="card-img-top" alt="">
                                        <div class="card-body">
                                            <h5 class="card-title">{{ article.title }}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <button class="btn btn-primary" @click="nextArticles">&#8594;</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
};