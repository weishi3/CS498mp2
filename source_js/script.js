var scrollAnimSpeed = 750;	// time to animate smooth scrolling (ms)
var $navbar = $('#navbar'); // navbar
var carousels = [];			// carousel array

function navbarCheckHeight() {
    if ($('body, html').scrollTop() > 0
        || $(document).scrollTop() > 0) {
        $navbar.removeClass('large');
        $navbar.addClass('small');
    } else {
        $navbar.removeClass('small');
        $navbar.addClass('large');
    }
}

// Check if middle of window is in an element
function isInView(elem) {
    var viewMid = $(window).scrollTop() + $(window).height() / 4;
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).outerHeight();
    return elemTop < viewMid && viewMid <= elemBottom;
}

$(document).ready(function() {

    $(window).on('scroll load', function() {
        // Adjust navbar height
        navbarCheckHeight();

        // Navbar position indicator
        $('.nav-section').each(function(index, elem) {
            $section = $('#' + $(this).data('name'));
            if (isInView($section)) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        })
    });

    // Smooth scrolling for navigating between sections
    $('.nav-section').on('click', function(event) {
        $section = $('#' + $(this).data('name'));
        if (!isInView($section)) {
            var offset = $section.attr('id') === 'overview' ? 65 : 45;
            $('html, body').stop().animate({
                scrollTop: $section.offset().top - offset
            }, scrollAnimSpeed);
        }
    });


    // Initialize all carousels
    $('.carousel').each(function(index, elem) {
        carousels.push(new Carousel(elem));
        //console.log(carousels[index]);
    });


    // Disable text selection on some elements
    $('.no-text-select').each(function() {
        $(this).bind('selectstart click mousedown', function(event) {
            event.preventDefault();
        });
    });


    // Add event listeners to Modal opening elements
    $('.modal-opener').on('click', function() {
        var modal = new Modal({
            content: $(this).html(),
            width: '450px',
            height: '350px'
        });
        modal.open();
    });
});



$(document).foundation();// Write any custom javascript functions here


var Carousel=function(elem){this.elem=elem,this.items=$(elem).find(".carousel-item"),this.current=0,this.numItems=this.items.length,this.speed=300,this.isAnim=!1,this.finished=0,this.prevToggle=$("<div/>",{"class":"carousel-nav carousel-prev word_center-wrapper",style:"height: 450px"}).html('<i class="fa fa-chevron-left word_center"></i>'),$(this.elem).prepend(this.prevToggle),this.nextToggle=$("<div/>",{"class":"carousel-nav carousel-next word_center-wrapper",style:"height: 450px"}).html('<i class="fa fa-chevron-right word_center"></i>'),$(this.elem).append(this.nextToggle);for(var indicatorContent='<ol class="carousel-controls">',i=0;i<this.numItems;i++)indicatorContent+='<li data-slide-number="'+i+'"></li>';indicatorContent+="</ol>",this.indicator=$("<div/>",{"class":"carousel-controls-container"}).html(indicatorContent),$(this.elem).append(this.indicator),this.setIndicator();var carousel=this;$(this.prevToggle).on("click",function(event){carousel.isAnim||carousel.prev()}),$(this.nextToggle).on("click",function(event){carousel.isAnim||carousel.next()}),$(this.indicator).on("click","li",function(event){if(!carousel.isAnim){var destSlideNum=parseInt($(this).data("slideNumber"));carousel.jump(destSlideNum)}}),this.items.each(function(index,elem){index!=carousel.current&&$(this).hide()})};Carousel.prototype.setIndicator=function(){var carousel=this;$(this.indicator).find("li").each(function(index,elem){index==carousel.current?$(elem).addClass("active"):$(elem).removeClass("active")})},Carousel.prototype.jump=function(slideNumber){console.log("jump from "+this.current+" to "+slideNumber),this.current>slideNumber?this.prev(slideNumber):this.current<slideNumber&&this.next(slideNumber)},Carousel.prototype.next=function(index){var carousel=this;this.isAnim=!0,console.log(index);var nextIndex="undefined"!=typeof index?index:(this.current+1)%this.numItems;console.log(nextIndex);var $currItem=$(this.items.get(this.current)),$nextItem=$(this.items.get(nextIndex));$nextItem.css("margin-left",$(this.elem).width()+"px"),$nextItem.show(),$nextItem.animate({"margin-left":"0px"},{duration:this.speed,queue:!1,always:function(){carousel.finished++,2==carousel.finished&&(carousel.isAnim=!1,carousel.finished=0,carousel.current=nextIndex,carousel.setIndicator())}}),$currItem.animate({"margin-left":"-"+$(this.elem).width()+"px"},{duration:this.speed,queue:!1,always:function(){$currItem.hide(),carousel.finished++,2==carousel.finished&&(carousel.isAnim=!1,carousel.finished=0,carousel.current=nextIndex,carousel.setIndicator())}})},Carousel.prototype.prev=function(index){var carousel=this;this.isAnim=!0;var prevIndex="undefined"!=typeof index?index:(this.current+this.numItems-1)%this.numItems,$currItem=$(this.items.get(this.current)),$prevItem=$(this.items.get(prevIndex));$prevItem.css("margin-left","-"+$(this.elem).width()+"px"),$prevItem.show(),$prevItem.animate({"margin-left":"0px"},{duration:this.speed,queue:!1,always:function(){carousel.finished++,2==carousel.finished&&(carousel.isAnim=!1,carousel.finished=0,carousel.current=prevIndex,carousel.setIndicator())}}),$currItem.animate({"margin-left":$(this.elem).width()+"px"},{duration:this.speed,queue:!1,always:function(){$currItem.hide(),carousel.finished++,2==carousel.finished&&(carousel.isAnim=!1,carousel.finished=0,carousel.current=prevIndex,carousel.setIndicator())}})};
var Modal=function(){this.closeButton=null,this.modal=null,this.overlay=null,this.options={className:"",content:"test",width:"350px",height:"100px"},arguments[0]&&"object"==typeof arguments[0]&&$.extend(this.options,arguments[0])};Modal.prototype.close=function(){this.modal.removeClass("modal-open"),this.overlay.removeClass("modal-open");var modal=this,transitionEndEvents="webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";this.modal.on(transitionEndEvents,function(){modal.modal.remove()}),this.overlay.on(transitionEndEvents,function(){modal.overlay.remove()})},Modal.prototype.open=function(){this.modal=$("<div/>",{"class":"modal "+this.options.className,css:{width:this.options.width,height:this.options.height}}),this.closeButton=$("<button/>",{"class":"modal-close-button"}).html("x"),this.overlay=$("<div/>",{"class":"modal-overlay "+this.options.className}),this.closeButton.appendTo(this.modal),$("<div/>",{"class":"modal-content"}).html(this.options.content).appendTo(this.modal),$("body").append(this.overlay),$("body").append(this.modal),this.closeButton.on("click",this.close.bind(this)),this.overlay.on("click",this.close.bind(this));var _=this;setTimeout(function(){_.modal.addClass("modal-open"),_.overlay.addClass("modal-open")},1)};