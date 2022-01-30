function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}

});

// Скрипт таймера

let defaulValue = 60 * 60

class Timer {
	constructor(state) {
		this.state = state;

		this.action = "Stopped";
		this.timerBlock = document.querySelector('.timer__counts');
		this.timerButton = document.querySelector('.timer__begin');
		this.timerSkip = document.querySelector('.timer__skip');
		this.workingButton = document.querySelector('.timer .navbar li:first-child');
		this.restButton = document.querySelector('.timer .navbar li:last-child');
		this.setWork = document.getElementById('working');
		(localStorage.getItem('workTime')) ? this.setWork.value = localStorage.getItem('workTime') : this.setWork.value = 60
		this.setRest = document.getElementById('rest');
		(localStorage.getItem('restTime')) ? this.setRest.value = localStorage.getItem('restTime') : this.setRest.value = 5
		this.firstCheck = true;
		this.time = this.setWork.value * 60
	}
}



class MainTimer extends Timer {
	constructor() {
		super("Working");
		(localStorage.getItem('pomoCounter')) ? this.counter = localStorage.getItem('pomoCounter') : this.counter = 0
	}

	sign() {
		return this.state
	}
}

class RestTimer extends Timer {
	constructor() {
		super("Rest")
	}

	sign() {
		return this.state
	}
}


class TrafficTimers {
	constructor() {
		this.states = [
			new MainTimer(),
			new RestTimer(),
		]
		document.querySelector('.main').classList.add("working")
		this.current = this.states[0]
	}

	change() {

		const total = this.states.length
		let index = this.states.findIndex(timer => timer === this.current)

		if (index + 1 < total) {
			this.current = this.states[index + 1]
		} else {
			this.current = this.states[0]
		}

		if (this.current.state === "Working") {
			document.querySelector('.main').classList.remove("rest")
			document.querySelector('.main').classList.add("working")
			timerUpdate()
		} else if (this.current.state === "Rest") {
			document.querySelector('.main').classList.remove("working")
			document.querySelector('.main').classList.add("rest")
			timerUpdate()
		}
	}

	sign() {
		return this.current.sign()
	}
}

function timerUpdate() {
	if (traffic.current.state == "Working") {
		traffic.current.time = traffic.current.setWork.value * 60
	} else {
		traffic.current.time = traffic.current.setRest.value * 60
	}
	traffic.current.timerSkip.style.opacity = 0
	traffic.current.timerButton.classList.remove("active")
	traffic.current.timerButton.innerHTML = "Start"
	traffic.current.action = "Stopped"
	let minutes = Math.trunc(traffic.current.time / 60);
	let seconds = Math.trunc(traffic.current.time % 60);
	(minutes < 10) ? minutes = `0${minutes}` : minutes = minutes;
	(seconds < 10) ? seconds = `0${seconds}` : seconds = seconds;
	traffic.current.timerBlock.innerHTML = `${minutes}:${seconds}`
}


const traffic = new TrafficTimers()

let timer;

function timeCounting() {
	if (traffic.current.time > 0) {
		let minutes = Math.trunc(traffic.current.time / 60);
		let seconds = Math.trunc(traffic.current.time % 60);
		(minutes < 10) ? minutes = `0${minutes}` : minutes = minutes;
		(seconds < 10) ? seconds = `0${seconds}` : seconds = seconds;
		traffic.current.timerBlock.innerHTML = `${minutes}:${seconds}`
		traffic.current.time--;

	} else {
		traffic.current.timerBlock.innerHTML = `00:00`
		traffic.current.action = "Stopped"
		traffic.current.timerButton.classList.remove("active")
		traffic.current.timerButton.innerHTML = "Start"
		if (traffic.current.state === "Working") {
			traffic.current.counter++
			localStorage.setItem('pomoCounter', traffic.current.counter)
		}
		(localStorage.getItem("todayGoals")) ? document.getElementById('processing_goals').innerHTML = `${traffic.current.counter}/${localStorage.getItem("todayGoals")}` : document.getElementById('processing_goals').innerHTML = `${traffic.current.counter}/${this.value}`
		traffic.current.timerSkip.style.opacity = 0
		traffic.change()
		clearInterval(timer)

	}
}
function timerWorking(time) {
	clearInterval(setInterval)
	if (traffic.current.firstCheck) {
		timeCounting()
		traffic.current.firstCheck = false
	}
	timer = setInterval(timeCounting, 1000)
}

