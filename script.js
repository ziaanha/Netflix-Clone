
const movies = [
  {
    title: "Demon Slayer",
    description: "Tanjiro begins a dangerous journey to protect his sister."
  },
  {
    title: "Boruto",
    image: "boruto.jpg",
    description: "A new generation of ninjas faces new challenges."
  },
  {
    title: "Lookism",
    image: "Lookism.jpg",
    description: "A student discovers a surprising change in his life."
  },
  {
    title: "Baki Hanma",
    image: "baki.jpg",
    description: "A powerful fighter trains to reach the top."
  },
  {
    title: "Jujutsu Kaisen",
    image: "JujutsuKaisen.jpg",
    description: "A group of students at Tokyo Jujutsu High fight dangerous Curses using supernatural powers. Yuji Itadori joins the world of Jujutsu Sorcerers after swallowing a powerful cursed object, leading him into thrilling battles filled with mystery, friendship, and dark secrets."
  }
];

const categories = [
  { name: "Anime", items: movies },
  { name: "Trending Now", items: [...movies].reverse() },
  { name: "Comedy Movies", items: movies.slice(1) },
  { name: "Action & Adventure", items: movies },
  { name: "My List", items: [] }
];

const rows = document.getElementById("movieRows");
const toast = document.getElementById("toast");
const dialog = document.getElementById("detailsDialog");

let savedMovies = JSON.parse(localStorage.getItem("myNetflixList") || "[]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderRows() {
  rows.innerHTML = "";

  categories.forEach(category => {
    const items = category.name === "My List"
      ? movies.filter(movie => savedMovies.includes(movie.title))
      : category.items;

    if (!items.length) return;

    const section = document.createElement("section");
    section.className = "movie-section";

    const heading = document.createElement("h2");
    heading.textContent = category.name;

    const row = document.createElement("div");
    row.className = "movie-row";

    items.forEach(movie => {
      const card = document.createElement("article");
      card.className = "movie-card";
      card.tabIndex = 0;

      if (savedMovies.includes(movie.title)) {
        card.classList.add("saved");
      }

      const img = document.createElement("img");
      img.src = movie.image;
      img.alt = movie.title;
      img.loading = "lazy";

      img.onerror = () => {
        img.style.display = "none";
        card.style.background = "#292929";
        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.justifyContent = "center";

        const fallback = document.createElement("span");
        fallback.textContent = movie.title;
        fallback.style.padding = "12px";
        fallback.style.textAlign = "center";
        card.prepend(fallback);
      };

      const title = document.createElement("div");
      title.className = "card-title";
      title.textContent = movie.title;

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "N";

      card.append(img, title, badge);

      card.addEventListener("click", () => openDetails(movie));

      card.addEventListener("keydown", event => {
        if (event.key === "Enter") openDetails(movie);
      });

      card.addEventListener("contextmenu", event => {
        event.preventDefault();
        toggleSaved(movie);
      });

      row.appendChild(card);
    });

    section.append(heading, row);
    rows.appendChild(section);
  });
}

function openDetails(movie) {
  document.getElementById("dialogTitle").textContent = movie.title;
  document.getElementById("dialogDescription").textContent =
    movie.description +
    "\n\nRight-click a poster to add or remove it from My List.";

  if (!dialog.open) dialog.showModal();
}

function toggleSaved(movie) {
  if (savedMovies.includes(movie.title)) {
    savedMovies = savedMovies.filter(title => title !== movie.title);
    showToast(`${movie.title} removed from My List`);
  } else {
    savedMovies.push(movie.title);
    showToast(`${movie.title} added to My List`);
  }

  localStorage.setItem("myNetflixList", JSON.stringify(savedMovies));
  renderRows();
}

document.getElementById("closeDialog").addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

document.getElementById("playHero").addEventListener("click", () => {
  showToast("Demo only — add a video to enable playback.");
});

document.getElementById("moreInfo").addEventListener("click", () => {
  openDetails(movies[0]);
});

document.getElementById("myListButton").addEventListener("click", () => {
  const myList = document.querySelector(".movie-section:last-child");

  if (myList) {
    myList.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    showToast("Your My List is empty. Right-click a poster to save it.");
  }
});

renderRows();
