import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BlackKing from './images/BlackKing.png';
import BlackBishop from './images/BlackBishop.png';
import WhiteKing from './images/WhiteKing.png';
import WhiteBishop from './images/WhiteBishop.png';
import BlackPawn from './images/BlackPawn.png';
import BlackQueen from './images/BlackQueen.png';
import BlackKnight from './images/BlackKnight.png';
import WhitePawn from './images/WhitePawn.png';
import WhiteQueen from './images/WhiteQueen.png';
import WhiteKnight from './images/WhiteKnight.png';
import BlackRook from './images/BlackRook.png';
import WhiteRook from './images/WhiteRook.png';
import Empty from './images/Empty.png';

class Square extends React.Component {

    calculateColor() {
        var color = "#FFDEAD";
        if ((this.props.row + this.props.col) % 2 === 0) {
            color = "#DEB887";
        }
        return color;
    }

    onDragOver(ev) {
        ev.preventDefault();
    }

    onDragStart(ev, id) {
        ev.dataTransfer.setData("id", id);
        ev.dataTransfer.setData("row", this.props.row);
        ev.dataTransfer.setData("col", this.props.col);
    }

    constructor(props) {
        super(props);
        this.state = {
            color: this.calculateColor(),

        }
    }

    render() {
        return (
            <button
                className = "square"
                style = {{backgroundColor: this.state.color}}
                onClick = {() => this.props.onClick()}
                onDragOver = {(ev) => this.onDragOver(ev)}
                onDrop = {(ev) => this.props.onDrop(ev)}
            >
            <img
                draggable = "true"
                onDragStart = {(ev) => this.onDragStart(ev, this.props.value)}
                src = {this.props.value}
                alt = "Chess piece"
            >
            </img>
            </button>
        )
    }
}

class Row extends React.Component {

    renderSquare(i) {
        return (
            <Square
                row = {this.state.num}
                col = {i}
                value = {this.state.value[i]}
                onClick = {() => this.props.onClick(this.state.num, i)}
                onDrop = {(ev) => this.props.onDrop(this.state.num, i, ev)}
            />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            num: this.props.num,
            value: this.props.value,
        }
    }

    render() {
        return (
            <div className = "row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
            </div>
        )
    }
}

class Board extends React.Component {

    renderRow(i) {
        return (
            <Row
                num = {i}
                value = {this.state.board[i]}
                onClick = {(k, j) => this.handleClick(k, j)}
                onDrop = {(k, j, ev) => this.handleDrop(k, j, ev)}
            />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            board: [[BlackRook, BlackKnight, BlackBishop, BlackQueen,
                BlackKing, BlackBishop, BlackKnight, BlackRook],
                    [BlackPawn, BlackPawn, BlackPawn, BlackPawn,
                        BlackPawn, BlackPawn, BlackPawn, BlackPawn],
                    [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty],
                    [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty],
                    [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty],
                    [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty],
                    [WhitePawn, WhitePawn, WhitePawn, WhitePawn,
                        WhitePawn, WhitePawn, WhitePawn, WhitePawn],
                    [WhiteRook, WhiteKnight, WhiteBishop, WhiteQueen,
                        WhiteKing, WhiteBishop, WhiteKnight, WhiteRook]],
            clicked: 0,
            clickedLocation: [0,0],
        }
    }

    handleClick(k, j) {
        const board = this.state.board.slice();
        const clicked = this.state.clicked;
        if (this.state.clicked % 2 === 0) {
            this.setState({clickedLocation: [k,j]});
        } else {
            console.log(this.state.clicked);
            var row = this.state.clickedLocation[0];
            var col = this.state.clickedLocation[1];
            board[k][j] = this.state.board[row][col];
            board[row][col] = Empty;
            this.setState({board: board});
        }
        this.setState({clicked: clicked + 1});
    }

    handleDrop(k, j, ev) {
        const board = this.state.board.slice();
        board[k][j] = ev.dataTransfer.getData("id");
        var row = ev.dataTransfer.getData("row");
        var col = ev.dataTransfer.getData("col");
        board[row][col] = Empty;
        this.setState({board: board});
    }

    isLegal(initRow, initCol, endRow, endCol, piece) {
        if (piece === WhitePawn) {return this.checkWhitePawn();}
        else if (piece === BlackPawn) {return this.checkBlackPawn();}
        else if (piece === BlackBishop || piece === WhiteBishop) {return this.checkBishop();}
        else if (piece === BlackKnight || piece === WhiteKnight) {return this.checkKnight();}
        else if (piece === BlackQueen || piece === WhiteQueen) {return this.checkQueen();}
        else if (piece === BlackRook || piece === WhiteRook) {return this.checkRook();}
        else if (piece === BlackKing || piece === WhiteKing) {return this.checkKing();}
    }

    checkWhitePawn() {
        
    }

    render() {
        return (
            <div className = "fullBoard">
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
                {this.renderRow(3)}
                {this.renderRow(4)}
                {this.renderRow(5)}
                {this.renderRow(6)}
                {this.renderRow(7)}
            </div>
        )
    }
}

class Game extends React.Component {
    render() {
        return(
            <div className="center">
                <Board />
            </div>
        )
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
