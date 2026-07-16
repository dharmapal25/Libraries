button.addEventListener("mousedown", () => {
    button.style.transform = "scale(0.95)"; // Visual "shrink" effect
    console.log("Button pressed down!");
});

// 2. Fires second
button.addEventListener("mouseup", () => {
    button.style.transform = "scale(1)"; // Revert visual effect
    console.log("Button released!");
});