const cards=["ace.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","Q.png","J.png","K.png"];
let blackJackGame={
    'you':{'playerScoreDiv':'#player-score','playerDiv':'#p','playerScore':0},
    'dealer':{'playerScoreDiv':'#dealer-score','playerDiv':'#b','playerScore':0},
    'draws':0,
    'losses':0,
    'wins':0,
    'isStand':false,
    'turnsOver':false
}
const YOU=blackJackGame['you'];
const DEALER=blackJackGame['dealer'];
var draw=new Audio("draw-card.mp3");
var winSound=new Audio("cash.mp3");
var losingSound=new Audio("aww.mp3");
document.querySelector("#black-jack-hit-button").addEventListener('click',hit);
document.querySelector("#black-jack-stand-button").addEventListener('click',stand);
document.querySelector("#black-jack-deal-button").addEventListener('click',deal);

function scoreUpdate(rand)
{
    if(rand===1)
    {
        if ((YOU['playerScore']+11)<=21)
        return 11
        else 
        return 1
    }
    else if ((rand>=2)&&(rand<10))
    return rand
    else
    return 10
}
function addCards(activePlayer,card)
{
    if(activePlayer['playerScore']<=21)
    {
        draw.play();
        document.querySelector(activePlayer['playerDiv']).appendChild(card);
    }
}
function showScore(activePlayer)
{
    var score=activePlayer['playerScore']
    if (score<=21)
    {
        document.querySelector(activePlayer['playerScoreDiv']).innerHTML=score;
    }
    else
    {
        let msg="OVER 21!";
        msg=msg.fontcolor("red");
        document.querySelector(activePlayer['playerScoreDiv']).innerHTML=msg;
    }
}
function getCard(j){
    let cardImg=document.createElement("img");
    cardImg.src=cards[j-1];
    cardImg.width=100;
    cardImg.height=130;
    return cardImg;
}
function hit()
{
    if(blackJackGame['isStand']===false)
    {
        var i=Math.floor((Math.random()*13)+1);
        YOU['playerScore']+=scoreUpdate(i);
        var card=getCard(i);
        addCards(YOU,card);
        showScore(YOU);
    }
}
function sleep(ms)
{return new Promise(resolve=>setTimeout(resolve,ms));}
async function stand()
{
    blackJackGame['isStand']=true;
    while(DEALER['playerScore']<18&&blackJackGame['isStand']===true)
    {
        var i=Math.floor((Math.random()*13)+1);
        DEALER['playerScore']+=scoreUpdate(i);
        var card=getCard(i);
        addCards(DEALER,card);
        showScore(DEALER);
        await sleep(1000);
    }
    blackJackGame['turnsOver']=true;
    showResults(computeWinner());
}
function computeWinner()
{
    var winner;
    if ((YOU['playerScore']===DEALER['playerScore'])||(YOU['playerScore']>21 && DEALER['playerScore']>21))
    blackJackGame['draws']++;
    else if(YOU['playerScore']<=21)
    {
        if (DEALER['playerScore']<=21)
        {
            if (DEALER['playerScore']>YOU['playerScore'])
            {
                blackJackGame['losses']++;
                winner=DEALER;
            }
            else
            {
                blackJackGame['wins']++;
                winner=YOU;
            }
        }
        else
        {
            blackJackGame['wins']++;
            winner=YOU;
        }
    }
    else
    {
        blackJackGame['losses']++;
        winner=DEALER;
    }
    return winner;
}
function showResults(winner)
{
    if (blackJackGame['turnsOver']===true)
    {
        var msg;
        var msgColor;
    if(winner==YOU)
    {
        msg="You Won !";
        msgColor="green";
        document.querySelector("#wins").textContent=blackJackGame['wins'];
        winSound.play();
    }
    else if(winner==DEALER)
    {
        msg="You Lost !";
        msgColor="red";
        document.querySelector("#losses").textContent=blackJackGame['losses'];
        losingSound.play();
    }
    else
    {
        msg="You Drew !";
        msgColor="black";
        document.querySelector("#draws").textContent=blackJackGame['draws'];
    }
    document.querySelector('#BlackJack-msg').textContent=msg;
    document.querySelector('#BlackJack-msg').style.color=msgColor;
    }
}
function deal()
{
    if(blackJackGame['turnsOver']===true)
    {
        var playerImgs=document.querySelector(YOU["playerDiv"]).querySelectorAll("img");
        var dealerImgs=document.querySelector(DEALER["playerDiv"]).querySelectorAll("img");
        for(let i=0;i<playerImgs.length;i++)
        {
            playerImgs[i].remove();
        }
        for(let i=0;i<dealerImgs.length;i++)
        {
            dealerImgs[i].remove();
        }
        YOU['playerScore']=0;
        DEALER['playerScore']=0;
        document.querySelector(YOU['playerScoreDiv']).innerHTML=0;
        document.querySelector(DEALER['playerScoreDiv']).innerHTML=0;
        document.querySelector("#BlackJack-msg").textContent="LET'S PLAY";
        document.querySelector("#BlackJack-msg").style.color="black";
        blackJackGame['turnsOver']=false;
        blackJackGame['isStand']=false;
    }
}
    