## HTML side

	<ul id="unique_id" style="width:--px; height:--px;">
	  <li>item</li>
	  <li>item</li>
	  <li>item</li>
	  ........
	</ul>

## JAVASCRIPT side

	$('#unique_id').listVerticalScroller(options);

#### Options

* direction: List scrolling direction ... (1 or -1)(default - -1)
* duration: List staying time ... (int / milliseconds)(default - 3000)
* speed: List moving speed ... (int / milliseconds)(default - 500)
* mouseOverEffect: Use mouseover to stop the list moving ... (boolean)(default - true)

