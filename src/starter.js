// Variables for creating nodes
var table=['<table>','</table>',1],
    td=['<table><tbody><tr>','</tr></tbody></table>',3],
    option=['<select>','</select>',1],
    noscope=['_','',0],
    tags={
        thead:table,
        tbody:table,
        tfoot:table,
        colgroup:table,
        caption:table,
        tr:['<table><tbody>','</tbody></table>',2],
        th:td,
        td:td,
        col:['<table><colgroup>','</colgroup></table>',2],
        fieldset:['<form>','</form>',1],
        legend:['<form><fieldset>','</fieldset></form>',2],
        option:option,
        optgroup:option,
        script:noscope,
        style:noscope,
        link:noscope,
        param:noscope,
        base:noscope
    };

/*
    Create a node from HTML code (based on Bonzo's method)

    Parameters
        String html

    Return
        Object
*/
$._creator=function(html){
    var tag=/^\s*<([^\s>]+)/.exec(html),
        el=document.createElement('div'),
        map=tag?tags[tag[1].toLowerCase()]:null,
        depth=map?map[2]+1:1;
    el.innerHTML=map?map[0]+html+map[1]:html;
    while(depth--){
        el=el.firstChild;
    }
    return el;
};

/*
    Return a css property, set a css property or set a list of properties

    Parameters
        String, Object name
        String, undefined value

    Return
        String, quark
*/
$._node.css=function(name,value){
    var setStyle=function(el,name,value){
            if(name=='opacity'){
                try{el.node.filters['DXImageTransform.Microsoft.Alpha'].opacity=value*100;}
                catch(e){
                    try{el.node.filters('alpha').opacity=value*100;}
                    catch(e){el.node.style.opacity=value;}
                }
            }
            else{
                el.node.style[name]=value;
            }
        },
        getStyle=function(el,name){
            if(name=='opacity'){
                try{return el.node.filters['DXImageTransform.Microsoft.Alpha'].opacity/100;}
                catch(e){
                    try{return el.node.filters('alpha').opacity/100;}
                    catch(e){return el.node.style.opacity;}
                }
            }
            return el.node.style[name];
        };
    if(typeof name=='string'){
        if(value===undefined){
            return getStyle(this,name);
        }
        else{
            setStyle(this,name,value);
            return this;
        }
    }
    else if(typeof name=='object'){
        for(var i in name){
            setStyle(this,i,name[i]);
        }
        return this;
    }
};

/*
    Return or set html content

    Parameters
        String html

    Return
        String, quark
*/
$._node.html=function(html){
    if(html===undefined){
        if(this.node.nodeName=='IFRAME'){
            return this.node.src.substr(29);
        }
        else{
            return this.node.innerHTML;
        }
    }
    else{
        if(this.node.nodeName=='IFRAME'){
            this.node.src='data:text/html;charset=utf-8,'+escape(html);
        }
        else{
            this.node.innerHTML=html;
        }
        return this;
    }
};

/*
    Return or set text content

    Parameters
        String text

    Return
        String, quark
*/
$._node.text=function(text){
    if(text===undefined){
        return this.node.innerText!==undefined?
               this.node.innerText:
               this.node.textContent.replace(/^\s*(.+?)\s*$/,'$1');
    }
    else{
        if(this.node.innerText!==undefined){
            this.node.innerText=text;
        }
        else{
            this.node.textContent=text;
        }
        return this;
    }
};

/*
    Return a an attribute or set one

    Parameters
        String name
        String value

    Return
        Array, String, quark
*/
$._node.attr=function(name,value){
    if(typeof name=='string'){
        if(value===undefined){
            return this.node.getAttribute(name);
        }
        else{
            this.node.setAttribute(name,value);
            return this;
        }
    }
    else if(typeof name=='object'){
        for(var i in name){
            this.node.setAttribute(i,name[i]);
        }
        return this;
    }
};

