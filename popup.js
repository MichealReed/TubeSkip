// Ensure browser compatibility with both Firefox and Chrome
if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    var browser = chrome;
}

// Initialize bannedArtists if not already set
browser.storage.local.get('bannedArtists', (result) => {
    if (!result.bannedArtists) {
        browser.storage.local.set({ bannedArtists: ["Travis Scott"] });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const artistInput = document.getElementById('artist');
    const addButton = document.getElementById('add');
    const artistsList = document.getElementById('artistsList');

    // Function to load artists from storage
    const loadArtists = () => {
        browser.storage.local.get('bannedArtists', (result) => {
            const bannedArtists = result.bannedArtists || [];
            artistsList.innerHTML = '';
            bannedArtists.forEach((artist, index) => {
                addArtistToList(artist, index);
            });
        });
    };

    // Function to add an artist to the list
    const addArtistToList = (artist, index) => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = artist;
        input.disabled = true;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            if (editButton.textContent === 'Edit') {
                input.disabled = false;
                input.focus();
                editButton.textContent = 'Save';
            } else {
                input.disabled = true;
                editButton.textContent = 'Edit';
                updateArtist(index, input.value);
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeArtist(index);
        });

        li.appendChild(input);
        li.appendChild(editButton);
        li.appendChild(removeButton);
        artistsList.appendChild(li);
    };

    // Function to add a new artist
    const addArtist = (artist) => {
        browser.storage.local.get('bannedArtists', (result) => {
            const bannedArtists = result.bannedArtists || [];
            bannedArtists.push(artist);
            browser.storage.local.set({ bannedArtists }, () => {
                loadArtists();
                notifyContentScript(bannedArtists);
            });
        });
    };

    // Function to update an artist
    const updateArtist = (index, newArtist) => {
        browser.storage.local.get('bannedArtists', (result) => {
            const bannedArtists = result.bannedArtists || [];
            bannedArtists[index] = newArtist;
            browser.storage.local.set({ bannedArtists }, () => {
                loadArtists();
                notifyContentScript(bannedArtists);
            });
        });
    };

    // Function to remove an artist
    const removeArtist = (index) => {
        browser.storage.local.get('bannedArtists', (result) => {
            const bannedArtists = result.bannedArtists || [];
            bannedArtists.splice(index, 1);
            browser.storage.local.set({ bannedArtists }, () => {
                loadArtists();
                notifyContentScript(bannedArtists);
            });
        });
    };

    // Notify content scripts of updates
    const notifyContentScript = (bannedArtists) => {
        browser.runtime.sendMessage({ action: "setBannedArtists", data: bannedArtists });
    };

    // Load artists on DOMContentLoaded
    loadArtists();

    // Add button event listener
    addButton.addEventListener('click', () => {
        const artist = artistInput.value.trim();
        if (artist) {
            addArtist(artist);
            artistInput.value = '';
        }
    });
});