import './App.css';
import React from 'react';

function TransactionsList(props) {
  const transactions = props.transactions;

  const transactionsList = transactions.map(el => {
    return (
      <table>
        <tr>
          <th>Timestamp</th>
          <td>{el.timeStamp}</td>
        </tr>
        <tr>
          <th>From address</th>
          <td>{el.from}</td>
        </tr>
        <tr>
          <th>To address</th>
          <td>{el.to}</td>
        </tr>
        <tr>
          <th>Value</th>
          <td>{el.value}</td>
        </tr>
        <tr>
          <th>Confirmations</th>
          <td>{el.confirmations}</td>
        </tr>
        <tr>  
          <th>Hash</th>
          <td>{el.hash}</td>
        </tr>
      </table>
    );
  });

  return (<div className='transactions'>
    {transactionsList}
  </div>);

}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      myKeyToken: 'Z9FFQ46HVMZQDSKPHIGZZDHNNU79WQC48I',
      transactions: [],
      requestProcessing: false,
      error: {
        message: '' 
      }
    }
  }

  onClickSend = () => {
    this.setState({
      requestProcessing: true
    }, async () => {
      const requestUrl = new URL('/api', 'https://api.etherscan.io');
      requestUrl.searchParams.append('module', 'account');
      requestUrl.searchParams.append('action', 'txlist');
      requestUrl.searchParams.append('address', this.state.address);
      requestUrl.searchParams.append('startblock', '0');
      requestUrl.searchParams.append('endblock', '99999999');
      requestUrl.searchParams.append('sort', 'asc');
      requestUrl.searchParams.append('apikey', this.state.myKeyToken);
  
      try {
        const response = await fetch(requestUrl.href);
  
        if (response.ok) {
          const payload = await response.json();

          if (payload.status === '1' ) {
            this.setState({
              transactions: payload.result,
              requestProcessing: false,
              error: {
                message: ''
              }
            })
          }
          
          if (payload.status === '0') {
            this.setState({
              error: {
                message: 'Error! Invalid address format'
              },
              requestProcessing: false
            });
          }
        } else {
           this.setState({
             error: {
               message: 'Unable to fetch transactions'
             },
             requestProcessing: false
           })
        } 
      } catch(e) {
        this.setState({
          error: {
            message: 'Unable to fetch transactions, please check site address or your internet network'
          },
          requestProcessing: false
        })
      }
    });
    
  }

  onAddressChange = (e) => {
    this.setState({
      address: e.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <header className="app-header">
          My Transactions List
         </header>
         <main>
           <input
            className='address-input' 
            type='text'
            value={this.state.address}
            onChange={this.onAddressChange}
            placeholder='Please enter your address' 
          />
          <button
            className='send-button'
            onClick={this.onClickSend}
            disabled={this.state.requestProcessing}
            >Send
          </button>

          {this.state.error.message.length > 0 && (
             <div className='error-message'>
               {this.state.error.message}
             </div>
          )}
          {this.state.transactions.length > 0 && (
            <React.Fragment>
              <h2 className='transactions-count'>Total {this.state.transactions.length} transactions</h2>
              <TransactionsList 
                transactions = {this.state.transactions}
              />
            </React.Fragment>
          )}
         </main>
      </div>
    );
  }
  
}

export default App;
