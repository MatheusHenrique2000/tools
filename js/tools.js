// The functions is ordered by number of upercase letter after by alphabetic

var tools = {};

tools.switch = function _switch(key,par,...arg){
    var res = [], exeDf = true, _case, _default;

    _case = arg.slice(0,arg.length - 1);
    _default = arg[arg.length -1];

    for (let i = 0; i < _case.length; i+=2) {
        const value = _case[i];
        const exe = _case[i+1]
        
        if(typeof value == 'string'){
            if(key === value){res[res.length] = exe(par);exeDf = false};
        }else
        if(typeof value == 'function'){
            if(!!(value(key))){res[res.length] = exe(par);exeDf = false};
        }else{
            console.error('type error of value');
            return
        }
    }

    exeDf && (res[res.length] = _default(par))
    return res
};

tools.toggle = function toggle(){
    obj = arguments.callee.caller;
    obj == null && (obj = this);
    return (obj._toggle = (typeof obj._toggle == 'undefined' || obj._toggle == false ? true : false));
}

tools.isObject = function isObject(a){
    return (typeof a !== 'undefined' ? Object.prototype.toString.call(a) == '[object Object]': false)
};

tools.toBinary = function toBinary(n){
    return Number((n).toString(2));
}

// --- HTML functions ---

typeof window !== 'undefined' && (function(){

    tools.afterLoad = function afterLoad(actions=()=>{}){
        window.addEventListener('load',actions)
    };

    tools.comparePath = function comparePath(path1, path2){
        // debugger
        if(arguments.callee.caller.name != 'comparePath'){
            fn = f_comparePath.bind(comparePath,arguments);
            return fn()
        };
        
        for(var i in arguments[0]){
            var el = arguments[0][i];
            if(typeof el !== 'string'){
                this['pathText'+i] = '';
                if(typeof el === 'undefined'|| typeof el.path === 'undefined'){return false}
                el = el.path;
                for(var ii in el){this['pathText'+i] += String(el[ii].nodeName)}
            }else{
                this['pathText'+i] = el.split(' ').join('');
            }
        }
        // debugger
        return (this.pathText0 == this.pathText1);
    }

    tools.getPath = function getPath(){
        window.addEventListener('click',function f_getPathListener(e){
            f_getPath.path = e.path;
            window.removeEventListener('click',f_getPathListener);
        });
    };

    tools.isCollide = function isCollide(a, b){
        return !(
            ((a.offsetTop  + a.offsetHeight) < b.offsetTop ) ||
            ((b.offsetTop  + b.offsetHeight) < a.offsetTop ) ||
            ((a.offsetLeft + a.offsetWidth ) < b.offsetLeft) ||
            ((b.offsetLeft + b.offsetWidth ) < a.offsetLeft)
        );
    };

})();

typeof module !== 'undefined' && (module.exports = tools);
typeof window !== 'undefined' && (window.tools = tools);