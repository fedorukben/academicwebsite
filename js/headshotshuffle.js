var theImages = new Array()

theImages[0] = '../img/headshots/bass-fishing.png'
theImages[1] = '../img/headshots/first.jpg'
theImages[2] = '../img/headshots/beige-suit.png'
theImages[3] = '../img/headshots/pensive-table-plant.jpg'
theImages[4] = '../img/headshots/jaina.jpg'
theImages[5] = '../img/headshots/cumc23.png'
theImages[6] = '../img/headshots/carving.png'
theImages[7] = '../img/headshots/teaching-realanal.jpg'

var j = 0
var p = theImages.length;
var preBuffer = new Array()
for (i = 0; i < p; i++){
        preBuffer[i] = new Image()
    preBuffer[i].src = theImages[i]
}
var whichImage1 = Math.floor(Math.random()*p);
var whichImage2 = Math.floor(Math.random()*(p-1));
if(whichImage2==whichImage1) {whichImage2++};
if(whichImage2==p) {whichImage2=0};
function showImage1(){
    document.write('<img src="' + theImages[whichImage1] + '" alt="Benjamin D. Fedoruk" class="rounded-full mx-auto w-64 h-64 object-cover shadow-lg" />');
}