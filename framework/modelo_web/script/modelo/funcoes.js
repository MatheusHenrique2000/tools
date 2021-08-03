export default class Funcoes{
    constructor(){}

    cl(cl1){
        return console.log(cl1);
    };

    dom(c){
        let r = document;
        let s = [
            function(i){r = r.getElementsByTagName(c[i+1])},
            function(i){r = r.getElementById(c[i+1])},
            function(i){r = r.getElementsByClassName(c[i+1])},
            function(i){r = r[c[i+1]]},
            function(i){r.remove()},
            function(i){
                let ins = document.createElement(c[i+1]);
                let cr = r.parentNode;
                r = cr.insertBefore(ins, r.nextSibling);
                //inserir depois
            },
            function(i){
                let ins = document.createElement(c[i+1]);
                let cr = r.parentNode;
                r = cr.insertBefore(ins, r);
                //inserir antes
            },
            function(i){
                let ins = document.createElement(c[i+1]);
                r = r.appendChild(ins);
            }
        ];

        c.match(/^[A-Za-z\u005f\u002d]/g) ? c = '@0@'+c :''; // tagname no inicio
        c = c.replaceAll(']','');

        c =  c.replaceAll('#','@1@'); // id
        c =  c.replaceAll('.','@2@'); // class
        c =  c.replaceAll('[','@3@'); // lista
        c = c.replaceAll('=-','@4@'); // remover
        c = c.replaceAll('>+','@5@'); // inserir depois
        c = c.replaceAll('<+','@6@'); // inserir antes
        c = c.replaceAll('=+','@7@'); // inserir dentro
        
        c = c.replaceAll(/ +(@1@)| +(@2@)| +(@3@)| +(@4@)| +(@5@)| +(@6@)| +(@7@)/g,'$1$2$3$4$5$6$7');

        c = c.replaceAll(/ +/g,'@0@'); //tagname
        c = c.split('@'); c.shift();

        for (let i = 0; i < c.length; i = i+2) {
            s[c[i]](i);
        };
        return r;
    };   
};