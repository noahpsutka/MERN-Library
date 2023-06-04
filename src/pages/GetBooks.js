import React from 'react'
// type rfc for creating react component ^
import { useEffect } from 'react'

const URL = "http://localhost:5000/books";
export default function GetBooks() {
    function getAllBooks() {
        // fetch(URL = url + "/books")
        fetch(URL)
            .then((response) => response.text())
            .then((data) => {
                document.getElementById('allbooks').innerHTML = ""; // Clear out any prior data in inner-html
                const text = document.createElement('p');
                text.innerHTML = "<strong><u>Every Book in Library</u></strong>"
                document.getElementById('allbooks').appendChild(text);
                const books = JSON.parse(data)
                const list = document.createElement('ul');
                for (var i = 0; i < books.length; i++) {
                    const element = document.createElement('li');
                    element.innerHTML = "ID: " + books[i].id + " Title: " + books[i].title;
                    list.appendChild(element);
                }
                document.getElementById('allbooks').appendChild(list);
            });
    }

    useEffect(() => {
        getAllBooks();
    }, [])
    return (
        <div id='allbooks'>GetBooks</div>
    )
}
