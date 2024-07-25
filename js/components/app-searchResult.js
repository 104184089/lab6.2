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
        };
    },
    mounted() {
        this.fetchSearchResults();
    },
    watch: {
        searchInput: 'fetchSearchResults'
    },
    methods: {
        fetchSearchResults() {
            fetch(`https://newsapi.org/v2/everything?q=${this.searchInput}&from=2024-06-25&sortBy=publishedAt&apiKey=6d9c90bee93d417a9e02cda2b6350693`)
                .then(response => response.json())
                .then(data => {
                    this.searchResults = data.articles;
                })
                .catch(error => console.error('Error fetching search results:', error));
        }
    }
}