document.addEventListener("DOMContentLoaded", function () {
    var galeriaItens = document.querySelectorAll(".galeria-item");
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightbox-img");
    var lightboxLegenda = document.getElementById("lightbox-legenda");
    var lightboxContador = document.getElementById("lightbox-contador");
    var btnFechar = document.getElementById("lightbox-fechar");
    var btnAnterior = document.getElementById("lightbox-anterior");
    var btnProximo = document.getElementById("lightbox-proximo");
    var indiceAtual = 0;
    var totalFotos = galeriaItens.length;

    function abrirLightbox(indice) {
        indiceAtual = indice;
        var item = galeriaItens[indiceAtual];
        var img = item.querySelector("img");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxLegenda.textContent = img.getAttribute("data-legenda");
        lightboxContador.textContent = (indiceAtual + 1) + " / " + totalFotos;
        lightbox.classList.add("lightbox-aberta");
        document.body.style.overflow = "hidden";
        btnFechar.focus();
    }

    function fecharLightbox() {
        lightbox.classList.remove("lightbox-aberta");
        document.body.style.overflow = "";
        galeriaItens[indiceAtual].querySelector("img").focus();
    }

    function irParaAnterior() {
        indiceAtual = (indiceAtual - 1 + totalFotos) % totalFotos;
        abrirLightbox(indiceAtual);
    }

    function irParaProximo() {
        indiceAtual = (indiceAtual + 1) % totalFotos;
        abrirLightbox(indiceAtual);
    }

    for (var i = 0; i < galeriaItens.length; i++) {
        galeriaItens[i].addEventListener("click", function () {
            var idx = parseInt(this.getAttribute("data-index"), 10);
            abrirLightbox(idx);
        });

        galeriaItens[i].setAttribute("tabindex", "0");
        galeriaItens[i].setAttribute("role", "button");
        galeriaItens[i].setAttribute("aria-label", "Ampliar foto " + (i + 1));

        galeriaItens[i].addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                var idx = parseInt(this.getAttribute("data-index"), 10);
                abrirLightbox(idx);
            }
        });
    }

    btnFechar.addEventListener("click", fecharLightbox);
    btnAnterior.addEventListener("click", irParaAnterior);
    btnProximo.addEventListener("click", irParaProximo);

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
            fecharLightbox();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (lightbox.hidden) return;
        if (e.key === "Escape") fecharLightbox();
        if (e.key === "ArrowLeft") irParaAnterior();
        if (e.key === "ArrowRight") irParaProximo();
    });
});
