function handle(stuff){
    if(!stuff.command){
        console.log(stuff);
        return 'err';
    }
    switch (stuff.command){
        case 'redirect':
            window.location.href = stuff.msg;
            return null;
            break;
        case 'displayErr':
            console.log('in displayErr in handle')
            return stuff;
            break;
        case 'logErr':
            console.log(stuff.msg);
            return null;
        case 'noCommand':
            return stuff.msg;
            break;
        default:
            console.log(stuff);
            return null;
            break;
    }
}