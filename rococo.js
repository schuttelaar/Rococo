//Rococo JS Framework
UI = {
	instances:{},components:{},classes:{},CMPID:0,instancesByComp:{},hooks:{},
	awake:function(n, onlySelected){
		if (UI.hooks && UI.hooks.beforeAwake) UI.hooks.beforeAwake(n);
		var rmClass = function(el,className){
			el.className = el.className.replace(
            new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g'),
            '$1'
			);
		}
		var awakeComponents = function(awakables) {
			for(var i = 0; i < awakables.length; i ++) {
				var thiz = awakables[i];
				var comp = thiz.getAttribute('data-awake');
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
				c.node = thiz;
				var otherNodes = document.querySelectorAll(".connected[data-belongsto=\""+thiz.id+"\"]");
				c.nodes = [];
				c.nodes.push(thiz);
				for (var j=0; j<otherNodes.length; j++) {
					c.nodes.push(otherNodes[j]);
				}
				var compID = 'CMPID'+(++UI.CMPID);
				if (thiz.id) {
					compID = thiz.id;
				}
				thiz.setAttribute('data-oid', compID);
				c.CMPID = compID;
				UI.instances[compID] = c;
				if (!UI.instancesByComp[comp]) UI.instancesByComp[comp] = {};
				UI.instancesByComp[comp][compID] = c;
				c.factory = UI.classes[thiz.getAttribute('data-factory')];
				if (c.factory) {
					c.delegate = c.factory.createNew();
				} else {
					c.delegate = UI.instances[thiz.getAttribute('data-delegate')];
				}
				if (c.delegate) {
					c.delegate.component = c;
					if (!c.delegate.components) c.delegate.components = {};
					c.delegate.components[compID] = c;
				}
				if (UI.hooks && UI.hooks.beforeInit) UI.hooks.beforeInit(c);
				if (c.init) c.init();
				rmClass(thiz,'awakable');
			};
		}
		if (onlySelected) {
			awakeComponents(n);
		} else {
			awakeComponents(document.querySelectorAll('.awakable[data-wake="early"]'));
			awakeComponents(document.querySelectorAll('.awakable'));
			awakeComponents(document.querySelectorAll('.awakable[data-wake="late"]'));
		}
	}	
}