/*
    Return a list of data attributes, return one, set a list or one

    Parameters
        String, Object name
        String value

    Return
        Array, String, quark
*/
$._node.data=function(name,value){
    if(name===undefined){
        var values={}
            attributes=this.node.attributes;
        for(var i in attributes){
            if(i.test(/^data-/)){
                values[i.substring(5)]=attributes[i];
            }
        }
        return values;
    }
    else if(typeof name=='object'){
        for(var i in name){
            this.attr('data-'+i,name[i]);
        }
    }
    else if(value===undefined){
        return this.attr('data-'+name);
    }
    else{
        this.attr('data-'+name,value);
    }
    return this;
};

/*
    Return a value or set one

    Parameters
        String value

    Return
        Array, String, quark
*/
$._node.val=function(value){
    if(this.node.type=='checkbox'){
        if(value===undefined){
            return this.node.checked;
        }
        else{
            this.node.checked=value;
            return this;
        }
    }
    else{
        if(value===undefined){
            return this.node.value;
        }
        else{
            this.node.value=value;
            return this;
        }
    }
};

/*
    Append html contents

    Parameters
        Object, String node

    Return
        quark
*/
$._node.append=function(node){
    if(typeof node=='string'){
        node=$(node);
    }
    if(node.node!==undefined){
        node=node.node;
    }
    this.node.appendChild(node);
    return this;
};

/*
    Prepend html contents

    Parameters
        Object, String node

    Return
        quark
*/
$._node.prepend=function(node){
    if(typeof node=='string'){
        node=$(node);
    }
    if(node.node!==undefined){
        node=node.node;
    }
    this.node.insertBefore(node,this.children()[0].node);
    return this;
};

/*
    Add html contents before the current node

    Parameters
        Object, String node

    Return
        quark
*/
$._node.before=function(node){
    if(typeof node=='string'){
        node=$(node);
    }
    if(node.node!==undefined){
        node=node.node;
    }
    this.parent().node.insertBefore(node,this.node);
    return this;
};

/*
    Add html contents after the current node

    Parameters
        Object, String node

    Return
        quark
*/
$._node.after=function(node){
    return this.next().before(node);
};

/*
    Remove the current node

    Return
        quark
*/
$._node.remove=function(){
    this.parent().node.removeChild(this.node);
    return this;
};

/*
    Return node's parent

    Return
        Object
*/
$._node.parent=function(){
    return $(this.node.parentNode);
};

/*
    Return node's previous node

    Return
        Object
*/
$._node.previous=function(){
    return $(this.node.previousSibling);
};

/*
    Return node's next node

    Return
        Object
*/
$._node.next=function(){
    return $(this.node.nextSibling);
};

/*
    Return node's children

    Return
        Array
*/
$._node.children=function(){
    return $$(this.node.children);
};

/*
    Add a class to the current node

    Parameters
        string class

    Return
        quark
*/
$._node.addClass=function(clss){
    this.node.className+=' '+clss;
    return this;
};

/*
    Remove a class from the current node

    Parameters
        string class

    Return
        quark
*/
$._node.removeClass=function(clss){
    this.node.className=this.node.className.replace(new RegExp('\\b ?'+clss+'\\b'),'');
    return this;
};

/*
    Test if a class exists

    Parameters
        string class

    Return
        Boolean
*/
$._node.hasClass=function(clss){
    var re=new RegExp('\\b'+clss+'\\b');
    return re.test(this.node.className);
};

/*
    Return width

    Return
        Integer
*/
$._node.width=function(){
    return this.node.offsetWidth===undefined?
           this.node.innerWidth:
           this.node.offsetWidth;
};

/*
    Return height

    Return
        Integer
*/
$._node.height=function(){
    return this.node.offsetHeight===undefined?
           this.node.innerHeight:
           this.node.offsetHeight;
};

/*
    Return top offset

    Return
        Integer
*/
$._node.top=function(){
    return this.node.getBoundingClientRect().top+$('body').node.scrollTop;
};

/*
    Return left offset

    Return
        Integer
*/
$._node.left=function(){
    return this.node.getBoundingClientRect().left+$('body').node.scrollLeft;
};

/*
    Clone

    Return
        Node
*/
$._node.clone=function(){
    return $(this.node.cloneNode(true));
};
