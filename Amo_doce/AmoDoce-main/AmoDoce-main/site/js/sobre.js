document.addEventListener("DOMContentLoaded", function () {
    var faqBotoes = document.querySelectorAll(".faq-pergunta");

    for (var i = 0; i < faqBotoes.length; i++) {
        faqBotoes[i].addEventListener("click", function () {
            var alvoId = this.getAttribute("aria-controls");
            var alvo = document.getElementById(alvoId);
            var expandido = this.getAttribute("aria-expanded") === "true";

            for (var j = 0; j < faqBotoes.length; j++) {
                var outroId = faqBotoes[j].getAttribute("aria-controls");
                var outro = document.getElementById(outroId);
                if (outroId !== alvoId) {
                    outro.hidden = true;
                    faqBotoes[j].setAttribute("aria-expanded", "false");
                    faqBotoes[j].classList.remove("faq-aberta");
                }
            }

            if (expandido) {
                alvo.hidden = true;
                this.setAttribute("aria-expanded", "false");
                this.classList.remove("faq-aberta");
            } else {
                alvo.hidden = false;
                this.setAttribute("aria-expanded", "true");
                this.classList.add("faq-aberta");
            }
        });
    }

    var numerosLista = document.getElementById("numeros-lista");
    var animacaoIniciada = false;

    function animarContadores() {
        var itens = numerosLista.querySelectorAll(".numero-valor");
        for (var i = 0; i < itens.length; i++) {
            var item = itens[i];
            var alvo = parseInt(item.getAttribute("data-alvo"), 10);
            var inicio = 0;
            var duracao = 1500;
            var startTime = null;
            var elemento = item;
            var alvoLocal = alvo;

            (function (el, alvoNum) {
                function passo(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progresso = timestamp - startTime;
                    var valAtual = Math.min(Math.floor((progresso / duracao) * alvoNum), alvoNum);
                    el.textContent = valAtual + "+";
                    if (progresso < duracao) {
                        requestAnimationFrame(passo);
                    } else {
                        el.textContent = alvoNum + "+";
                    }
                }
                requestAnimationFrame(passo);
            })(elemento, alvoLocal);
        }
    }

    var observer = new IntersectionObserver(function (entradas) {
        for (var k = 0; k < entradas.length; k++) {
            if (entradas[k].isIntersecting && !animacaoIniciada) {
                animacaoIniciada = true;
                animarContadores();
            }
        }
    }, { threshold: 0.3 });

    if (numerosLista) {
        observer.observe(numerosLista);
    }
});
