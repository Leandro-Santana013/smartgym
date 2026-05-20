document.addEventListener("DOMContentLoaded", function () {
    var botoesDeFiltro = document.querySelectorAll(".filtro-btn");
    var cards = document.querySelectorAll(".cardapio-card");
    var contador = document.getElementById("contador-resultados");
    var botoesSaibaMais = document.querySelectorAll(".btn-detalhes");

    function atualizarContador(visibles) {
        contador.textContent = visibles + " produto(s) encontrado(s)";
    }

    function filtrar(categoria) {
        var visiveis = 0;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (categoria === "todos" || card.getAttribute("data-categoria") === categoria) {
                card.style.display = "";
                card.classList.add("card-visivel");
                visiveis++;
            } else {
                card.style.display = "none";
                card.classList.remove("card-visivel");
            }
        }
        atualizarContador(visiveis);
    }

    for (var b = 0; b < botoesDeFiltro.length; b++) {
        botoesDeFiltro[b].addEventListener("click", function () {
            for (var k = 0; k < botoesDeFiltro.length; k++) {
                botoesDeFiltro[k].classList.remove("ativo");
                botoesDeFiltro[k].setAttribute("aria-pressed", "false");
            }
            this.classList.add("ativo");
            this.setAttribute("aria-pressed", "true");
            filtrar(this.getAttribute("data-filtro"));
        });
    }

    for (var s = 0; s < botoesSaibaMais.length; s++) {
        botoesSaibaMais[s].addEventListener("click", function () {
            var alvoId = this.getAttribute("aria-controls");
            var alvo = document.getElementById(alvoId);
            var expandido = this.getAttribute("aria-expanded") === "true";

            if (expandido) {
                alvo.hidden = true;
                this.setAttribute("aria-expanded", "false");
                this.textContent = "Ver ingredientes";
            } else {
                alvo.hidden = false;
                this.setAttribute("aria-expanded", "true");
                this.textContent = "Ocultar ingredientes";
            }
        });
    }

    filtrar("todos");
});
