document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-avaliacao");
    var listaAvaliacoes = document.getElementById("lista-avaliacoes");
    var semAvaliacoes = document.getElementById("sem-avaliacoes");
    var contadorAvaliacoes = document.getElementById("contador-avaliacoes");
    var estrelasBtns = document.querySelectorAll(".estrela-btn");
    var notaInput = document.getElementById("nota-valor");
    var notaSelecionada = 0;

    function atualizarEstrelas(valor) {
        for (var i = 0; i < estrelasBtns.length; i++) {
            if (i < valor) {
                estrelasBtns[i].classList.add("estrela-ativa");
            } else {
                estrelasBtns[i].classList.remove("estrela-ativa");
            }
        }
    }

    for (var e = 0; e < estrelasBtns.length; e++) {
        estrelasBtns[e].addEventListener("mouseenter", function () {
            atualizarEstrelas(parseInt(this.getAttribute("data-valor"), 10));
        });

        estrelasBtns[e].addEventListener("mouseleave", function () {
            atualizarEstrelas(notaSelecionada);
        });

        estrelasBtns[e].addEventListener("click", function () {
            notaSelecionada = parseInt(this.getAttribute("data-valor"), 10);
            notaInput.value = notaSelecionada;
            atualizarEstrelas(notaSelecionada);
            document.getElementById("erro-nota").textContent = "";
        });
    }

    function gerarEstrelas(nota) {
        var texto = "";
        for (var i = 1; i <= 5; i++) {
            if (i <= nota) {
                texto += "★";
            } else {
                texto += "☆";
            }
        }
        return texto;
    }

    function atualizarContador() {
        var total = listaAvaliacoes.children.length;
        contadorAvaliacoes.textContent = total + (total === 1 ? " avaliação" : " avaliações");

        if (total === 0) {
            semAvaliacoes.style.display = "";
        } else {
            semAvaliacoes.style.display = "none";
        }
    }

    function destacarCartao(botao) {
        var card = botao.parentNode;
        var lista = card.parentNode;

        card.classList.toggle("avaliacao-destaque");

        var irmaoAnterior = card.previousElementSibling;
        var irmaoProximo = card.nextElementSibling;

        if (irmaoAnterior) {
            irmaoAnterior.classList.remove("avaliacao-destaque");
        }
        if (irmaoProximo) {
            irmaoProximo.classList.remove("avaliacao-destaque");
        }

        var filhos = lista.children;
        for (var f = 0; f < filhos.length; f++) {
            var cabecalho = filhos[f].querySelector(".av-cabecalho");
            if (cabecalho) {
                var corTitulo = filhos[f].classList.contains("avaliacao-destaque") ? "#9E2936" : "";
                cabecalho.style.color = corTitulo;
            }
        }

        if (card.classList.contains("avaliacao-destaque")) {
            botao.textContent = "Remover destaque";
        } else {
            botao.textContent = "Destacar";
        }
    }

    function criarCardAvaliacao(nome, produto, nota, comentario) {
        var li = document.createElement("li");
        li.className = "avaliacao-card";

        var cabecalho = document.createElement("div");
        cabecalho.className = "av-cabecalho";

        var nomeEl = document.createElement("strong");
        nomeEl.className = "av-nome";
        nomeEl.textContent = nome;

        var notaEl = document.createElement("span");
        notaEl.className = "av-estrelas";
        notaEl.setAttribute("aria-label", nota + " estrelas de 5");
        notaEl.textContent = gerarEstrelas(nota);

        cabecalho.appendChild(nomeEl);
        cabecalho.appendChild(notaEl);

        var produtoEl = document.createElement("p");
        produtoEl.className = "av-produto";
        produtoEl.textContent = "Produto: " + produto;

        var comentarioEl = document.createElement("p");
        comentarioEl.className = "av-comentario";
        comentarioEl.textContent = comentario;

        var acoes = document.createElement("div");
        acoes.className = "av-acoes";

        var btnDestacar = document.createElement("button");
        btnDestacar.className = "btn-tabela btn-editar";
        btnDestacar.textContent = "Destacar";
        btnDestacar.addEventListener("click", function () {
            destacarCartao(this);
        });

        var btnRemover = document.createElement("button");
        btnRemover.className = "btn-tabela btn-remover";
        btnRemover.textContent = "Remover";
        btnRemover.setAttribute("aria-label", "Remover avaliação de " + nome);
        btnRemover.addEventListener("click", function () {
            var card = this.parentNode.parentNode;
            var pai = card.parentNode;
            pai.removeChild(card);
            atualizarContador();
        });

        acoes.appendChild(btnDestacar);
        acoes.appendChild(btnRemover);

        li.appendChild(cabecalho);
        li.appendChild(produtoEl);
        li.appendChild(comentarioEl);
        li.appendChild(acoes);

        return li;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var nome = document.getElementById("av-nome").value.trim();
        var produto = document.getElementById("av-produto").value;
        var comentario = document.getElementById("av-comentario").value.trim();
        var nota = parseInt(notaInput.value, 10);
        var valido = true;

        var erroNome = document.getElementById("erro-av-nome");
        var erroProduto = document.getElementById("erro-av-produto");
        var erroComentario = document.getElementById("erro-av-comentario");
        var erroNota = document.getElementById("erro-nota");

        if (!nome) {
            erroNome.textContent = "Erro: Informe seu nome.";
            valido = false;
        } else {
            erroNome.textContent = "";
        }

        if (!produto) {
            erroProduto.textContent = "Erro: Selecione um produto.";
            valido = false;
        } else {
            erroProduto.textContent = "";
        }

        if (!nota || nota < 1) {
            erroNota.textContent = "Erro: Selecione uma nota.";
            valido = false;
        } else {
            erroNota.textContent = "";
        }

        if (!comentario) {
            erroComentario.textContent = "Erro: Escreva um comentário.";
            valido = false;
        } else {
            erroComentario.textContent = "";
        }

        if (!valido) return;

        var novoCard = criarCardAvaliacao(nome, produto, nota, comentario);
        listaAvaliacoes.insertBefore(novoCard, listaAvaliacoes.firstChild);

        atualizarContador();

        form.reset();
        notaSelecionada = 0;
        notaInput.value = "";
        atualizarEstrelas(0);
    });

    form.querySelectorAll("input, select, textarea").forEach(function (campo) {
        campo.addEventListener("input", function () {
            var erroSpan = document.getElementById("erro-" + this.id);
            if (erroSpan) erroSpan.textContent = "";
        });
    });

    atualizarContador();
});
