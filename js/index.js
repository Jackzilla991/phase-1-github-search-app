const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const inputValue = document.querySelector("input").value;
    const url = `https://api.github.com/search/users?q=${inputValue}`;

    const headers = {
      Accept: "application/vnd.github.v3+json"
    };

    fetch(url, { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(data => {
        // Handle the search results here
        const users = data.items;
        const usersContainer = document.querySelector("#users-container");
        users.forEach(user => {
          const userDiv = document.createElement("div");
          userDiv.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" />
            <a href="${user.html_url}">${user.login}</a>
          `;
          userDiv.addEventListener("click", function() {
            // Handle the click event for each user
            const reposUrl = `https://api.github.com/users/${user.login}/repos`;
            fetch(reposUrl, { headers })
              .then(response => {
                if (!response.ok) {
                  throw new Error("HTTP error " + response.status);
                }
                return response.json();
              })
              .then(repos => {
                // Handle the repository data here
                const reposContainer = document.querySelector("#repos-container");
                repos.forEach(repo => {
                  const repoDiv = document.createElement("div");
                  repoDiv.innerHTML = `
                    <a href="${repo.html_url}">${repo.name}</a>
                  `;
                  reposContainer.appendChild(repoDiv);
                });
              })
              .catch(error => {
                console.log(error);
              });
          });
          usersContainer.appendChild(userDiv);
        });
      })
      .catch(error => {
        console.log(error);
      });
  });
