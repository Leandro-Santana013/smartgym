document.addEventListener("DOMContentLoaded", function () {
    var botoesDeFiltro = document.querySelectorAll(".filtro-btn");
    var cards = document.querySelectorAll(".cardapio-card");
    var contador = document.getElementById("contador-resultados");
    var botoesSaibaMais = document.querySelectorAll(".btn-detalhes");

    var campoBusca = document.getElementById("busca-produto");
    var categoriaAtiva = "todos";
    var buscaAtiva = "";

    function atualizarContador(visibles) {
        contador.textContent = visibles + " produto(s) encontrado(s)";
    }

    function aplicarFiltros() {
        var visiveis = 0;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var cat = card.getAttribute("data-categoria");
            var titulo = card.querySelector("h2").textContent.toLowerCase();
            
            var matchCat = (categoriaAtiva === "todos" || cat === categoriaAtiva);
            var matchBusca = titulo.includes(buscaAtiva);

            if (matchCat && matchBusca) {
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
            categoriaAtiva = this.getAttribute("data-filtro");
            aplicarFiltros();
        });
    }

    if (campoBusca) {
        campoBusca.addEventListener("input", function () {
            buscaAtiva = this.value.toLowerCase().trim();
            aplicarFiltros();
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

    aplicarFiltros();
});
