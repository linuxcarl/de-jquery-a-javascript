/*

console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const getUserAll = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 3 segundos
    todoBien('se acabó el tiempo');
  }, 5000)
})

const getUser = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 3 segundos
    todoBien('se acabó el tiempo 3');
  }, 3000)
})

// getUser
//   .then(function() {
//     console.log('todo está bien en la vida')
//   })
//   .catch(function(message) {
//     console.log(message)
//   })

Promise.race([
  getUser,
  getUserAll,
])
.then(function(message) {
  console.log(message);
})
.catch(function(message) {
  console.log(message)
})



$.ajax('https://randomuser.me/api/sdfdsfdsfs', {
  method: 'GET',
  success: function(data) {
    console.log(data)
  },
  error: function(error) {
    console.log(error)
  }
})

fetch('https://randomuser.me/api/')
  .then( res => {
    return res.json();
  })
  .then( data => {
    console.log('user', data.results[0].name.first);
  })
  .catch(e => console.log(e));
  */
const API = 'https://yts.mx/api/v2/list_movies.json';
(async function load() {

  console.time()
  console.log('Iniciando....')
  async function getData(query) {
    const result = await fetch(API + query)
    return await result.json();
  }
  const $form = document.getElementById('form');
  const $featuringContainer = document.getElementById('featuring');
  const $home = document.getElementById('home');

  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }
  function featuringTemplate(peli) {
    return (`<div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>`);
  }
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active');
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      heigth: 50,
      width: 50
    });
    $featuringContainer.append($loader);

    const data = new FormData($form);
    const { data: {
      movies: pelis
    }
    } = await getData(`?limit=1&query_terms=${data.get('name')}`);
    const htmlString = featuringTemplate(pelis[0]);
    $featuringContainer.innerHTML = htmlString;
  });

  function videoItemTemplate(movie, category) {
    return (` 
        <div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
          <div class="primaryPlaylistItem-image">
            <img src="${movie.medium_cover_image}">
          </div>
          <h4 class="primaryPlaylistItem-title">
            ${movie.title}
          </h4>
        </div>`);
  }
  function createTemplate(htmlString) {
    const $html = document.implementation.createHTMLDocument()
    $html.body.innerHTML = htmlString;
    return $html.body.children[0];
  }
  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal($element);
    });
  }
  function renderMovieList(list, $container, category) {
    $container.children[0].remove();
    list.forEach(movie => {
      const htmlString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(htmlString);
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event)=> {
        movieElement.classList.add('fadeIn');
      });
      addEventClick(movieElement);
    });
  }

  //signo de $ en variables significa que es elemento del dom
  const { data: { movies: actionList } } = await getData('?genre=action');
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');


  const { data: { movies: dramaList } } = await getData('?genre=drama');
  const $dreamContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dreamContainer, 'dream');


  const { data: { movies: animationList } } = await getData('?genre=animation');
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');


  //const $home = $('.home .list #item);// en jquery
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');


  function findById(list, id) {
    return list.find(movie => parseInt(movie.id, 10) === parseInt(id, 10))
  }
  function findMovie(id, category) {
    if(category === 'action')
      return findById(actionList, id)
    else if(category === 'drama')
      return findById(dramaList, id)
    else
      return findById(animationList, id)
  }

  const modalTitle = $modal.querySelector('h1');
  const modalImage = $modal.querySelector('img');
  const modalDescription = $modal.querySelector('p');

  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    const id = $element.dataset.id;
    const category = $element.dataset.category;

    const data = findMovie(id, category);
    
    modalTitle.textContent = data.title;
    modalImage.setAttribute('src',data.medium_cover_image)
    modalDescription.textContent = data.description_full;
  }

  const $hideModal = document.getElementById('hide-modal');
  $hideModal.addEventListener('click', hideModal);
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .4s forwards';
  }


  console.timeEnd();
})()
