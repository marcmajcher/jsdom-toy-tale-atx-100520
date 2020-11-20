let toyList = [];

const toysUrl = 'http://localhost:3000/toys';
const el = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
  el('new-toy-form').addEventListener('submit', addNewToyFromForm);
  el('show-hide-form-btn').addEventListener('click', () =>
    toggleVisibility('new-toy-form')
  );
  el('close-form-btn').addEventListener('click', () =>
    toggleVisibility('new-toy-form', false)
  );

  doFetch(toysUrl).then(createToyCards);
});

function createToyCards(toys) {
  toyList = toys;
  renderToys();
}

function renderToys() {
  el('toy-collection').innerHTML = '';
  toyList.forEach(appendToyToCollection);
}

function appendToyToCollection(toy) {
  el('toy-collection').append(getToyCard(toy));
}

function getToyCard(toy) {
  const toyCard = document.createElement('div');
  toyCard.classList.add('card');

  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p>${toy.likes} Likes </p>
  `;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-btn');
  likeButton.innerText = 'Like ❤️';
  toyCard.append(likeButton);
  toyCard.addEventListener('click', () => incrementLikes(toy));

  return toyCard;
}

function addNewToyFromForm(event) {
  event.preventDefault();

  const toyData = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0,
  };

  toyList.push(toyData);
  renderToys();

  doFetch(toysUrl, 'POST', toyData).then((json) => {
    toyData.id = json.id;
    renderToys(); // I still don't like the double renderToys() here, but ¯\_(ツ)_/¯
  });
}

function incrementLikes(toy) {
  toy.likes++;
  renderToys();

  doFetch(`${toysUrl}/${toy.id}`, 'PATCH', {
    likes: toy.likes,
  });
}

/////

function toggleVisibility(element, visible) {
  const classes = el(element).classList;
  if (classes.contains('hidden') && !visible) {
    classes.remove('hidden');
  } else {
    classes.add('hidden');
  }
}

function doFetch(url, method = 'GET', body = '') {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  };

  return fetch(url, config)
    .then((res) => res.json())
    .catch(console.error);
}
