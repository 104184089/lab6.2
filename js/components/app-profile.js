const Profile = {
    template:
        `
    <div id="profile">
    <div class="container mt-5">
        <h2 class="mb-4">{{ username }}'s Reading List</h2>
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
                        <button @click="removeFromReadingList(article)" class="btn btn-danger">Remove News</button>
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
            username: localStorage.getItem('username')  // Get username from local storage
        };
    },
    methods: {
        fetchReadingList() {
            if (this.username) {
                // base on the username was saved in localstorage (app-login.js) I will create for this only user a reading list
                // Only when this user login, their reading list will be display 
                //this.readingList = JSON.parse(localStorage.getItem(`${this.username}_readingList`)) || [];

                fetch("api-database/get-reading-list.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: this.username })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            this.readingList = data.articles.map(article => ({
                                url: article.article_url,
                                urlToImage: article.image_url,
                                title: article.title,
                                author: article.author,
                                publishedAt: article.published_at,
                                note: article.note
                            }));
                        } else {
                            alert("Failed to fetch reading list: " + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching reading list:', error);
                        alert("An error occurred while fetching the reading list.");
                    });
            }
        },

        removeFromReadingList(article) {
            // Remove the article from reading list of this user who is logging
            if (this.username) {
                // Delete article from local reading list
                this.readingList = this.readingList.filter(a => a.url !== article.url);

                fetch("api-database/remove-reading-list.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        article_url: article.url
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Article removed from reading list:', article);
                            alert("Article removed from reading list successfully!");
                        } else {
                            alert("Failed to remove from reading list: " + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert("An error occurred while removing from reading list.");
                    });
            }
        },
        saveNoteToReadingList(article) {
            // Save the note for this user who is logging
            if (this.username) {
                const updateNote = {
                    username: this.username,
                    article_url: article.url,
                    note: article.note
                };

                fetch("api-database/add-note.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateNote)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Note updated successfully:', article);
                            alert("Note updated successfully!");
                        } else {
                            alert("Failed to update note: " + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert("An error occurred while updating the note.");
                    });
            } else {
                alert("You must be logged in to update the note.");
            }
        },
    },
    mounted() {
        this.fetchReadingList();
    },
}