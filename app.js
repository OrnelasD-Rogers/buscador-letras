//Pega o primeiro elemento form que encontrar
const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");

const apiUrl = `https://api.lyrics.ovh`;

const fetchData = async (url) => {
  const response = await fetch(url);
  //Espera a requisição terminar e então extrau seu json
  return await response.json();
};

//Faz uma requisição ascincrona
const fetchSongs = async (term) => {
  const data = await fetchData(`${apiUrl}/suggest/${term}`);
  insertSongsIntoPage(data);
};

const getMoreSongs = async (url) => {
  const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
  insertSongsIntoPage(data);
};

const fetchLyrics = async (artist, songTitle) => {
  const data = await fetchData(`${apiUrl}/v1/${artist}/${songTitle}`);
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  insertLyricsIntoPage({ lyrics, artist, songTitle });
};

const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
  songsContainer.innerHTML = `
  <li class="lyrics-container">
     <h2><strong>${songTitle}</strong> - ${artist}</h2>
     <p class="lyrics">${lyrics}</p>
  </li>
    `;
};

const insertNextAndPrevButtons = ({ prev, next }) => {
  prevAndNextContainer.innerHTML = `
            ${
              prev
                ? `<button class="btn" onClick="getMoreSongs('${prev}')">Anteriores</button>`
                : ""
            }
            ${
              next
                ? `<button class="btn" onClick="getMoreSongs('${next}')">Próximas</button>`
                : ""
            }
            `;
};

const insertSongsIntoPage = ({ data, prev, next }) => {
  //Cria uma nova string de tags html contendo as informações, quai são inseridas dentro do html da referencia de songsContainer
  songsContainer.innerHTML = data
    .map(
      ({ artist: { name }, title }) => `
    <li class="song">
    <span class="song-artist"><strong>${name}</strong> - ${title}</span>
    <button class="btn" data-artist="${name}" data-song-title="${title}">Ver Letra</button>
    </li>
    `
    )
    .join("");

  if (prev || next) {
    insertNextAndPrevButtons({ prev, next });
    return;
  }

  prevAndNextContainer.innerHTML = "";
};

const handleFormSubmit = (event) => {
  //Evita que o formulário seja enviado
  event.preventDefault();

  //Captura a o valor inserido no input, removendo os espaços
  const searchTerm = searchInput.value.trim();
  searchInput.value = "";
  searchInput.focus();

  //Verifica se a string é vazia
  //Strings vazias tem valor boleano false
  if (!searchTerm) {
    //Insere dentro da lista de intens um novo item
    songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`;
    return;
  }

  fetchSongs(searchTerm);
};

form.addEventListener("submit", handleFormSubmit);

const HandleSongsContainerClick = (event) => {
  const clickedElement = event.target;

  if (clickedElement.tagName === "BUTTON") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-song-title");

    prevAndNextContainer.innerHTML = "";
    fetchLyrics(artist, songTitle);
  }
};

songsContainer.addEventListener("click", HandleSongsContainerClick);
