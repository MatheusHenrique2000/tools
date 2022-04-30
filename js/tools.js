var tools = {};


tools._switch = function _switch(key,par,...arg){
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

    tools.isCollide = function isCollide(a, b){
        return !(
            ((a.offsetTop  + a.offsetHeight) < b.offsetTop ) ||
            ((b.offsetTop  + b.offsetHeight) < a.offsetTop ) ||
            ((a.offsetLeft + a.offsetWidth ) < b.offsetLeft) ||
            ((b.offsetLeft + b.offsetWidth ) < a.offsetLeft)
        );
    }

})();

typeof module !== 'undefined' && (module.exports = tools);
typeof window !== 'undefined' && (window.tools = tools);