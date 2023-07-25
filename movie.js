"use strict";

// GETTING MOVIES AFTER LOADING
const loadingPromise = new Promise((resolve) => {
    setTimeout(() => {
        resolve();
        $("#spinner").addClass("loading")
    }, 2000)
});

function movieDisplay() {
    fetch("https://rocky-enchanting-wineberry.glitch.me/movies")
        .then(res => res.json())
        .then(function (movies) {
            console.log(movies)
            for (let i = 0; i <= movies.length - 1; i++) {
                let movieData = ` <div class="col-4" >
                                    <div class="card" style="width: 18rem;" id="card-shadow">
                                        <img class="poster" src="${movies[i].poster}" alt="movie poster">
                                        <div class="card-body">
                                            <h5 class="card-title">${movies[i].title}</h5>
                                            <div></div>
                                            <div class="card=text">${movies[i].year}</div>
                                        </div>
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">
                                                <div class="dropdown">
                                                    <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                                                        Plot
                                                    </button> 
                                                      <div class="dropdown-menu" id="plot-box" aria-labelledby="dropdownMenuButton">
                                                         ${movies[i].plot}
                                                      </div>
                                                </div>
                                            </li> 
                                            <li class="list-group-item"><h6>Rating:</h6> ${movies[i].rating} <i class="fas fa-star"></i></li>
                                        </ul>
                                        <div class="card-body">
                                            <button class="btn delete-movie" id="${movies[i].id}"><i class="fas fa-trash"></i></button>
                                            <button id="movie${movies[i].id}" data-target="#editModal" data-toggle="modal" class="edit-movie btn"><i class="fas fa-pencil-alt"></i></button>
                                        </div>
                                    </div>`
                $("#displayMovies").append(movieData)
                $(`#movie${movies[i].id}`).click(function () {
                    $('#input-title').attr('value', `${movies[i].title}`)
                    $('#input-rating').attr('value', `${movies[i].rating}`)
                    $('#input-plot').html(`${movies[i].plot}`)
                })
            }
        })
}

loadingPromise.then(() => movieDisplay())


// CREATING ADD MOVIE FUNCTION
function addMovie() {
    let title = $('#title-input').val()
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_PROJECT}&query=${title}`)
        .then(response => response.json())
        .then(function (res) {
            console.log(res);
            const url = 'https://rocky-enchanting-wineberry.glitch.me/movies';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    poster: `https://image.tmdb.org/t/p/w500${res.results[0].poster_path}`,
                    title: res.results[0].title,
                    year: (res.results[0].release_date).split("-")[0],
                    plot: res.results[0].overview,
                    rating: Math.round(res.results[0].vote_average),
                }),
            };
            fetch(url, options)
                .then(response => console.log(response))
                .then(error => console.log(error))
        })
}

// CREATING EDIT MOVIE FUNCTION
$(document).on('click', '.edit-movie', function () {
    let editId = $(this).attr('id').split('movie')[1]
    console.log(editId)
    $(document).on('click', '.save-edit', function () {
        console.log('clicked')
        fetch(`https://rocky-enchanting-wineberry.glitch.me/movies/${editId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: $('#input-title').val(),
                rating: $('#input-rating').val(),
                plot: $('#input-plot').val(),
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json)
    })
})

// EVENT LISTENER FOR ADD MOVIE
$('#addMovie').click(function () {
    addMovie()
})

// EVENT LISTENER FOR EDIT MOVIE
$(document).on('click', '.delete-movie', function () {
    let movieId = $(this).attr('id')
    fetch(`https://rocky-enchanting-wineberry.glitch.me/movies/${movieId}`, {method: 'DELETE'})
})