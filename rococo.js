//Rococo JS Framework
UI = {
	instances:{},components:{},classes:{},CMPID:0,instancesByComp:{},
	awake:function($n, onlySelected, cycles){
		var awakeComponents = function($awakables) {
			$awakables.each(function(){
				var comp = this.getAttribute('data-awake');
				if (!comp) throw('Invalid component ID');
				var parts = comp.split('.');
				var compRef = UI.components
				while (parts.length) {
					var p = parts.shift();
					compRef = compRef[p]
				}
				if (!compRef) return;
				if (!compRef.createNew) return;
				var c = compRef.createNew();
				if (!c) throw('Invalid createNew() function on '+comp+', should return object! ');
				c.$node = $(this);
				c.$nodes = $(this).add( $(".connected[data-belongsto=\""+this.id+"\"]") );
				var compID = 'CMPID'+(++UI.CMPID);
				if (this.id) {
					compID = this.id;
				}
				this.setAttribute('data-oid', compID);
				c.CMPID = compID;
				UI.instances[compID] = c;
				if (!UI.instancesByComp[comp]) UI.instancesByComp[comp] = {};
				UI.instancesByComp[comp][compID] = c;
				c.factory = UI.classes[this.getAttribute('data-factory')];
				if (c.factory) {
					c.delegate = c.factory.createNew();
				} else {
					c.delegate = UI.instances[this.getAttribute('data-delegate')];
				}
				if (c.delegate) {
					c.delegate.component = c;
					if (!c.delegate.components) c.delegate.components = {};
					c.delegate.components[compID] = c;
				}
				if (c.init) c.init();
				$(this).removeClass('awakable');
			});
		}
		if (onlySelected) {
			awakeComponents($n);
		} else {
			awakeComponents($n.find('.awakable[data-wake="early"]'));
			awakeComponents($n.find('.awakable'));
			awakeComponents($n.find('.awakable[data-wake="late"]'));
		}
	}	
}
