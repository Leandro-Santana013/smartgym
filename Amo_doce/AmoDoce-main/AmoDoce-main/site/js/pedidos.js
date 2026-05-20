document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-pedido");
    var tbodyPedido = document.getElementById("tbody-pedido");
    var tabelaPedido = document.getElementById("tabela-pedido");
    var pedidoVazio = document.getElementById("pedido-vazio");
    var pedidoTotal = document.getElementById("pedido-total");
    var contadorItens = document.getElementById("contador-itens");
    var valorTotal = document.getElementById("valor-total");
    var btnWhatsapp = document.getElementById("btn-whatsapp-pedido");
    var btnLimpar = document.getElementById("btn-limpar");
    var btnAdicionar = document.getElementById("btn-adicionar");
    var btnCancelar = document.getElementById("btn-cancelar");
    var itemEditando = document.getElementById("item-editando");
    var formTitulo = document.getElementById("form-titulo");

    var proximoId = 1;

    function extrairPreco(nomeProduto) {
        var partes = nomeProduto.split("R$ ");
        if (partes.length > 1) {
            return parseFloat(partes[1].replace(",", "."));
        }
        return 0;
    }

    function calcularTotal() {
        var linhas = tbodyPedido.querySelectorAll("tr");
        var total = 0;
        for (var i = 0; i < linhas.length; i++) {
            var celulas = linhas[i].querySelectorAll("td");
            var produto = celulas[0].textContent;
            var qtd = parseInt(celulas[1].textContent, 10);
            var preco = extrairPreco(produto);
            total += preco * qtd;
        }
        return total;
    }

    function atualizarResumo() {
        var linhas = tbodyPedido.querySelectorAll("tr");
        var numItens = linhas.length;

        if (numItens === 0) {
            tabelaPedido.hidden = true;
            pedidoTotal.hidden = true;
            pedidoVazio.style.display = "";
            contadorItens.textContent = "0 itens";
        } else {
            tabelaPedido.hidden = false;
            pedidoTotal.hidden = false;
            pedidoVazio.style.display = "none";
            contadorItens.textContent = numItens + (numItens === 1 ? " item" : " itens");

            var total = calcularTotal();
            valorTotal.textContent = "R$ " + total.toFixed(2).replace(".", ",");

            var resumo = "Olá, gostaria de fazer um pedido:%0A%0A";
            for (var i = 0; i < linhas.length; i++) {
                var celulas = linhas[i].querySelectorAll("td");
                resumo += celulas[1].textContent + "x " + celulas[0].textContent;
                var obs = celulas[2].textContent;
                if (obs) {
                    resumo += " (" + obs + ")";
                }
                resumo += "%0A";
            }
            resumo += "%0ATotal estimado: R$ " + total.toFixed(2).replace(".", ",");
            btnWhatsapp.href = "https://api.whatsapp.com/send?phone=5513974135864&text=" + resumo;
        }
    }

    function criarLinha(id, produto, quantidade, observacao) {
        var tr = document.createElement("tr");
        tr.setAttribute("data-id", id);

        var tdProduto = document.createElement("td");
        tdProduto.textContent = produto;

        var tdQtd = document.createElement("td");
        tdQtd.textContent = quantidade;

        var tdObs = document.createElement("td");
        tdObs.textContent = observacao;

        var tdAcoes = document.createElement("td");
        tdAcoes.className = "td-acoes";

        var btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn-tabela btn-editar";
        btnEditar.setAttribute("aria-label", "Editar item " + produto);

        var btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.className = "btn-tabela btn-remover";
        btnRemover.setAttribute("aria-label", "Remover item " + produto);

        btnEditar.addEventListener("click", function () {
            var linha = this.parentNode.parentNode;
            var celulas = linha.querySelectorAll("td");

            document.getElementById("produto").value = celulas[0].textContent;
            document.getElementById("quantidade").value = celulas[1].textContent;
            document.getElementById("observacao").value = celulas[2].textContent;
            itemEditando.value = linha.getAttribute("data-id");

            formTitulo.textContent = "Editar Item";
            btnAdicionar.innerHTML = "<i class='fa-solid fa-floppy-disk'></i> Salvar alterações";
            btnCancelar.style.display = "";
            document.getElementById("produto").focus();
        });

        btnRemover.addEventListener("click", function () {
            var linha = this.parentNode.parentNode;
            var pai = linha.parentNode;
            pai.removeChild(linha);
            atualizarResumo();
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnRemover);

        tr.appendChild(tdProduto);
        tr.appendChild(tdQtd);
        tr.appendChild(tdObs);
        tr.appendChild(tdAcoes);

        return tr;
    }

    function resetarFormulario() {
        form.reset();
        itemEditando.value = "";
        formTitulo.textContent = "Adicionar Item";
        btnAdicionar.innerHTML = "<i class='fa-solid fa-plus'></i> Adicionar ao Pedido";
        btnCancelar.style.display = "none";
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var produto = document.getElementById("produto").value;
        var quantidade = parseInt(document.getElementById("quantidade").value, 10);
        var observacao = document.getElementById("observacao").value.trim();
        var valido = true;

        var erroProduto = document.getElementById("erro-produto");
        var erroQtd = document.getElementById("erro-quantidade");

        if (!produto) {
            erroProduto.textContent = "Erro: Selecione um produto.";
            valido = false;
        } else {
            erroProduto.textContent = "";
        }

        if (!quantidade || quantidade < 1) {
            erroQtd.textContent = "Erro: Quantidade deve ser no mínimo 1.";
            valido = false;
        } else {
            erroQtd.textContent = "";
        }

        if (!valido) return;

        var idAtual = itemEditando.value;

        if (idAtual) {
            var linhaExistente = tbodyPedido.querySelector("tr[data-id='" + idAtual + "']");
            if (linhaExistente) {
                var celulas = linhaExistente.querySelectorAll("td");
                celulas[0].textContent = produto;
                celulas[1].textContent = quantidade;
                celulas[2].textContent = observacao;
            }
        } else {
            var novaLinha = criarLinha(proximoId, produto, quantidade, observacao);
            proximoId++;
            tbodyPedido.appendChild(novaLinha);
        }

        resetarFormulario();
        atualizarResumo();
    });

    btnCancelar.addEventListener("click", function () {
        resetarFormulario();
    });

    btnLimpar.addEventListener("click", function () {
        while (tbodyPedido.firstChild) {
            tbodyPedido.removeChild(tbodyPedido.firstChild);
        }
        resetarFormulario();
        atualizarResumo();
    });

    form.querySelectorAll("input, select, textarea").forEach(function (campo) {
        campo.addEventListener("input", function () {
            var erroSpan = document.getElementById("erro-" + this.id);
            if (erroSpan) erroSpan.textContent = "";
        });
    });

    atualizarResumo();
});
