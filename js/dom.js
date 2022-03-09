
window.dom = function(str,objHtml){
    var res, exe, query;

    function _switch(...arg){
        var res = [], exeDf = true , key, par, _case, _default;
    
        key = arg[0];
        par = arg[1];
        _case = arg.slice(2,arg.length - 1);
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
    function isObject(a){
        return (typeof a !== 'undefined' ? Object.prototype.toString.call(a) == '[object Object]': false)
    };
    function isHtml(obj1){
        return (typeof obj1 !== 'undefined' ? !!(Object.prototype.toString.call(obj1).match('HTML')): false)
    };

    //---

    function convertToArray(str,exe){
        var op, res,arm;
    
        function state(opt){
            var res = false;
            if(typeof state.str != 'string'){state.str = opt; return false};
            if(state.str != opt){res= true};
            state.str = opt;
            return res
        };
        function insTag(op,str,pos){
            var res = '';
            while(str[pos]==' '){pos++};
            !op._find(str[pos]) && (res = ',@,');
            return [res,pos]
        };
        function keysToString(obj){
            var str='';
            for(i in obj){str+=i};
            return str
        };

    // ---
    
        function exeOperator(elBack,el,elNext,op,str,pos){
            var res = '';
            if(el == '-' && elBack != '='){return exeValue(elBack,el,elNext,op,str,pos)}
            state('operator') && (res += ',');
            res += el;
            return [res,pos]
        };
        function exeValue(elBack,el,elNext,op,str,pos){
            var res = '',close = '}])';
            state('value') && (res += ',');
            if(!close._find(el)){res += el};
            return [res,pos]
        };
        function exeSpace(elBack,el,elNext,op,str,pos){
            var res='',arm;
            if(!op._find(elBack) && elBack != ' '){
                arm = insTag(op,str,pos);
                res = arm[0];
                pos = arm[1];
            }
            return [res,pos]
        };
    
    // ---

        str = str.trim()
        res = '';
        op = keysToString(exe);
    
        !op._find(str[0]) && (res += '@,');
    
        for (let i = 0; i < str.length; i++) { // interrar por caracter
            var arm, el = str[i], elNext = str[i+1], elBack = str[i-1];
            
            arm = _switch('','',
                ()=>(op._find(el))              ,()=>exeOperator(elBack,el,elNext,op,str,i),
                ()=>(!op._find(el) && el != ' '),()=>exeValue(elBack,el,elNext,op,str,i),
                ()=>(el == ' ')                 ,()=>exeSpace(elBack,el,elNext,op,str,i),
                ()=>'')[0];
    
            res += arm[0];
            pos = arm[1];
        };
    
        res = res._split(',')
    
        return res
    };

    //--

    String.prototype._find = function(el=''){
        var res,_str,_el,_limit;

        if(el == ''){return false}

        _el = '';
        res = false;
        _limit = el.length;

        _str = this;
        while(_str.length > 0 && res == false){
            let _i = 0;
                while(_i < _limit){
                    typeof _str[_i] !== 'undefined' ?
                        _el += _str[_i]:
                        _i = _limit -1;
                    _i++
                };

            el == _el && (res = true);
            
            _el = '';
            _str = _str.slice(1);
        }

        return res
    };
    String.prototype._split = function(sep=''){
        var r = [];
        var rr='';
        var el='';
        var str = this;
        var limit = sep.length;

        sep === '' && (rr=str);

        while (str.length > 0 && limit > 0) {
            let i = 0;
            el = '';

            while(i < limit){el += str[i]; i++};

            if(el == sep){
                r[r.length] = rr; rr = '';
                i = 1;
                while(i < limit){str = str.slice(1);i++};
            }else{
                rr += el[0];
            }
            
            str = str.slice(1);
        };
        
        r[r.length]=rr;

        return r
    };

    exe = {
        '@':function(el){res = res.getElementsByTagName(el)},
        '#':function(el){res = res.getElementById(el)},
        '.':function(el){res = res.getElementsByClassName(el)},
        '[':function(el){res = res[el]},
        '=-':function(el){res.remove()},
        '=+':function(el){
            var ins = document.createElement(el);
            res = res.appendChild(ins);
        },
        '<+':function(el){
            var ins = document.createElement(el);
            var father = res.parentNode;
            res = father.insertBefore(ins, res.nextSibling);
            // insert after
        },
        '>+':function(el){
            var ins = document.createElement(el);
            var father = res.parentNode;
            res = father.insertBefore(ins, res);
            // insert before
        }
    };

    isHtml(objHtml) ? res = objHtml : res = document;
    query = convertToArray(str,exe);

    for (let i = 0; i < query.length; i+= 2) {
        exe[query[i]](query[i+1]);
    }

    return res
};