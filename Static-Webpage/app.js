document.addEventListener("DOMContentLoaded", function () {
  const blogImages = document.querySelectorAll(".blog-image");

  blogImages.forEach(function (image) {
    image.dataset.originalSrc = image.src;

    image.addEventListener("mouseenter", function () {
      image.src = image.dataset.hoverSrc;
    });

    image.addEventListener("mouseleave", function () {
      image.src = image.dataset.originalSrc;
    });
  });
});
