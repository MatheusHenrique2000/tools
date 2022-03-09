var tools = {};

tools.afterLoad = function(actions=()=>{}){
    window.addEventListener('load',actions)
};

tools._switch = function (key,par,...arg){
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

tools.isObject = function(a){
    return (typeof a !== 'undefined' ? Object.prototype.toString.call(a) == '[object Object]': false)
};

typeof module !== 'undefined' && (module.exports = tools);
typeof window !== 'undefined' && (window.tools = tools);