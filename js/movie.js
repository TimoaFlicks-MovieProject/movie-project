"use strict";

// GETTING MOVIES AFTER LOADING
const loadingPromise = new Promise((resolve) => {
    setTimeout(() => {
        resolve();
        $("#spinner").addClass("loading")
    }, 2000)
});

function movieDisplay() {
    $("#displayMovies").empty();
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
async function addMovie() {
    let title = $('#title-input').val();
    const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_PROJECT}&query=${title}`
    );
    const data = await response.json();

    // Check if there's any result for the movie search
    if (data.results.length > 0) {
        const movieData = data.results[0];
        const url = 'https://rocky-enchanting-wineberry.glitch.me/movies';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                title: movieData.title,
                year: (movieData.release_date).split("-")[0],
                plot: movieData.overview,
                rating: Math.round(movieData.vote_average),
            }),
        };

        const addResponse = await fetch(url, options);
        if (addResponse.ok) {
            // Successfully added the movie, now update the movie list
            movieDisplay();
        } else {
            alert('Error adding the movie.');
        }
    } else {
        alert('No movie found with that title.');
    }
}

function searchMovies() {
    const searchQuery = $('#searchInput').val().toLowerCase();
    const movieCards = $('.col-4');

    movieCards.each(function () {
        const movieTitle = $(this).find('.card-title').text().toLowerCase();
        if (movieTitle.includes(searchQuery)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function sortMovies(order) {
    const movieCards = $('.col-4');
    const sortedMovies = movieCards.get().sort((a, b) => {
        const movieTitleA = $(a).find('.card-title').text().toLowerCase();
        const movieTitleB = $(b).find('.card-title').text().toLowerCase();
        return order === 'asc' ? movieTitleA.localeCompare(movieTitleB) : movieTitleB.localeCompare(movieTitleA);
    });

    $("#displayMovies").empty(); // Clear existing movie list
    $("#displayMovies").append(sortedMovies);
}

$('#sortAZ').click(function () {
    sortMovies('asc'); // 'asc' for ascending order (A-Z)
});


$('#sortZA').click(function () {
    sortMovies('desc'); // 'desc' for descending order (Z-A)
});

async function deleteMovie(movieId) {
    const url = `https://rocky-enchanting-wineberry.glitch.me/movies/${movieId}`;
    const options = {
        method: 'DELETE',
    };

    const deleteResponse = await fetch(url, options);
    if (deleteResponse.ok) {
        $("#displayMovies").empty();
        // Successfully deleted the movie, now update the movie list
        movieDisplay();
    } else {
        console.log('Error deleting the movie.');
    }
}

$('#searchInput').on('input', function () {
    searchMovies();
});



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
        }).then(response => response.json()) // Add parentheses to properly parse response JSON
    })
})

$(function () {

    // function konamiCode() {
    //     $(this).alert('you did it gangy')
    // }
    //
    // $(document)
    //     .on('keyup', konamiCode())
    //

    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a',
        66: 'b'
    };

// the 'official' Konami Code sequence
    let konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// a variable to remember the 'position' the user has reached so far.
    let konamiCodePosition = 0;

// add keydown event listener
    document.addEventListener('keydown', function (e) {
        // get the value of the key code from the key map
        let key = allowedKeys[e.keyCode];
        // get the value of the required key from the konami code
        let requiredKey = konamiCode[konamiCodePosition];

        // compare the key with the required key
        if (key === requiredKey) {

            // move to the next key in the konami code sequence
            konamiCodePosition++;

            // if the last key is reached, activate cheats
            if (konamiCodePosition === konamiCode.length) {
                activateCheats();
                konamiCodePosition = 0;
            }
        } else {
            konamiCodePosition = 0;
        }
    });

    function activateCheats() {
        window.location.href = 'https://www.amazon.com/gp/video/detail/amzn1.dv.gti.aca9f771-4256-ddca-723e-c4f634530a4d?autoplay=0&ref_=nav_custrec_signin';

    }
})

// EVENT LISTENER FOR ADD MOVIE
$('#addMovie').click(function () {
    addMovie()
})

// EVENT LISTENER FOR EDIT MOVIE
$(document).on('click', '.delete-movie', function () {
    let movieId = $(this).attr('id');
    deleteMovie(movieId);
});


// JavaScript to show the loader while the page is loading
window.addEventListener('load', function () {
// Show the content container
    document.getElementById('content-container').style.display = 'block';

// Delay for 4 seconds (4000 milliseconds) before hiding the loader
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none';
    }, 3000);
});