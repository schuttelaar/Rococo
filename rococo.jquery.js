

UI.classes.jQueryHelper = {
	wrapper: function(nodes) {
		var $nodes = $();
		for(var j=0; j<nodes.length; j++) {
			$nodes.push(nodes[j]);
		}
		return $nodes;
	}
}


UI.hooks.beforeAwake = function($nodes) {
	var nodes = [];
	$nodes.each(function(){
		nodes.push(this);
	});
	return nodes;
}

UI.hooks.beforeInit = function(c) {
	c.$node = $(c.node);
	c.$nodes = UI.classes.jQueryHelper.wrapper(c.nodes);
}