import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {

    calculateColor() {
        var color = "#FFDEAD";
        if ((this.props.num + this.props.rank) % 2 === 0) {
            color = "#DEB887";
        }
        return color;
    }

    constructor(props) {
        super(props);
        this.state = {
            color: this.calculateColor(),
            value: this.props.value,
        }
    }

    render() {
        return (
            <button
                className = "square"
                style = {{backgroundColor: this.state.color}}
                onClick = {() => this.props.onClick()}
            >
            {this.props.value}
            </button>
        )
    }
}

class Row extends React.Component {

    renderSquare(i) {
        return (
            <Square
                num = {this.state.num}
                rank = {i}
                value = {this.state.value[i]}
                onClick = {() => this.props.onClick(this.state.num, i)}
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
            />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            board: [[0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0]]
        }
    }

    handleClick(k, j) {
        const board = this.state.board.slice();
        board[k][j] = 1;
        this.setState({board: board})
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
