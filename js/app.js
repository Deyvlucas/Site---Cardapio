$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {
    // obtem a lista de itens do cardapio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);


        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');

        }


        $.each(filtro, (i, e) => {
            // REGEX filtrar coisas dentro de texto por js
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img) // MODIFICA A IMAGEM DOS PRODUTOS
                .replace(/\${name}/g, e.name) // MODIFICA O NOME DOS PRODUTOS
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))  // MODIFICA O PREÇO DOS PRODUTOS, toFixed(2).replace('.', ',') coloca duas casas decimais e acrescenta virgula no lugar do ponto.
                .replace(/\${id}/g, e.id)
            // botão ver mais foi clicacao 12 itens 
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp) // isso e feito no jquery

            }
            // paginação inicial 8 itens 
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp) // isso e feito no jquery
            }

        })
        // remove o ativo 
        $(".container-menu a").removeClass('active');

        // marca o menu para ativo

        $("#menu-" + categoria).addClass('active')
    },
    // clique no botaõ de ver mais 
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },
    // diminuir a quantidade dos produtos no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1);
        }
    },

    // aumentar a quantidade dos produtos no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            // obeteer a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obeter a lista de itens 
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                // valirdar se ka existe esse item no carrinho 
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // caso ja exista, so altea a quantidade 
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // caso ainda não exista item no carrinho, adiciona ele
                else {
                    item[0].qntd = qntdAtual
                    MEU_CARRINHO.push(item[0])
                }
            }
        }

    },
}

cardapio.templates = {

    item: ` 
    <div class="col-3 mb-3">
        <div class="card card-item" id="\${id}">
            <div class="img-produto">
                <img src="\${img}" alt="">
            </div>
            <p class="title-produto text-center mt-2">
                <b>\${name}</b>
            </p>
            <p class="price-produto text-center">
                <b>R$ \${price}</b>
            </p>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="btn-numero-itens" id="qntd-\${id}">0</span>
                <span class="btn-mais"  onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add "onclick="cardapio.metodos.adicionarAoCarrinho"><i class="fa fa-shopping-bag"></i></span>
            </div>
        </div>
    </div> 
    `
}