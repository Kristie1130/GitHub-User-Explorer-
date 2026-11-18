const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("username");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const profile = document.getElementById("profile");
const avatar = document.getElementById("avatar");
const name = document.getElementById("name");
const bio = document.getElementById("bio");

const repos = document.getElementById("repos");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repoList = document.getElementById("repoList");

async function searchUser(username) {
    try {

    loading.hidden = false;
    errorMessage.textContent = "";
    profile.hidden = true;

const [userResponse, repoResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
]);

if (!userResponse.ok) {
    throw new Error("User not found");
}

const user = await userResponse.json();
const repositories = await repoResponse.json();
avatar.src = user.avatar_url;
name.textContent = user.name || user.login;
bio.textContent = user.bio || "No bio available";

repos.textContent = user.public_repos;
followers.textContent = user.followers;
following.textContent = user.following;
repoList.innerHTML = "";

repositories.forEach(repo => {
    const li = document.createElement("li");

    li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;

    repoList.appendChild(li);
});
profile.hidden = false;
loading.hidden = true;
    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loading.hidden = true;
    }
}
searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = usernameInput.value.trim();

    if (username) {
        searchUser(username);
    }

});
