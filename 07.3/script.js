// script.js - Photo Gallery Application

document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    const fetchPhotosBtn = document.getElementById("fetch-photos-btn");
    
    // Function to fetch random photos from Lorem Picsum API
    async function fetchPhotos() {
        try {
            for (let i = 0; i < 6; i++) { // Fetch 6 photos at a time
                const response = await fetch("https://picsum.photos/300/200");
                if (response.ok) {
                    const photoURL = response.url;
                    addPhoto(photoURL);
                }
            }
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    }
    
    // Function to add a photo to the gallery
    function addPhoto(url) {
        const img = document.createElement("img");
        img.src = url;
        img.classList.add("gallery-photo");
        img.addEventListener("click", function () {
            img.remove(); // Remove photo when clicked
        });
        gallery.appendChild(img);
    }
    
    // Event listener for fetching photos
    fetchPhotosBtn.addEventListener("click", fetchPhotos);
});
