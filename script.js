const table = {
	caption: document.querySelector("caption"),
	head: document.querySelector("thead"),
	body: document.querySelector("tbody"),
}

const buttonAdd = document.querySelector("#add");
let myLibrary = [];
if (localStorage.getItem("myLibrary")) {
	JSON.parse(localStorage.getItem("myLibrary")).forEach(o => {
		let book = new Book(...Object.values(o));
		myLibrary.push(book);
	});
}

buttonAdd.addEventListener("click", handleButtonAdd);
window.addEventListener("unload", e => localStorage.setItem("myLibrary", JSON.stringify(myLibrary)));

function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

Book.prototype.info = function() {
	return this.title + " by " + this.author + ", " +
		this.pages + " pages, " + (this.read ? "read" : "not read yet");
}

Book.prototype.toggle = function() {
	this.read = !this.read;
}

function render() {
	table.caption.textContent = `Your Library: ${myLibrary.length} book(s)`;
	if (myLibrary.length) {
		table.head.classList.remove("hidden");
	} else {
		table.head.classList.add("hidden");
	}

	while (table.body.firstChild) {
		table.body.removeChild(table.body.firstChild);
	}

	myLibrary.forEach((book, index) => {
		let tr = document.createElement("tr");

		// Data attribute
		tr.dataset.index = index;

		// Book info
		[
			"-",
			book.title,
			book.author,
			book.pages,
			book.read ? "v" : "x",
		].forEach((d, i) => {
			let td = document.createElement("td");
			if (i == 0 || i == 4) {
				let btn = document.createElement("button");
				btn.textContent = d;
				if (i == 4) {
					btn.classList.add("read");
					btn.addEventListener("click", handleButtonRead);
				} else {
					btn.classList.add("remove");
					btn.addEventListener("click", handleButtonRemove);
				}

				td.appendChild(btn);
			} else {
				td.textContent = d;
			}

			tr.appendChild(td);
		});

		table.body.appendChild(tr);
	});
}

function handleButtonRemove(e) {
	let index = +e.target.parentNode.parentNode.dataset.index;
	myLibrary.splice(index, 1);
	render();
}

function handleButtonRead(e) {
	let index = +e.target.parentNode.parentNode.dataset.index;
	myLibrary[index].toggle();
	render();
}

function handleButtonAdd(e) {
	const form = e.target.parentNode.firstChild.nextSibling;
	let title = form.querySelector("#title");
	let author = form.querySelector("#author")
	let pages = form.querySelector("#pages")
	let read = form.querySelector("#yes")
	if (form.classList.contains("hidden")) {
		title.value = "";
		author.value = "";
		pages.value = "";
		read.checked = true;
		form.classList.remove("hidden");
	} else {
		title = title.value.trim();
		author = author.value.trim();
		pages = +pages.value;
		read = read.checked;
		form.classList.add("hidden");
		if (!title || !author || !pages || pages <= 0) {
			return;
		}

		myLibrary.push(new Book(capitalize(title), capitalize(author), pages, read));
		render();
	}
}

function capitalize(text) {
	return text.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

render();

