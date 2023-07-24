(() => {
    const url = 'http://localhost:3000/movies';
    const options = {
        method: "GET"
    }
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
})()

hi