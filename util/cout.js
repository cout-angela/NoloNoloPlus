function cout(str){
    console.log(str);
}
function coutnl(str){
    console.log(str + '\n');
}
function nlcout(str){
    console.log('\n' + str);
}
function nlcoutnl(str){
    console.log('\n' + str + '\n');
}

const acab = {
    cout: cout,
    ln: coutnl,
    nl: nlcout,
    nlln: nlcoutnl
}

module.exports = acab;