// The functions is ordered by number of upercase letter after by alphabetic

var tools = {};

// switch analyzing

tools.switch = function Switch(key,par=undefined,isBlock=true,...arg){

    if(!(Switch.isBind)){Switch.arm = {}; Switch.isBind = true; return (Switch.bind(Switch.arm,...arguments))()};
    Switch.isBind = undefined;

    // ---

    this.res = [];
    this.temp = {};
    this.share = {};
    this.Case = [];
    this.CaseExe = [] ;
    this.exeDf = false;
    this.validate = undefined;
    this.Default = undefined;

    // ---

    function Validate(obj,_string,_number,_function,_array,_object){
        var exe;
        var i;
        var objName = obj[0];

        this.temp.obj = this;
        for(i in obj){
            this.temp.obj = this.temp.obj[obj[i]]
        }
        obj = this.temp.obj;

        if(Array.isArray(_string) && typeof obj === 'string'){
            exe = _string.shift();
            (exe.bind(this))();
        }
        else if(Array.isArray(_number) && typeof obj === 'number'){
            exe = _number.shift();
            (exe.bind(this))();
        }
        else if(Array.isArray(_function) && typeof obj === 'function'){
            exe = _function.shift();

            this.temp[objName] = obj.bind(this.share);

            (exe.bind(this))();
        }
        else if(Array.isArray(_array) && Array.isArray(obj)){
            exe = _array.shift();

            if(typeof obj[0] !== 'string'){return console.error('The '+objName+' Array not contain one string');}

            obj[0] = obj[0].replace('|>',';return ');

            if (obj[0].includes('return')){
                this.temp[objName] = (new Function(_array.shift(),obj[0])).bind(this.share);
            } else {
                this.temp[objName] = (new Function(_array.shift(),'return ('+obj[0]+')')).bind(this.share);
            }

            (exe.bind(this))();
        }
        else if(Array.isArray(_object) && Object.prototype.toString.call(obj) == '[object Object]'){
            exe = _object.shift();
            (exe.bind(this))();
        }
        else{
            return console.error('typeof is not match');
        }
    }

    // ---

    this.temp.arg = arg.slice(0,arg.length - 1);
    this.Default = arg.slice(-1);

    for(i in this.temp.arg){
        if (i%2 == 0){ // even --- Case
            this.Case.push(this.temp.arg[i]);
        } else { // odd --- CaseExe
            this.CaseExe.push(this.temp.arg[i]);
        }
    }

    (Validate.bind(this,['Default',0],
        [function(){ // string
            this.temp.Default = (new Function('par','return `'+this.Default[0]+'`')).bind(this.share);
        }],''/* number */,
        [function(){ // function

        }],
        [function(){ // array

        },'par'],''/* object */))();

    for (this.i in this.Case){
        if(isBlock && this.exeDf){return this.res};

        (Validate.bind(this,['CaseExe',this.i],
            [function(){ // string
                this.temp.CaseExe = (new Function('par','return `'+this.CaseExe[this.i]+'`')).bind(this.share);
            }],''/* number */,
            [function(){ // function
                // this.temp.CaseExe = this.CaseExe[this.i];
            }],
            [function(){ // array

            },'par'],'' /* object */))();

        (Validate.bind(this,['Case',this.i],
            [function(){ // string
                // this.temp.Case = this.Case[this.i];
                this.validate = (toString(key) === this.Case[this.i]);
            }],
            [function(){ // number
                // this.temp.Case = this.Case[this.i];
                this.validate = (Number(key) === this.Case[this.i]);   
            }],
            [function(){ // function
                // this.temp.Case = this.Case[this.i];
                this.validate = !!(this.temp.Case(key));
            }],
            [function(){ // array
                this.validate = !!(this.temp.Case(key));
            },'key'],'' /* object */))();

        this.validate && this.res.push(this.temp.CaseExe(par)) && (this.exeDf = true);
        typeof this.temp.Default !== 'undefined' && (this.Default = this.temp.Default);
    }

    !(this.exeDf) && this.res.push(this.Default(par));
    return this.res
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

    tools.afterLoad = function afterLoad(actions=function(){}){
        window.addEventListener('load',actions)
    };

    tools.comparePath = function comparePath(path1, path2){
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