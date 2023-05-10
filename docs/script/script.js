console.clear();

// 메인 슬라이더 영역
let mainSlider = new Swiper('.main__slider.swiper', {
	slidesPerView: 1,

	autoplay: {
		delay: 2500,
		disableOnInteraction: false,
	},

	navigation: {
		nextEl: '.main__btn-next',
		prevEl: '.main__btn-prev',
	},

	pagination: {
		el: ".main__progress",
		type: "progressbar",
	},

	on: {
		slideChange: function() {
			$('.main__curentPage').text(mainSlider.realIndex + 1);
		},
	},

});

$('.main__slider.swiper').mouseenter(function(){
	mainSlider.autoplay.stop();
	$('.main__btn-pause').addClass('stop');
});
$('.main__slider.swiper').mouseleave(function(){
	mainSlider.autoplay.start();
	$('.main__btn-pause').removeClass('stop');
});

// 메인 슬라이더 일시정지 버튼
$('.main__btn-pause').click(function(){
	if($(this).hasClass('stop')){
		mainSlider.autoplay.start();
		$(this).removeClass('stop');
	}
	else {
		mainSlider.autoplay.stop();
		$(this).addClass('stop');
	}
});

// 행사 상품 슬라이더
function eventSlider() {
		event_Slider = new Swiper('.main__eventSlider.swiper.selected', {
		slidesPerView: 4,
		slidesPerGroup: 4,
		spaceBetween: 12,
		loop: true,

		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},

		pagination: {
			el: ".main__eventPagination",
			type: "bullets",
			clickable: true,
		},
	});
}
eventSlider();

// 행사 상품 탭 메뉴
$('.main__eventList > li').click(function(){
	event_Slider.destroy();
	$(this).siblings('.selected').removeClass('selected');
	$(this).addClass('selected');

	let $eventWrap = $(this).closest('.main__eventWrap');
	let $eventContent = $eventWrap.find('.main__eventContent');

	
	$eventContent.find('.selected').removeClass('selected');
	$eventContent.find('.main__eventSlider').eq($(this).index()).addClass('selected');
	eventSlider();
});


// only이마트24 슬라이더
let onlyEmart_Slider = new Swiper('.onlyEmart__productWrap.swiper', {
	slidesPerView: 4,
	slidesPerGroup: 4,
	spaceBetween: 16,

});

// 이마트24 스토리 슬라이더
let emart24Story_Slider = new Swiper('.emart24Story__contents.swiper', {
	slidesPerView: 3,
	slidesPerGroup: 3,
	spaceBetween: 10,

	navigation: {
		nextEl: '.emart24Story__btnNext',
		prevEl: '.emart24Story__btnPrev',
	},
});

/* 발견되면 활성화시키는 라이브러리 시작 */
function ActiveOnVisible__init() {
	$('.active-on-visible').each(function(index, node) {
		let $node = $(node);

		let onFuncName = $node.attr('data-active-on-visible-on-func-name');
		let offFuncName = $node.attr('data-active-on-visible-off-func-name');

		$node.data('data-active-on-visible-on-func-name', onFuncName);
		$node.data('data-active-on-visible-off-func-name', offFuncName);
	});

	$(window).resize(_.debounce(ActiveOnVisible__initOffset, 500));
	ActiveOnVisible__initOffset();

	$(window).scroll(_.debounce(ActiveOnVisible__checkAndActive, 50));
	ActiveOnVisible__checkAndActive();
}

function ActiveOnVisible__initOffset() {
	var windowHeight = $(window).height();

	$('.active-on-visible:not(.actived)').each(function(index, node) {
		let $node = $(node);

		let offsetTop = $node.offset().top;

		let matrix = $node.css('transform').replace(/[^0-9\-.,]/g, '').split(',')
		let translateX = matrix[12] || matrix[4];
		let translateY = matrix[13] || matrix[5];

		if ( translateY ) {
			offsetTop -= translateY;
		}

		$node.attr('data-active-on-visible-offsetTop', offsetTop);
		$node.data('data-active-on-visible-offsetTop', offsetTop);

		if ( !$node.attr('data-active-on-visible-diff-y') ) {
			$node.attr('data-active-on-visible-diff-y', '0');
		}

		if ( !$node.attr('data-active-on-visible-delay') ) {
			$node.attr('data-active-on-visible-delay', '0');
		}

		let diffY = $node.attr('data-active-on-visible-diff-y');
		let delay = $node.attr('data-active-on-visible-delay');

		if ( diffY.substr(-2, 2) == 'vh' ) {
			diffY = parseInt(diffY);

			diffY = windowHeight * (diffY / 100);
		}
		else if ( diffY.substr(-1, 1) == '%' ) {
			diffY = parseInt(diffY);

			diffY = $node.height() * (diffY / 100);
		}
		else {
			diffY = parseInt(diffY);
		}

		$node.attr('data-active-on-visible-diff-y-real', diffY);
		$node.data('data-active-on-visible-diff-y', diffY);
		$node.data('data-active-on-visible-delay', delay);
	});

	ActiveOnVisible__checkAndActive();
}

function ActiveOnVisible__checkAndActive() { 
	$('.active-on-visible:not(.actived)').each(function(index, node) {
		let $node = $(node);

		let offsetTop = $node.data('data-active-on-visible-offsetTop') * 1;
		let diffY = parseInt($node.data('data-active-on-visible-diff-y'));
		let delay = parseInt($node.data('data-active-on-visible-delay'));

		let onFuncName = $node.data('data-active-on-visible-on-func-name');
		let offFuncName = $node.data('data-active-on-visible-off-func-name');

		let scrollTop = $(window).scrollTop();
		let windowHeight = $(window).height();
		let nodeHeight = $node.height();

		if ( scrollTop + windowHeight + diffY > offsetTop ) {
			setTimeout(function() {
				if ( $node.hasClass('active') == false ) {
					$node.addClass('active');

					if ( $node.hasClass('can-active-once') ) {
						$node.addClass('actived');
					}

					if ( window[onFuncName] ) {
						window[onFuncName]($node);
					}
				}
			}, delay);
		}
		else {
			if ( $node.hasClass('active') ) {
				$node.removeClass('active');

				if ( window[offFuncName] ) {
					window[offFuncName]($node);
				}
			}
		}
	});
}

$(function() {
	ActiveOnVisible__init();
})
/* 발견되면 활성화시키는 라이브러리 끝 */

// 헤더 상단 고정
$(window).on("scroll", function(){
	let scrollTop = $(this).scrollTop();

	if(scrollTop > 0) {
		$('.header').addClass('fixed');	
		$('.header').removeClass('fixedout');
	}
	else {
		$('.header').removeClass('fixed');
	}
});

// 헤더 고정 상태 중 마우스아웃 시
$('.header').mouseout(function(){	
	$('.header').removeClass('fixed');
	$('.header').addClass('fixedout');	
});