traffic.current.timerButton.addEventListener("click", () => {
	if (traffic.current.action === "Stopped") {
		traffic.current.action = "Playing"
		traffic.current.timerButton.classList.add("active")
		traffic.current.timerButton.innerHTML = "Stop"
		traffic.current.timerSkip.style.opacity = "1"
		timerWorking(traffic.current.time)
	} else {
		traffic.current.timerButton.classList.remove("active")
		traffic.current.timerButton.innerHTML = "Start"
		traffic.current.action = "Stopped"
		traffic.current.timerSkip.style.opacity = "0"
		clearInterval(timer)
	}
})

traffic.current.timerSkip.addEventListener("click", () => {
	traffic.current.time = 0
	traffic.current.timerBlock.innerHTML = `00:00`
	traffic.current.timerButton.classList.remove("active")
	traffic.current.timerButton.innerHTML = "Start"
	traffic.current.action = "Stopped"
	traffic.current.timerSkip.style.opacity = "0"
	traffic.change()
	clearInterval(timer)
})

traffic.current.workingButton.addEventListener("click", () => {
	if (traffic.current.state === "Rest") {
		traffic.change()
		clearInterval(timer)
	}
})

traffic.current.restButton.addEventListener("click", () => {
	if (traffic.current.state === "Working") {
		traffic.change()
		clearInterval(timer)
	}
})

function clickSound() {
	let audio = new Audio()
	audio.src = "../other/pressbtn.mp3"
	audio.volume = 0.1
	audio.autoplay = true
}


// sidebar active
const settingsButton = document.querySelector('.settings')
settingsButton.addEventListener('click', () => {
	if (document.querySelector('.sidebar').classList.contains("active")) {
		settingsButton.classList.remove("active")
		document.querySelector('.sidebar').classList.remove("active")
		document.querySelector('.main__content').classList.remove("active")
	} else {
		settingsButton.classList.add("active")
		document.querySelector('.sidebar').classList.add("active")
		document.querySelector('.main__content').classList.add("active")
	}
})


//pomodoro total goal


const setRoundsInput = document.createElement('input')
setRoundsInput.placeholder = "Enter today goals (then press enter)"
document.querySelector('.working__title form').appendChild(setRoundsInput)

document.querySelector('.working__title input').addEventListener('keydown', function (e) {
	// код энтера 13
	if (e.keyCode === 13) {
		if ((this.value > 100 || this.value < 0) && this.value && !isNaN(this.value)) {
			alert(`Don't play with this :)`)
		} else if (isNaN(this.value) && this.value) {
			alert("Enter number please :)")
		} else if (!isNaN(this.value) && this.value) {
			if (!localStorage.getItem("todayGoals")) {
				document.querySelector('.working__title form').insertAdjacentHTML('afterbegin', `
					<h1>Today goal is <span id="goal"></span> rounds</h1>
				`)
			}
			localStorage.setItem("countingForUpdate", +new Date())
			localStorage.setItem("todayGoals", this.value);
			(localStorage.getItem("todayGoals")) ? document.getElementById('goal').innerHTML = localStorage.getItem("todayGoals") : document.getElementById('goal').innerHTML = this.value;
			(localStorage.getItem("todayGoals")) ? document.getElementById('processing_goals').innerHTML = `${traffic.current.counter}/${localStorage.getItem("todayGoals")}` : document.getElementById('processing_goals').innerHTML = `${traffic.current.counter}/${this.value}`
			document.querySelector('.working__title form').removeChild(setRoundsInput)
		}
	}
});


//set Time 

