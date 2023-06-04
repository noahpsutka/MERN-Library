import React from 'react'
// type rfc for creating react component ^
import { useEffect } from 'react'
import { Check } from './Check';


const URL = "http://localhost:5000/books/"
export default function ListUnAvail() {
    function getUnAvailBooks() {
        fetch(URL)
            .then((response) => response.text())
            .then((data) => {
                document.getElementById('unAvailBooks').innerHTML = ""; // Clear out any prior data in inner-html
                //console.clear(); // Clear out console logs
                const text = document.createElement('p');
                text.innerHTML = "<strong><u>Every Unavailable Book in Library</u></strong>"
                document.getElementById('unAvailBooks').appendChild(text);
                const books = JSON.parse(data)
                const list = document.createElement('ul');
                for (var i = 0; i < books.length; i++) {
                    if (books[i].avail === false) {
                        const element = document.createElement('li');
                        const checkout = document.createElement('button');
                        checkout.innerHTML = "Check in Book"
                        checkout.setAttribute("id", i + 1)
                        checkout.onclick = function () { updateBook(this.id, true); console.log(books[this.id - 1]); }

                        element.innerHTML = "ID: " + books[i].id + " Title: " + books[i].title;
                        element.appendChild(checkout);
                        list.appendChild(element);
                    }
                }
                document.getElementById('unAvailBooks').appendChild(list);
            });
    }
    function getAvailBooks() {
        fetch(URL)
            .then((response) => response.text())
            .then((data) => {
                document.getElementById('AvailBooks').innerHTML = ""; // Clear out any prior data in inner-html
                const text = document.createElement('p');
                text.innerHTML = "<strong><u>Every Available Book in Library</u></strong>"
                document.getElementById('AvailBooks').appendChild(text);
                const books = JSON.parse(data)
                const list = document.createElement('ul');
                for (var i = 0; i < books.length; i++) {
                    if (books[i].avail === true) {
                        const element = document.createElement('li');
                        const checkout = document.createElement('button');
                        checkout.innerHTML = "Checkout Book"
                        checkout.setAttribute("id", i + 1)
                        checkout.onclick = function () { updateBook(this.id, false); console.log(books[this.id - 1]); }

                        element.innerHTML = "ID: " + books[i].id + " Title: " + books[i].title;
                        element.appendChild(checkout);
                        list.appendChild(element);
                    }
                }
                document.getElementById('AvailBooks').appendChild(list);
            });
    }
    async function updateBook(id, avail) {
        await fetch(URL + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ avail: avail }),
        })
            .then((response) => {
                console.log(response.text());
            })
            .then(() => {
                getUnAvailBooks();
                getAvailBooks();
            })
    }

    useEffect(() => {
        getUnAvailBooks();
    }, [])
    return (
        <div id='unAvailBooks'>ListUnAvail</div>
    )
}

