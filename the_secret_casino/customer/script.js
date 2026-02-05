function changeText(){
    document.getElementById("mainText").innerText =
    "طبقه دوم کلاس 904";
}

function goAdmin(event){
    event.stopPropagation();
    window.location.href = "../admin/admin.html";
}

/* ساخت 8 شکل شناور */
for(let i=0;i<8;i++){

    let shape=document.createElement("div");
    shape.classList.add("shape");

    let size=Math.random()*60+40;

    shape.style.width=size+"px";
    shape.style.height=size+"px";

    shape.style.left=Math.random()*100+"vw";
    shape.style.animationDuration=(Math.random()*10+8)+"s";

    let types=["circle","square","diamond"];
    shape.classList.add(types[Math.floor(Math.random()*types.length)]);

    document.body.appendChild(shape);
}