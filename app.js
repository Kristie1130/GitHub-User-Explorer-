
const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("username");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const profile = document.getElementById("profile");
const avatar = document.getElementById("avatar");
const name = document.getElementById("name");
const repoList = document.getElementById("repoList");

async function searchUser(username) {
    try {
        loading.hidden = false;
        errorMessage.textContent = "";
        profile.hidden = true;

        // Fetch any GitHub username entered
        const [userResponse, repoResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
            fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`)
        ]);

        // Check if user exists
        if (userResponse.status === 404) {
            throw new Error("GitHub user not found. Check the username.");
        }

        if (!userResponse.ok) {
            throw new Error("Unable to fetch user. Try again.");
        }

        if (!repoResponse.ok) {
            throw new Error("Unable to fetch repositories.");
        }

        const user = await userResponse.json();
        const repositories = await repoResponse.json();

        // Display profile
        avatar.src = user.avatar_url;
        name.textContent = user.name || user.login;

        // Clear previous repositories
        repoList.innerHTML = "";

        // Display repositories
        if (repositories.length === 0) {
            repoList.textContent = "No public repositories found.";
        } else {
            repositories.forEach(repo => {
                const li = document.createElement("li");
                const link = document.createElement("a");

                link.href = repo.html_url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = repo.name;

                li.appendChild(link);
                repoList.appendChild(li);
            });
        }

        profile.hidden = false;

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loading.hidden = true;
    }
}

// Listen for form submission
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (username) {
        searchUser(username);
    }
});
