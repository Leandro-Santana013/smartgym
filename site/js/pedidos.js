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
    
    // Elementos do Simulador de Frete
    var selectFrete = document.getElementById("frete-select");
    var valorFreteEl = document.getElementById("valor-frete");
    var valorSubtotalEl = document.getElementById("valor-subtotal");

    var proximoId = 1;

    function salvarCarrinho() {
        var itens = [];
        var linhas = tbodyPedido.querySelectorAll("tr");
        for (var i = 0; i < linhas.length; i++) {
            var celulas = linhas[i].querySelectorAll("td");
            if (celulas.length >= 4) {
                itens.push({
                    id: linhas[i].getAttribute("data-id"),
                    produto: celulas[0].textContent,
                    quantidade: parseInt(celulas[1].textContent, 10),
                    observacao: celulas[2].textContent
                });
            }
        }
        localStorage.setItem("amoDoceCarrinho", JSON.stringify(itens));
    }

    function carregarCarrinho() {
        var cartData = localStorage.getItem("amoDoceCarrinho");
        tbodyPedido.innerHTML = "";
        if (cartData) {
            try {
                var itens = JSON.parse(cartData);
                var maxId = 0;
                itens.forEach(function (item) {
                    var idInt = parseInt(item.id, 10);
                    if (idInt > maxId) maxId = idInt;
                    var linha = criarLinha(item.id, item.produto, item.quantidade, item.observacao);
                    tbodyPedido.appendChild(linha);
                });
                proximoId = maxId + 1;
            } catch (e) {
                console.error("Erro ao carregar carrinho", e);
            }
        }
        atualizarResumo();
    }

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

            var subtotal = calcularTotal();
            var taxaFrete = 0;
            var regiaoNome = "Retirada no local";
            
            if (selectFrete) {
                taxaFrete = parseFloat(selectFrete.value);
                var selectedOption = selectFrete.options[selectFrete.selectedIndex];
                regiaoNome = selectedOption ? selectedOption.text.split(" — ")[0] : "Retirada no local";
            }

            var totalGeral = subtotal + taxaFrete;

            if (valorSubtotalEl) {
                valorSubtotalEl.textContent = "R$ " + subtotal.toFixed(2).replace(".", ",");
            }
            if (valorFreteEl) {
                valorFreteEl.textContent = taxaFrete === 0 ? "Grátis (Retirada)" : "R$ " + taxaFrete.toFixed(2).replace(".", ",");
            }
            valorTotal.textContent = "R$ " + totalGeral.toFixed(2).replace(".", ",");

            var resumo = "Olá, gostaria de fazer um pedido:%0A%0A";
            resumo += "*Itens do Pedido:*%0A";
            for (var i = 0; i < linhas.length; i++) {
                var celulas = linhas[i].querySelectorAll("td");
                resumo += "• " + celulas[1].textContent + "x " + celulas[0].textContent;
                var obs = celulas[2].textContent;
                if (obs) {
                    resumo += " (Obs: " + obs + ")";
                }
                resumo += "%0A";
            }
            
            resumo += "%0A*Forma de Entrega:*%0A";
            if (taxaFrete === 0) {
                resumo += "Retirada no local (Grátis)%0A";
            } else {
                resumo += "Entrega: " + regiaoNome + " (Taxa: R$ " + taxaFrete.toFixed(2).replace(".", ",") + ")%0A";
            }
            
            resumo += "%0A*Resumo Financeiro:*%0A";
            resumo += "Subtotal: R$ " + subtotal.toFixed(2).replace(".", ",") + "%0A";
            if (taxaFrete > 0) {
                resumo += "Taxa de entrega: R$ " + taxaFrete.toFixed(2).replace(".", ",") + "%0A";
            }
            resumo += "*Total Estimado: R$ " + totalGeral.toFixed(2).replace(".", ",") + "*";
            
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
            salvarCarrinho();
        });

        // Oculta o botão de Editar para doces personalizados para evitar inconsistência de formulário
        if (produto.indexOf("Personalizado") === -1) {
            tdAcoes.appendChild(btnEditar);
        }
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
        salvarCarrinho();
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
        salvarCarrinho();
    });

    form.querySelectorAll("input, select, textarea").forEach(function (campo) {
        campo.addEventListener("input", function () {
            var erroSpan = document.getElementById("erro-" + this.id);
            if (erroSpan) erroSpan.textContent = "";
        });
    });

    if (selectFrete) {
        selectFrete.addEventListener("change", function () {
            atualizarResumo();
        });
    }

    // Alternância de Abas do Formulário
    var tabPronto = document.getElementById("tab-pronto");
    var tabPersonalizado = document.getElementById("tab-personalizado");
    var formProntoWrapper = document.getElementById("form-pronto-wrapper");
    var formPersonalizadoWrapper = document.getElementById("form-personalizado-wrapper");

    if (tabPronto && tabPersonalizado) {
        tabPronto.addEventListener("click", function () {
            tabPronto.classList.add("active");
            tabPronto.setAttribute("aria-selected", "true");
            tabPersonalizado.classList.remove("active");
            tabPersonalizado.setAttribute("aria-selected", "false");
            formProntoWrapper.hidden = false;
            formProntoWrapper.classList.remove("hidden-tab");
            formPersonalizadoWrapper.hidden = true;
            formPersonalizadoWrapper.classList.add("hidden-tab");
        });

        tabPersonalizado.addEventListener("click", function () {
            tabPersonalizado.classList.add("active");
            tabPersonalizado.setAttribute("aria-selected", "true");
            tabPronto.classList.remove("active");
            tabPronto.setAttribute("aria-selected", "false");
            formPersonalizadoWrapper.hidden = false;
            formPersonalizadoWrapper.classList.remove("hidden-tab");
            formProntoWrapper.hidden = true;
            formProntoWrapper.classList.add("hidden-tab");
        });
    }

    // Lógica do Construtor de Doce Personalizado
    var formCustom = document.getElementById("form-pedido-personalizado");
    var customResumoTexto = document.getElementById("custom-resumo-texto");
    var customPrecoTotal = document.getElementById("custom-preco-total");
    var erroRecheios = document.getElementById("erro-recheios");
    var erroToppings = document.getElementById("erro-toppings");

    function atualizarDocePersonalizado() {
        if (!formCustom) return;

        // Tipo selecionado
        var tipoInput = formCustom.querySelector("input[name='custom-tipo']:checked");
        var tipoPreco = parseFloat(tipoInput.getAttribute("data-preco"));
        var tipoNome = tipoInput.value.split(" — ")[0]; // "Copo Personalizado" ou "Bolo Personalizado"

        // Base selecionada
        var baseInput = formCustom.querySelector("input[name='custom-base']:checked");
        var baseNome = baseInput ? baseInput.value : "Nenhum";

        // Recheios selecionados
        var recheiosChecked = formCustom.querySelectorAll("input[name='custom-recheio']:checked");
        var recheiosPreco = 0;
        var recheiosNomes = [];

        recheiosChecked.forEach(function (input) {
            recheiosPreco += parseFloat(input.getAttribute("data-preco"));
            recheiosNomes.push(input.value);
        });

        // Toppings selecionados
        var toppingsChecked = formCustom.querySelectorAll("input[name='custom-topping']:checked");
        var toppingsPreco = 0;
        var toppingsNomes = [];

        toppingsChecked.forEach(function (input) {
            toppingsPreco += parseFloat(input.getAttribute("data-preco"));
            toppingsNomes.push(input.value);
        });

        // Calcular preço final
        var precoFinal = tipoPreco + recheiosPreco + toppingsPreco;
        
        // Atualizar preço na tela
        if (customPrecoTotal) {
            customPrecoTotal.textContent = "R$ " + precoFinal.toFixed(2).replace(".", ",");
        }

        // Atualizar texto de resumo
        var resumoTexto = "Base: " + baseNome;
        if (recheiosNomes.length > 0) {
            resumoTexto += " | Recheios: " + recheiosNomes.join(", ");
        } else {
            resumoTexto += " | Recheios: Nenhum";
        }
        if (toppingsNomes.length > 0) {
            resumoTexto += " | Toppings: " + toppingsNomes.join(", ");
        } else {
            resumoTexto += " | Toppings: Nenhum";
        }
        
        if (customResumoTexto) {
            customResumoTexto.textContent = resumoTexto;
        }

        return {
            tipoNome: tipoNome,
            preco: precoFinal,
            observacao: resumoTexto
        };
    }

    if (formCustom) {
        // Escuta mudanças gerais no formulário
        formCustom.addEventListener("change", function () {
            atualizarDocePersonalizado();
        });

        // Limitar recheios a no máximo 3
        var recheiosCheckboxes = formCustom.querySelectorAll("input[name='custom-recheio']");
        recheiosCheckboxes.forEach(function (cb) {
            cb.addEventListener("click", function (e) {
                var checkedCount = formCustom.querySelectorAll("input[name='custom-recheio']:checked").length;
                if (checkedCount > 3) {
                    e.preventDefault();
                    if (erroRecheios) {
                        erroRecheios.textContent = "Escolha no máximo 3 recheios.";
                    }
                } else {
                    if (erroRecheios) erroRecheios.textContent = "";
                }
            });
        });

        // Limitar toppings a no máximo 2
        var toppingsCheckboxes = formCustom.querySelectorAll("input[name='custom-topping']");
        toppingsCheckboxes.forEach(function (cb) {
            cb.addEventListener("click", function (e) {
                var checkedCount = formCustom.querySelectorAll("input[name='custom-topping']:checked").length;
                if (checkedCount > 2) {
                    e.preventDefault();
                    if (erroToppings) {
                        erroToppings.textContent = "Escolha no máximo 2 toppings.";
                    }
                } else {
                    if (erroToppings) erroToppings.textContent = "";
                }
            });
        });

        // Adição do doce personalizado ao carrinho
        formCustom.addEventListener("submit", function (e) {
            e.preventDefault();

            var dados = atualizarDocePersonalizado();
            var produtoNome = dados.tipoNome + " — R$ " + dados.preco.toFixed(2).replace(".", ",");
            var observacao = dados.observacao;

            // Cria linha na tabela e adiciona
            var novaLinha = criarLinha(proximoId, produtoNome, 1, observacao);
            proximoId++;
            tbodyPedido.appendChild(novaLinha);

            // Atualiza o resumo financeiro geral e salva no localStorage
            atualizarResumo();
            salvarCarrinho();

            // Reseta o construtor personalizado
            formCustom.reset();
            if (erroRecheios) erroRecheios.textContent = "";
            if (erroToppings) erroToppings.textContent = "";
            atualizarDocePersonalizado(); // Restaura resumo padrão

            // Rola suavemente até a sacola de pedidos com animação de destaque
            var listaArea = document.querySelector(".pedido-lista-area");
            if (listaArea) {
                listaArea.scrollIntoView({ behavior: "smooth" });
                var tabela = document.getElementById("tabela-pedido");
                if (tabela) {
                    tabela.classList.add("tabela-destaque");
                    setTimeout(function () {
                        tabela.classList.remove("tabela-destaque");
                    }, 1500);
                }
            }
        });

        // Inicializa o resumo no carregamento
        atualizarDocePersonalizado();
    }

    // Carrega o carrinho existente ou inicia um novo
    carregarCarrinho();

    // Captura o parâmetro do produto enviado pelo cardápio
    var params = new URLSearchParams(window.location.search);
    var produtoParam = params.get("produto");
    if (produtoParam) {
        // Valida se o produto existe no select
        var selectProduto = document.getElementById("produto");
        var opcaoExiste = false;
        if (selectProduto) {
            for (var i = 0; i < selectProduto.options.length; i++) {
                if (selectProduto.options[i].value === produtoParam) {
                    opcaoExiste = true;
                    break;
                }
            }
        }

        if (opcaoExiste) {
            // Verifica se o produto já existe no carrinho para apenas somar a quantidade
            var trExistente = null;
            var linhas = tbodyPedido.querySelectorAll("tr");
            for (var i = 0; i < linhas.length; i++) {
                var celulas = linhas[i].querySelectorAll("td");
                if (celulas[0].textContent === produtoParam) {
                    trExistente = linhas[i];
                    break;
                }
            }

            if (trExistente) {
                var tdQtd = trExistente.querySelectorAll("td")[1];
                var qtdAtual = parseInt(tdQtd.textContent, 10);
                tdQtd.textContent = qtdAtual + 1;
            } else {
                var novaLinha = criarLinha(proximoId, produtoParam, 1, "");
                proximoId++;
                tbodyPedido.appendChild(novaLinha);
            }

            // Atualiza o resumo e salva o estado do carrinho
            atualizarResumo();
            salvarCarrinho();

            // Limpa o parâmetro da URL para evitar inserções repetidas ao recarregar a página
            window.history.replaceState({}, document.title, window.location.pathname);

            // Rola suavemente até o carrinho e aplica uma animação de destaque
            var listaArea = document.querySelector(".pedido-lista-area");
            if (listaArea) {
                listaArea.scrollIntoView({ behavior: "smooth" });
                
                var tabela = document.getElementById("tabela-pedido");
                if (tabela) {
                    tabela.classList.add("tabela-destaque");
                    setTimeout(function () {
                        tabela.classList.remove("tabela-destaque");
                    }, 1500);
                }
            }
        }
    }
});
