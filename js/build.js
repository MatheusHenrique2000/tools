
function build (_name='', obj={}, _access){

    function validateBuild(a){
        return (
            isObject(a)
            && isFunction(a.this)
            && (a.prop == result._name)
            && (a.value == '@section')
            && typeof a.this._name !== 'undefined'
            // a.section === access.this
        )
    }

    function isObject(a){
        return (typeof a !== 'undefined' ? Object.prototype.toString.call(a) == '[object Object]': false)
    };

    function isFunction(a){
        return (typeof a !== 'undefined' ? Object.prototype.toString.call(a) == '[object Function]': false)
    };

    function run(){
        var runSetGet;
        var prop = access.prop;
        var value = access.value;

        var standard = access.standard = {
            set: true,
            get: true,
        };

        access.oneProp ?
            runSetGet = access.runSetGet = !!(access.valueArry.length):
            runSetGet = access.runSetGet = (prop[0] == '=');

        propFn[prop] !== undefined && propFn[prop]();
        valueFn[value] !== undefined && valueFn[value]();

        runSetGet ?
            standard.set && setPart() :
            standard.get && getPart();
    };

    function oneValueExecution(){
        access.oneProp = true;

        access.prop = access.propArry[0];
        access.value = access.valueArry[0];

        run();
    };

    function moreOneValueExecution(){
        access.oneProp = false;

        access.propArry.forEach((el,id,ar)=>{
            access.prop = el;
            access.value = access.valueArry[access.valueId];
            
            run();
        });
    };

    function setPart(){
        var prop = access.prop;
        var value = access.value;

        !(access.oneProp) && (prop = access.prop = access.prop.slice(1));

        access.valueId++;
        access.this.set(prop,value);
    };

    function getPart(){
        var prop = access.prop;
        var result = access.result = access.this.get(prop);

        validateBuild(result) && (access.this = result);
    };

    var access = {};
    var result = function(propArry,...valueArry){
        access.this = result;
        access.propArry = propArry.split(/ *\/ */g);
        access.valueArry = valueArry;
        access.valueId = 0;

        access.propArry.length == 1 ?
            oneValueExecution() :
            moreOneValueExecution();

        return access.result;
    };

    var propFn = {
        '@log':()=>{
            console.log(access.this.log());
            access.standard.get = false;
        },
        '@back':()=>{
            access.result = access.this = access.this.section;
            access.standard.get = false;
        },
        '@matrix':()=>{
            var oneValueArm = access.oneProp;

            access.value.forEach((el,id,ar)=>{
                var prop = access.prop = el[0];
                var value = access.value = el[1];

                access.oneProp = true;
                access.runSetGet = true;

                valueFn[value] !== undefined ?
                    valueFn[value]() :
                    access.this.set(prop,value);
            })

            access.oneProp = oneValueArm

            access.standard.get = false;
        }
    };
    var valueFn = {
        '@section':()=>{
            if(access.runSetGet){
                var prop = access.prop;
            
                !(access.oneProp) 
                    && (prop = access.prop = access.prop.slice(1))
                    && access.valueId++;

                access.this.set(prop, build(prop,{},access));
                access.standard.set = false;
            };
        }
    };
    
    result._name = _name;
    result.set = (prop, value)=>{
        if(obj['@set'] === false)
            {return console.error(`Variables cannot be defined`)};

        if((isObject(obj['@set']) ? obj['@set'][prop] === false : false))
            {return console.error(`This variable '${prop}' cannot be modify your value to '${value}'`)};

        obj[prop] = value;
    };
    result.get = (prop)=>obj[prop];
    result.log = ()=>{
        if(obj['@log'] === false)
            {return console.error('Not have permission to access this Object')};

        return obj;
    };

    validateBuild(_access) && (result.section = _access.this);

    return Object.freeze(result);
};

typeof module !== 'undefined' && (module.exports = build);
typeof window !== 'undefined' && (window.build = build);