$(document).ready(function(){
    $('.menu-bar').click(function(){
        $('.menu').stop().slideToggle();
    });
    $('html').keydown(function(e){
        if(e.keyCode == 33) { $('.grids_bootstrap').fadeToggle(); }
    });

    //TOPOS
    timetoscroll = "";
    $(window).scroll(function(e){
          clearTimeout(timetoscroll);
          var posY = (document.documentElement.scrollTop) ? document.documentElement.scrollTop : window.pageYOffset;
      timetoscroll = setTimeout(function(){
        if(posY > 200){
          $('#header2').fadeIn();
        }
        if(posY < 200){
          $('#header2').fadeOut();      
        }
      },100);
    });

    //ROLAGEM
    jQuery(document).ready(function($) { 
        $(".scroll").click(function(event){        
            event.preventDefault();
            window.history.pushState({url: "" + $(this).attr('href') + ""}, $(this).attr('title') , $(this).attr('href'));
            $('html,body').animate({scrollTop:$(this.hash).offset().top}, 800);
       });
    });

    //FORM
    $('.form').submit(function(e){
        e.preventDefault();
        // alert('teste');
        $('.btn-padrao').attr('type','button');
        textoBotao = $(this).find('.btn-padrao').text();
        $('.btn-padrao').text('enviando...');
        $('.load').show();
        name = $(this).attr('id');
        $.ajax({
            url: 'php/'+name+'.php',
            data: new FormData(this),
            processData: false,
            contentType: false,
            type: 'POST',
            dataType: "html",
            success:function(retorno){
               $('#retorno').html(retorno);
            }
        });
    });

    //FORM
    $('.form2').submit(function(e){
        e.preventDefault();
        // alert('teste');
        $('.btn-padrao').attr('type','button');
        textoBotao = $(this).find('.btn-padrao').text();
        $('.btn-padrao').text('enviando...');
        $('.load').show();
        name = $(this).attr('id');
        $.ajax({
            url: '../php/'+name+'.php',
            data: new FormData(this),
            processData: false,
            contentType: false,
            type: 'POST',
            dataType: "html",
            success:function(retorno){
               $('#retorno').html(retorno);
            }
        });
    });

     //ADICIONA PRODUTO CARRINHO
    $('.adiciona_carrinho').submit(function(e){
        e.preventDefault();
        $.ajax({
            url: '../php/carrinho_funcoes.php',
            data: $(this).serialize(),
            type: 'POST',
            dataType: "html"
        }).done(function(data){
            $('#myModalAdd').modal()
            $('#myModalAdd .modal-body').html(data);
        });
    });

    //REMOVER PRODUTO CARRINHO
    $('.remove-produto').click(function(){
        idproduto = $(this).attr('id');
        $.ajax({
            url: 'php/carrinho_funcoes.php',
            data:{id:idproduto, acao:"del"},
            type: 'POST',
            dataType: "html"
        }).done(function(data){
            location.reload();
        })
    });

    //ATUALIZAR PRODUTO CARRINHO
    $('.atualiza-produto').submit(function(e){
        e.preventDefault();
        $.ajax({
            url: 'php/carrinho_funcoes.php',
            data: $(this).serialize(),
            type: 'POST',
            dataType: "html"
        }).done(function(data){
            location.reload();
        })
    });

    $('.finaliza-orcamento').click(function(){
        var hcarrinho = $('.carrinho').height();
        var hcarrinho = hcarrinho + 400;
        $('body').animate({scrollTop:hcarrinho}, '500');
        $("#formulario-orcamento").slideDown();
    });


    // ANIMAÇÃO
    // 1 - Selecionar elementos que devem ser animados
    // 2 - Definir a classe que é adicionada durante a animação
    // 3 - Criar função de animação
    // 3.1 - Verificar a distância entre a barra de scroll e o topo do site
    // 3.2 - Verificar se a distância do 3.1 + Offset é maior do que a distância entre o elemento e o Topo da Página.
    // 3.3 - Se verdadeiro adicionar classe de animação, remover se for falso.
    // 4 - Ativar a função de animação toda vez que o usuário utilizar o Scroll
    // 5 - Otimizar ativação
    // Debounce do Lodash
    const debounce = function(func, wait, immediate) {
      let timeout;
      return function(...args) {
        const context = this;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    const target = document.querySelectorAll('[data-anime]');
    const animationClass = 'animate';

    function animeScroll() {
      const windowTop = window.pageYOffset + ((window.innerHeight * 3) / 4);
      target.forEach(function(element) {
        if((windowTop) > element.offsetTop) {
          element.classList.add(animationClass);
        } else {
          element.classList.remove(animationClass);
        }
      })
    }

    animeScroll();

    if(target.length) {
      window.addEventListener('scroll', debounce(function() {
        animeScroll();
      }, 200));
    }
});
