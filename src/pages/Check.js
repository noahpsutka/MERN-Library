import './App.css';
import ListAvail from './ListAvail';
import ListUnAvail from './ListUnAvail';

function Check() {
    return (
        <div className="Check">
            <div id='list-all-books'><ListAvail /></div>
            <div id='list-all-books'><ListUnAvail /></div>
        </div>
    );
}

export default Check;