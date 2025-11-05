document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", () => {
        const notif = document.getElementById("notif");
        if (notif) {
            notif.style.display = "block";
            setTimeout(() => {
                notif.style.display = "none";
            }, 3000); // disparaît après 3 secondes
        }
    });
});
