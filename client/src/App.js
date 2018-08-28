import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: [],
      deck: [],
      dealt_cards: [],
      hitCount: 0,
      dealerShows: [],
      dealerHidden: [],
      dealerScore: 0
    };
  }

  async componentDidMount() {
    const deck = await axios.get("http://localhost:5000/");
    this.setState({
      initial: deck.data
    });
  }

  generate_deck(state) {
    let deck = [];
    let { values, suits } = state;
    let card = (values, suits) => {
      let name = `${values}${suits}`;
      return name;
    };
    for (let s = 0; s < suits.length; s++) {
      for (let v = 0; v < values.length; v++) {
        deck.push(card(suits[s], values[v]));
      }
    }
    //shuffle
    let current_ind = deck.length,
      temp_val,
      rand_ind;

    while (0 !== current_ind) {
      rand_ind = Math.floor(Math.random() * current_ind);
      current_ind -= 1;
      temp_val = deck[current_ind];
      deck[current_ind] = deck[rand_ind];
      deck[rand_ind] = temp_val;
    }

    this.setState({ deck });
  }

  deal(deck) {
    this.setState({ dealt_cards: [deck[0], deck[1]] });
  }

  hit(deck) {
    this.setState({ dealt_cards: [deck[0], deck[1], deck[2]] });
  }

  render() {
    return (
      <div className="App">
        <div>
          <h1>Welcome to Blackjack!</h1>
          <div>
            {this.state.deck.length !== 52 ? (
              <button
                className="btn btn-primary"
                onClick={() => this.generate_deck(this.state.initial)}
              >
                Generate and Shuffle Deck!
              </button>
            ) : this.state.dealt_cards.length < 2 ? (
              <div>
                <button
                  className="btn btn-success"
                  onClick={() => this.deal(this.state.deck)}
                >
                  Deal
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-danger controls"
                  onClick={() => this.hit(this.state.deck)}
                >
                  Hit
                </button>
                <button className="btn btn-primary controls">Stay</button>
              </div>
            )}
            {this.state.dealt_cards.length > 0 ? (
              <div className="container">
                {this.state.dealt_cards.map(card => {
                  return (
                    <div key={card} className="bjcard">
                      <h4 className="cardvalue">{card}</h4>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
