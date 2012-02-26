(function($) {
	$.fn.listVerticalScroller = function(userArgs) {
		if(!this.length) return false;
		if(!this.is('ul') && !this.is('ol')) return this;
		
		var args = {
			direction:-1,
			duration:3000,
			speed:500,
			mouseOverEffect:true
		}
		$.extend(true, args, userArgs);
		
		var frame = this.css({'position':'relative','overflow':'hidden'});
		var total = frame.find('li').length;
		var frameH = Math.round(frame.height());
		var items = new Array();
		var timer = null;
		var timerRun = false;
		var lastItem = 0;
		var topItem = 0;
		if(args.direction == 0 || args.direction < -1 || args.direction > 1) args.direction = -1;
		if(args.direction > 0) topItem = 1;
		
		if(args.direction < 0) var initPosi = 0;
		else if(args.direction > 0) initPosi = 0;
		
		//INITIAL POSITION SETTING
		var totalLi = 0;
		if(args.direction < 0) {
			frame.find('li').each( function(index) {
				var thisH = Math.ceil($(this).outerHeight(true));
				var topPosi = totalLi+initPosi;
				$(this).css({'position':'absolute','left':0});
				if(topPosi > frameH) {
					$(this).css('top',frameH+'px');
					var obj = {mv:false,posi:frameH};
				}else{
					$(this).css('top',topPosi+'px');
					obj = {mv:true,posi:topPosi};
				}
				totalLi += thisH;
				obj.height = thisH;
				obj.item = $(this);
				items.push(obj);
			});
			for(var i=0;i<items.length;i++) {
				if(items[i].mv == false) {
					lastItem = adjust(i-1);	
					break;
				}
			}
		}else{
			frame.find('li').each( function(index) {
				thisH = Math.ceil($(this).outerHeight(true));
				if(index === 0) {
					topPosi = 0;
				}else{
					topPosi = initPosi - totalLi - thisH + items[0].height;
				}
				$(this).css({'position':'absolute','left':0});
				if(topPosi < -frameH) {
					$(this).css('top',frameH+'px');
					obj = {mv:false,posi:frameH};
				}else{
					$(this).css('top',topPosi+'px');
					obj = {mv:true,posi:topPosi};	
				}
				totalLi += thisH;
				obj.height = thisH;
				obj.item = $(this);
				items.push(obj);
			});
			for(i=0;i<items.length;i++) {
				if(items[i].mv == false) {
					lastItem = adjust(i-1);	
					break;
				}
			}
		}
		
		if(totalLi > frameH) {
			if(args.mouseOverEffect) {
				frame.mouseenter( function(e) {
					e.preventDefault();
					clearTimer();
				}).mouseleave( function(e) {
					e.preventDefault();
					setTimer();
				});
			}
			setTimer();
		}
		totalLi = null, obj = null, topPosi = null, thisH = null;
	
		function listItemMove() {
			if(args.direction < 0) {
				var posi = items[lastItem].posi + items[lastItem].height;
				if(posi - items[topItem].height > frameH) {
					var calcuFin = true;	
				}else{
					calcuFin = false;
				}
				while(!calcuFin) {
					lastItem = adjust(lastItem+1);
					items[lastItem].item.css('top', posi+'px');
					items[lastItem].mv = true;
					items[lastItem].posi = posi;
					posi += items[lastItem].height;
					if(posi - items[topItem].height > frameH) {
						calcuFin = true;	
					}
				}
			}else{
				posi = items[lastItem].posi;
				if(posi + items[topItem].height < 0) {
					calcuFin = true;
				}else{
					calcuFin = false;	
				}
				while(!calcuFin) {
					lastItem = adjust(lastItem+1);
					var newPosi = posi - items[lastItem].height;
					items[lastItem].item.css('top', newPosi+'px');
					items[lastItem].mv = true;
					items[lastItem].posi = newPosi;
					if(newPosi < 0) {
						calcuFin = true;
					}
				}
			}
			posi = null, calcuFin = null;
			
			$.when( (function() {	
				for(var i=0;i<items.length;i++) {
					if(items[i].mv) {
						items[i].posi += items[topItem].height*args.direction;
						items[i].item.stop(true,true).animate({'top':items[i].posi+'px'}, args.speed);
					}
				}
			})()).then( function() {
				if(args.direction < 0) {
					items[topItem].mv = false;
					topItem = adjust(topItem+1);
				}else{
					topItem = adjust(topItem+1);
					for(var i=0;i<items.length;i++) {
						if(items[i].mv) {
							if(items[i].posi >= frameH) {
								items[i].mv = false;
							}
						}
					}
				}
			});
			
			return false;			
		}
		
		function adjust(id) {
			if(id >= total) return 0;
			else if(id < 0) return total-1;
			else return id; 
		}
		
		function setTimer() {
			if(!timerRun) {
				timerRun = true;
				timer = window.setInterval(function() {
					listItemMove();
				}, args.duration);
			}
		}
		
		function clearTimer() {
			timerRun = false;
			window.clearInterval(timer);
			timer = null;
		}
		
		this.startTimer = function() {
			setTimer();
		}
		
		this.stopTimer = function() {
			clearTimer();	
		}
		
		this.clearMemory = function() {
			frame = null, total = null, items = null, timer = null, timerRun = null, topItem = null, lastItem = null;
		}
		
		return this;
	}
})(jQuery);