const preloader = document.createElement('div')
preloader.classList.add('preloader')
preloader.insertAdjacentHTML('afterbegin', `
<div class="reloader__wrap">
			<ul class="uw">
				<li class="dot" style='--i:0'></li>
				<li class="dot" style='--i:1'></li>
				<li class="dot" style='--i:2'></li>
				<li class="dot" style='--i:3'></li>
				<li class="dot" style='--i:4'></li>
				<li class="dot" style='--i:5'></li>
				<li class="dot" style='--i:6'></li>
				<li class="dot" style='--i:7'></li>
				<li class="dot" style='--i:8'></li>
				<li class="dot" style='--i:9'></li>
			</ul>
			<p>Loading...</p>
			<ul class="dw">
				<li class="dot" style='--i:0;'></li>
				<li class="dot" style='--i:1;'></li>
				<li class="dot" style='--i:2;'></li>
				<li class="dot" style='--i:3;'></li>
				<li class="dot" style='--i:4;'></li>
				<li class="dot" style='--i:5;'></li>
				<li class="dot" style='--i:6;'></li>
				<li class="dot" style='--i:7;'></li>
				<li class="dot" style='--i:8;'></li>
				<li class="dot" style='--i:9;'></li>
			</ul>
		</div>
`)
document.body.appendChild(preloader)
window.onload = function () {
	if ((Math.abs(localStorage.getItem("countingForUpdate") - +new Date()) >= 24 * 60 * 60 * 1000) && localStorage.getItem("countingForUpdate")) {
		localStorage.clear()
	}
	let minutes = Math.trunc(traffic.current.time / 60);
	let seconds = Math.trunc(traffic.current.time % 60);
	(minutes < 10) ? minutes = `0${minutes}` : minutes = minutes;
	(seconds < 10) ? seconds = `0${seconds}` : seconds = seconds;
	traffic.current.timerBlock.innerHTML = `${minutes}:${seconds}`
	document.body.classList.add('loaded');
	if (localStorage.getItem("todayGoals")) {
		(localStorage.getItem("todayGoals")) ? document.getElementById('processing_goals').innerHTML = `${traffic.current.counter}/${localStorage.getItem("todayGoals")}` : 0
		document.querySelector('.working__title form').insertAdjacentHTML('afterbegin', `
			<h1>Today goal is ${localStorage.getItem("todayGoals")} rounds</h1>
		`)
	}

	(localStorage.getItem("todayGoals")) ? document.querySelector('.working__title form').removeChild(setRoundsInput) : {}
	setTimeout(() => {
		document.body.removeChild(preloader)
	}, 300)
}

const setTime = document.getElementById('setTime')
setTime.addEventListener('click', (e) => {
	e.preventDefault
	let minutes = Math.trunc(traffic.current.time / 60);
	let seconds = Math.trunc(traffic.current.time % 60);
	(minutes < 10) ? minutes = `0${minutes}` : minutes = minutes;
	(seconds < 10) ? seconds = `0${seconds}` : seconds = seconds;
	traffic.current.timerBlock.innerHTML = `${minutes}:${seconds}`
	localStorage.setItem("workTime", traffic.current.setWork.value)
	localStorage.setItem("restTime", traffic.current.setRest.value)
	timerUpdate()
})

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
//Random playlist 
const albumUrl = "https://music.yandex.ru/iframe/#album/"
const albumLinks = [12426654, 18169824, 6224982, 11608942, 17766152, 14425333, 9192348, 12361656, 13876833, 7218253, 17186859, 18614910, 17486864, 7935545, 13856214, 16964287, 12203004, 6224984, 8302747, 12157712, 12166071, 13641507, 12435058, 17983295, 13154475, 13737387, 15692108, 14038332, 18068574, 14846571, 16765095, 14750452, 12435952, 12162050, 8882314, 12435904, 12936055, 17102257, 13790757, 17234236, 15997535, 19030167, 17213096, 12435941, 18586094, 7453048, 12279058, 13980750, 12573478, 9626766, 6224981, 17160159, 12435144, 9436967, 12977239, 14638120, 17213468, 17611485, 17215762, 14803072, 14086364, 19679687, 17985216, 18342929, 19242147, 19557426, 19788319, 15800719, 12537416, 18393026, 17374993, 18130665, 15613108]
document.querySelector('.sidebar__music iframe').src = albumUrl + albumLinks[getRandomInt(albumLinks.length)]