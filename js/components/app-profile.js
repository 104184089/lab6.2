const Profile = {
    template: 
    `
    <div id="profile">
    <div class="container mt-5">
        <h2 class="mb-4">My Reading List</h2>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col" class="col-md-3">Image</th>
                    <th scope="col" class="col-md-3">Title</th>
                    <th scope="col" class="col-md-1">Author</th>
                    <th scope="col" class="col-md-2">Published At</th>
                    <th scope="col" class="col-md-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="article in readingList">
                    <td>
                        <img :src="article.urlToImage" alt="" class="img-fluid">
                    </td>
                    <td>{{ article.title }}</td>
                    <td>{{ article.author }}</td>
                    <td>{{ article.publishedAt }}</td>
                    <td>
                        <textarea v-model="article.note" class="form-control mb-2" placeholder="Take a note..."></textarea>
                        <button @click="saveNoteToReadingList(article)" class="btn btn-primary mb-2">Save Note</button><br>
                        <button @click="removeFromReadingList(article)" class="btn btn-danger">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
    `,
    data() {
        return {
            readingList: [], // Store the articles in reading list
        };
    },
    methods: {
        fetchReadingList() {
            // Fetch the reading list from an API or local storage
            this.readingList = JSON.parse(localStorage.getItem('readingList')) || [];
        },

        // addToReadingList(article) {
        //     this.readingList.push(article);
        //     localStorage.setItem('readingList', JSON.stringify(this.readingList));
        // },

        removeFromReadingList(article) {
            this.readingList = this.readingList.filter(a => a.url !== article.url);
            localStorage.setItem('readingList', JSON.stringify(this.readingList));
        },
        saveNoteToReadingList(article) {
            // Save the note
            const index = this.readingList.findIndex(a => a.url === article.url);
            if (index !== -1) {
                this.readingList[index].note = article.note;
                localStorage.setItem('readingList', JSON.stringify(this.readingList));
            }
        },
    },
    mounted() {
        this.fetchReadingList();
    },
}