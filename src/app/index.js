import '../styles/main.scss'

class JSONFetcher {
  constructor() {
    this.container = document.querySelector('.data__container');
    this.trigger = document.querySelector('.data__trigger');

    this.trigger.addEventListener('click', this._addNewPost.bind(this));

    this.channel = new BroadcastChannel('app-channel');

    this.postCount = 1;

    this.channel.onmessage = (e) => {
      console.log(e.data);
      console.log('channel message received in app.js');
      this._addNewPost();
    };

    console.log(this.channel);
  }

  _addNewPost(evt) {
    this._executeFetch().then(data => this._renderPostHTML(data));
  }
  _executeFetch() {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${this.postCount}`)
      .then(response => response.json());
  }

  _renderPostHTML(data) {
    const markup = `
      <h4>Id: ${data.id}</h4>
      <h4>UserId: ${data.userId}</h4>
      <h5>Title: ${data.title}</h4>
      <p>${data.body}</p>
    `;

    this.container.insertAdjacentHTML('beforeend', markup);

    this.postCount++;
  }
}

window.JSONFetcher = new JSONFetcher();
