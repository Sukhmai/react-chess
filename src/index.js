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
            turn: "White",
            hasKingMoved:[false, false],
            haveRooksMoved:[false, false, false, false],
        }
    }

    handleClick(k, j) {
        const clicked = this.state.clicked;
        if (this.state.clicked % 2 === 0) {
            this.setState({clickedLocation: [k,j]});
            this.setState({clicked: clicked + 1});
        } else {
            var row = this.state.clickedLocation[0];
            var col = this.state.clickedLocation[1];
            var piece = this.state.board[row][col];
            if(this.state.board[k][j] === piece) {
                this.setState({clicked: clicked + 1});
            } else if (this.isLegal(row, col, k, j, piece, this.state.board)) {
                this.movePiece(k, j, row, col, piece);
                this.setState({clicked: clicked + 1});
            }
        }

    }

    handleDrop(k, j, ev) {
        var row = Number(ev.dataTransfer.getData("row"));
        var col = Number(ev.dataTransfer.getData("col"));
        var piece = ev.dataTransfer.getData("id");
        if (this.isLegal(row, col, k, j, piece, this.state.board)) {
            this.movePiece(k, j, row, col, piece);
        }
    }

    movePiece(k, j, row, col, piece) {
        this.setState({turn: this.isBlackPiece(piece) ? "White" : "Black"});
        const board = this.state.board.slice();
        board[k][j] = piece;
        board[row][col] = Empty;
        this.setState({board: board});
    }

    isLegal(initRow, initCol, endRow, endCol, piece, board) {
        if(this.isBlackPiece(piece) !== (this.state.turn === "Black")) {
            return false;
        }
        if (piece === WhitePawn) {
            return this.checkWhitePawn(initRow, initCol, endRow, endCol, board);
        } else if (piece === BlackPawn) {
            return this.checkBlackPawn(initRow, initCol, endRow, endCol, board);
        } else if (piece === BlackBishop || piece === WhiteBishop) {
            return this.checkBishop(initRow, initCol, endRow, endCol, board, this.isBlackPiece(piece));
        } else if (piece === BlackKnight || piece === WhiteKnight) {
            return this.checkKnight(initRow, initCol, endRow, endCol, board, this.isBlackPiece(piece));
        } else if (piece === BlackQueen || piece === WhiteQueen) {
            return this.checkQueen(initRow, initCol, endRow, endCol, board, this.isBlackPiece(piece));
        } else if (piece === BlackRook || piece === WhiteRook) {
            return this.checkRook(initRow, initCol, endRow, endCol, board, this.isBlackPiece(piece));
        } else if (piece === BlackKing || piece === WhiteKing) {
            return this.checkKing(initRow, initCol, endRow, endCol, board, this.isBlackPiece(piece));
        }
    }

    checkWhitePawn(initRow, initCol, endRow, endCol, board) {
        if(initCol === endCol) {
            if(board[endRow][endCol] === Empty) {
                if (initRow === 6) {
                    if (endRow === 5 || endRow === 4) {
                        return true;
                    }
                } else {
                    if (endRow === initRow - 1) {
                        return true;
                    }
                }
            }
        } else if (endCol === initCol - 1 || endCol === initCol + 1) {
            if(endRow === initRow -1 && this.isBlackPiece(board[endRow][endCol])) {
                return true;
            }
        }
        return false;
    }

    checkBlackPawn(initRow, initCol, endRow, endCol, board) {
        if(initCol === endCol) {
            if(this.isEmpty(board[endRow][endCol])) {
                if (initRow === 1) {
                    if (endRow === 2 || endRow === 3) {
                        return true;
                    }
                } else {
                    if (endRow === initRow + 1) {
                        return true;
                    }
                }
            }
        } else if (endCol === initCol - 1 || endCol === initCol + 1) {
            if(endRow === initRow + 1 && !(this.isBlackPiece(board[endRow][endCol]))
                && !this.isEmpty(board[endRow][endCol])) {
                return true;
            }
        }
        return false;
    }

    checkBishop(initRow, initCol, endRow, endCol, board, color) {
        if(endRow > initRow) {
            if(endCol > initCol) {
                for(var i = 1; i <= 7 - Math.max(initRow, initCol); i++) {
                    if(initRow + i === endRow && initCol + i === endCol) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow + i][initCol + i]))) {
                        return false;
                    }
                }
            } else {
                for(var i = 1; i <= Math.min(7 - initRow, initCol); i++) {
                    if(initRow + i === endRow && initCol - i === endCol) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow + i][initCol - i]))) {
                        return false;
                    }
                }
            }
        } else {
            if(endCol > initCol) {
                for(var i = 1; i <= Math.min(initRow, 7 - initCol); i++) {
                    if(initRow - i === endRow && initCol + i === endCol) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow - i][initCol + i]))) {
                        return false;
                    }
                }
            } else {
                for(var i = 1; i <= Math.min(initRow, initCol); i++) {
                    if(initRow - i === endRow && initCol - i === endCol) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow - i][initCol - i]))) {
                        return false;
                    }
                }
                return false;
            }
        }
    }

    checkKnight(initRow, initCol, endRow, endCol, board, color) {
        if((endRow === initRow + 2 && endCol === initCol + 1)
            || (endRow === initRow + 2 && endCol === initCol - 1)
            || (endRow === initRow - 2 && endCol === initCol + 1)
            || (endRow === initRow - 2 && endCol === initCol - 1)
            || (endRow === initRow + 1 && endCol === initCol + 2)
            || (endRow === initRow + 1 && endCol === initCol - 2)
            || (endRow === initRow - 1 && endCol === initCol + 2)
            || (endRow === initRow - 1 && endCol === initCol - 2)) {
                var endPos = board[endRow][endCol];
                if(!(this.isEmpty(endPos))) {
                    if(color !== this.isBlackPiece(endPos)) {
                        return true;
                    }
                    return false;
                }
                return true;
            }
        return false;
    }

    checkRook(initRow, initCol, endRow, endCol, board, color) {

        if(endCol === initCol) {
            if(endRow > initRow) {
                for(var i = 1; i <= endRow - initRow; i++) {
                    // console.log(initRow+":"+initCol+":"+endRow+":"+endCol);
                    if (initRow + i === endRow) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow + i][initCol]))) {
                        return false;
                    }
                }
            } else {
                for(var i = 1; i <= initRow-endRow; i++) {
                    if (initRow - i === endRow) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow - i][initCol]))) {
                        return false;
                    }
                }
            }
        } else if (endRow === initRow) {
            if(endCol > initCol) {
                for(var i = 1; i <= endCol - initCol; i++) {
                    if (initCol + i === endCol) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow][initCol + i]))) {
                        return false;
                    }
                }
            } else {
                for(var i = 1; i <= initCol - endCol; i++) {
                    if (initCol - i === endCol) {
                        var endPos = board[endRow][endCol];
                        return this.isSameColor(endPos, color);
                    } else if (!(this.isEmpty(board[initRow][initCol - i]))) {
                        return false;
                    }
                }
            }
        }
        return false;
    }

    checkQueen(initRow, initCol, endRow, endCol, board, color) {
        if(this.checkRook(initRow, initCol, endRow, endCol, board, color)
            || this.checkBishop(initRow, initCol, endRow, endCol, board, color)) {
            return true;
        }
        return false;
    }

    checkKing(initRow, initCol, endRow, endCol, board, color) {
        if((endRow === initRow + 1 && endCol === initCol + 1)
            || (endRow === initRow + 1 && endCol === initCol)
            || (endRow === initRow + 1 && endCol === initCol - 1)
            || (endRow === initRow && endCol === initCol + 1)
            || (endRow === initRow && endCol === initCol - 1)
            || (endRow === initRow - 1 && endCol === initCol + 1)
            || (endRow === initRow - 1 && endCol === initCol)
            || (endRow === initRow - 1 && endCol === initCol - 1)) {
                var endPos = board[endRow][endCol];
                if(!(this.isEmpty(endPos))) {
                    if(color !== this.isBlackPiece(endPos)) {
                        this.setState({hasKingMoved: !color ? [true, this.state.hasKingMoved[1]] : [this.state.hasKingMoved[0], true]});
                        return true;
                    }
                    return false;
                }
                this.setState({hasKingMoved: !color ? [true, this.state.hasKingMoved[1]] : [this.state.hasKingMoved[0], true]});
                return true;
            } else if (endRow === initRow && endCol === initCol + 2
                && !(color ? this.state.hasKingMoved[1] : this.state.hasKingMoved[0])
                && this.isEmpty(board[initRow][initCol + 1]) && this.isEmpty(board[initRow][initCol + 2])
                && !(color ? this.state.haveRooksMoved[3]: this.state.haveRooksMoved[1])) {
                    this.setState({hasKingMoved: !color ? [true, this.state.hasKingMoved[1]] : [this.state.hasKingMoved[0], true]});
                    this.movePiece(endRow, endCol - 1, initRow, endCol + 1, color ? BlackRook : WhiteRook);
                    return true;
            } else if (endRow === initRow && endCol === initCol - 2
                && !(color ? this.state.hasKingMoved[1] : this.state.hasKingMoved[0])
                && this.isEmpty(board[initRow][initCol - 1]) && this.isEmpty(board[initRow][initCol - 2]) && this.isEmpty(board[initRow][initCol - 3])
                && !(color ? this.state.haveRooksMoved[2]: this.state.haveRooksMoved[0])) {
                    this.setState({hasKingMoved: !color ? [true, this.state.hasKingMoved[1]] : [this.state.hasKingMoved[0], true]});
                    this.movePiece(endRow, endCol + 1, initRow, endCol - 2, color ? BlackRook : WhiteRook);
                    return true;
                }
        return false;
    }

    isBlackPiece(piece) {
        if(piece === BlackKing
            || piece === BlackQueen
            || piece === BlackKnight
            || piece === BlackPawn
            || piece === BlackRook
            || piece === BlackBishop) {
                return true;
            }
        return false;
    }

    isEmpty(piece) {
        return piece === Empty;
    }

    isSameColor(endPos, color) {
        if(!(this.isEmpty(endPos))) {
            if(color !== this.isBlackPiece(endPos)) {
                return true;
            }
            return false;
        }
        return true;
    }

    render() {
        return (
            <div className = "fullBoard">
                <div className = "center">
                    {this.renderRow(0)}
                    {this.renderRow(1)}
                    {this.renderRow(2)}
                    {this.renderRow(3)}
                    {this.renderRow(4)}
                    {this.renderRow(5)}
                    {this.renderRow(6)}
                    {this.renderRow(7)}
                    <p className = "turn">
                        <br></br>
                        {this.state.turn + "'s Turn"}
                    </p>
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    render() {
        return(
            <Board />
        )
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
