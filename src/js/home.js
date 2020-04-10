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
  async function getData(genre) {
    const result = await fetch(API + '?genre=' + genre)
    return await result.json();
  }
  const $form = document.getElementById('form');
  const $featuringContainer = document.getElementById('featuring');
  const $home = document.getElementById('home');

  function setAttributes($element, attributes) {
    for(const attribute in attributes){
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }

  $form.addEventListener('submit', (event) => {
    event.preventDefault();
    $home.classList.add('search-active');
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      heigth: 50,
      width: 50
    });
    $featuringContainer.append($loader);
  });

  function videoItemTemplate(movie) {
    return (` 
        <div class="primaryPlaylistItem">
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
      showModal();
    });
  }
  function renderMovieList(list, $container) {
    $container.children[0].remove();
    list.forEach(movie => {
      const htmlString = videoItemTemplate(movie);
      const movieElment = createTemplate(htmlString);
      $container.append(movieElment);
      addEventClick(movieElment);
    });
  }
  const actionList = await getData('action');
  const dramaList = await getData('drama');
  const animationList = await getData('animation');

  //signo de $ en variables significa que es elemento del dom
  const $actionContainer = document.querySelector('#action');
  const $dreamContainer = document.getElementById('drama');
  const $animationContainer = document.getElementById('animation');

  renderMovieList(actionList.data.movies, $actionContainer);
  renderMovieList(dramaList.data.movies, $dreamContainer);
  renderMovieList(animationList.data.movies, $animationContainer);

  //const $home = $('.home .list #item);// en jquery
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');

  
  const modalTitle = $modal.querySelector('h1');
  const modalImage = $modal.querySelector('img');
  const modalDescription = $modal.querySelector('p');

  function showModal() {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
  }
  
  const $hideModal = document.getElementById('hide-modal');
  $hideModal.addEventListener('click', hideModal);
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .4s forwards';
  }


  console.timeEnd();
})()
