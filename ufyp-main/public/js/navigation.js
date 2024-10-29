let arrows = document.querySelectorAll(".arrow");
arrows.forEach(arrow => {
  arrow.addEventListener("click", function(e) {
    let arrowParent = this.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
  });
});
