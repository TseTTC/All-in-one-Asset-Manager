//App.js

import React, { Component} from "react";
import uniqid from "uniqid";
import Overview from "./Components/overview";




class App extends Component {
  constructor() {
    super();

    this.state = {
      asset: {
        symbol: 0,
        price: 0,
        quantity: 0,
        cost: 0,
        value: 0,
        profit: 0,
        id: uniqid()
      },
      assets: [],
      sum: {
        cost:0,
        value:0,
        profit:0,
      }
      }
    }
    //this.getPrices = this.getPrices.bind(this);
  

 
    



  handleChangeSymbol = (e) => {
    this.setState({
      asset: {
        symbol: e.target.value,
        price: this.state.asset.price,
        quantity: this.state.asset.quantity,
        cost: this.state.asset.cost,
        value: this.state.asset.value,
        profit: this.state.asset.profit,
        id:this.state.asset.id,
      }
    });
    
  };

  handleChangeQuantity = (e) => {
    this.setState({
      asset: {
        symbol: this.state.asset.symbol,
        price: this.state.asset.price,
        quantity: e.target.value,
        cost: this.state.asset.cost,
        value: this.state.asset.value,
        profit: this.state.asset.profit,
        id:this.state.asset.id,
      }
    });
  };
  handleChangeCost = (e) => {
    this.setState({
      asset: {
        symbol: this.state.asset.symbol,
        price: this.state.asset.price,
        quantity: this.state.asset.quantity,
        value: this.state.asset.value,
        profit: this.state.asset.profit,
        cost: e.target.value,
        id:this.state.asset.id,
      }
    });
  };


  onSubmitAsset = (e) => {
      e.preventDefault();
      
      var share = this.state.asset.symbol;
      fetch( `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${share}&apikey=${process.env.REACT_APP_ALPHA_API_KEY}`, {mode: 'cors'})
      .then(response => response.json())
      .then(
        (result) => {
          if (Object.keys(result["Global Quote"]).length === 0 ) {
            console.log("No such symbol")
          }
          else {
          console.log(result["Global Quote"]["05. price"])
          var price = result["Global Quote"]["05. price"]
          
          this.setState({
            asset: {
              symbol: this.state.asset.symbol,
              price: price,
              quantity: this.state.asset.quantity,
              cost: this.state.asset.cost * this.state.asset.quantity,
              value: price * this.state.asset.quantity,
              profit: this.state.asset.quantity * (price - this.state.asset.cost),
              id:this.state.asset.id,
            },
          })
          this.setState({
            sum: {
              cost: this.state.sum.cost + this.state.asset.cost,
              value: this.state.sum.value + this.state.asset.value,
              profit: this.state.sum.profit + this.state.asset.profit
            },
          })
          this.setState({
            assets: this.state.assets.concat(this.state.asset),
            asset: {
              symbol: 0,
              price: 0,
              quantity: 0,
              cost: 0,
              value: 0,
              profit: 0,
              id:uniqid(),
            }
          });
        }
        }
      )
   
    
  };


  render() {
    const { asset, assets } = this.state;
    var numUSD = new Intl.NumberFormat("en-US",
          {
            style: "currency",
            currency: "USD"
          })
    
    return (
      <div>
        <form onSubmit={this.onSubmitAsset}>
          <label htmlFor="assetInput">Enter symbol:</label>
          <input 
            onChange={this.handleChangeSymbol} 
            value = {asset.symbol} 
            type="text" 
            id="assetInput"
            /><br/>
          <label htmlFor="quantityInput">Enter quantity:</label>
          <input 
            onChange={this.handleChangeQuantity} 
            value = {asset.quantity} 
            type="number" 
            id="quantityInput"
            /><br/>
          <label htmlFor="costInput">Enter purchase price:</label>
          <input 
            onChange={this.handleChangeCost} 
            value = {asset.cost} 
            type="number" 
            id="costInput"
            /><br/>
          <button type="submit"  id="submitButton">
            Add Asset
          </button>
        </form>
        <table id="portfolio">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Cost</th>
              <th>Total Value</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>{numUSD.format(this.state.sum.cost)}</th>
              <th>{numUSD.format(this.state.sum.value)}</th>
              <th>{numUSD.format(this.state.sum.profit)}</th>
            </tr>
          </tfoot>
      <Overview assets={assets} />
    </table>
      </div>
    )
  }
}

export default App;
